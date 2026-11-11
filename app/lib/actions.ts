
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: process.env.POSTGRES_URL?.includes('127.0.0.1')
    ? false
    : 'require',
});

// ======================================
// AUTHENTICATION
// ======================================

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

// ======================================
// REFRESH ALL AFFECTED PAGES
// ======================================

function refreshDashboardPages() {
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/invoices');
  revalidatePath('/dashboard/customers');
}

// ======================================
// INVOICE VALIDATION
// ======================================

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({
  id: true,
  date: true,
});

const UpdateInvoice = FormSchema.omit({
  id: true,
  date: true,
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// ======================================
// DELETE INVOICE
// ======================================

export async function deleteInvoice(id: string) {
  await sql`
    DELETE FROM invoices
    WHERE id = ${id}
  `;

  refreshDashboardPages();
}

// ======================================
// UPDATE INVOICE
// ======================================

export async function updateInvoice(
  id: string,
  formData: FormData,
) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId},
        amount = ${amountInCents},
        status = ${status}
    WHERE id = ${id}
  `;

  refreshDashboardPages();

  redirect('/dashboard/invoices');
}

// ======================================
// CREATE INVOICE
// ======================================

export async function createInvoice(
  prevState: State,
  formData: FormData,
) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error('Database Error:', error);

    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  refreshDashboardPages();

  redirect('/dashboard/invoices');
}

// ======================================
// CUSTOMER VALIDATION
// ======================================

const CustomerSchema = z.object({
  name: z.string().min(1, 'Please enter the customer name.'),
  email: z.string().email('Please enter a valid email address.'),
  image_url: z.string().min(1, 'Please provide a customer image.'),
});

const CreateCustomer = CustomerSchema;
const UpdateCustomer = CustomerSchema;

// ======================================
// CUSTOMER STATE
// ======================================

export type CustomerState = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

// ======================================
// CREATE CUSTOMER
// ======================================

export async function createCustomer(
  prevState: CustomerState,
  formData: FormData,
) {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Customer.',
    };
  }

  const { name, email, image_url } = validatedFields.data;

  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${image_url})
    `;
  } catch (error) {
    console.error('Database Error:', error);

    return {
      message: 'Database Error: Failed to Create Customer.',
    };
  }

  refreshDashboardPages();

  redirect('/dashboard/customers');
}

// ======================================
// UPDATE CUSTOMER
// ======================================

export async function updateCustomer(
  id: string,
  formData: FormData,
) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url'),
  });

  if (!validatedFields.success) {
    throw new Error('Invalid customer information.');
  }

  const { name, email, image_url } = validatedFields.data;

  await sql`
    UPDATE customers
    SET name = ${name},
        email = ${email},
        image_url = ${image_url}
    WHERE id = ${id}
  `;

  refreshDashboardPages();
  revalidatePath(`/dashboard/customers/${id}`);

  redirect('/dashboard/customers');
}

// ======================================
// DELETE CUSTOMER
// ======================================

export async function deleteCustomer(id: string) {
  // Check whether the customer has invoices.
  const invoices = await sql`
    SELECT id
    FROM invoices
    WHERE customer_id = ${id}
    LIMIT 1
  `;

  // Protect invoices from being lost.
  if (invoices.length > 0) {
    throw new Error(
      'This customer has invoices and cannot be deleted.',
    );
  }

  // Delete customer if no invoices exist.
  await sql`
    DELETE FROM customers
    WHERE id = ${id}
  `;

  refreshDashboardPages();
}

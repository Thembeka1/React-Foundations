
'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { createCustomer, CustomerState } from '@/app/lib/actions';

export default function CreateCustomerForm() {
  const initialState: CustomerState = { message: null, errors: {} };

  const [state, formAction] = useActionState(
    createCustomer,
    initialState,
  );

  return (
    <form action={formAction} className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Customer Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter customer name"
          required
          className="w-full rounded-md border border-gray-300 p-3"
        />
        {state.errors?.name?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-500">{error}</p>
        ))}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email address"
          required
          className="w-full rounded-md border border-gray-300 p-3"
        />
        {state.errors?.email?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-500">{error}</p>
        ))}
      </div>

      <div className="mb-4">
        <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
          Profile Image URL
        </label>
        <input
          id="image_url"
          name="image_url"
          type="text"
          placeholder="/customers/customer-1.png"
          required
          className="w-full rounded-md border border-gray-300 p-3"
        />
        {state.errors?.image_url?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-500">{error}</p>
        ))}
      </div>

      {state.message && (
        <p className="mb-4 text-sm text-red-500">{state.message}</p>
      )}

      <div className="flex justify-end gap-3">
        <Link
          href="/dashboard/customers"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create Customer
        </button>
      </div>
    </form>
  );
}

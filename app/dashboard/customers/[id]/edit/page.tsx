
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchCustomerById } from '@/app/lib/data';
import { updateCustomer } from '@/app/lib/actions';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await fetchCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Edit Customer
      </h1>

      <p className="mb-6 text-sm text-gray-500">
        Update the customer's information below.
      </p>

      <form
        action={updateCustomer.bind(null, id)}
        className="rounded-lg border border-gray-200 bg-white p-6"
      >
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={customer.name}
            required
            className="w-full rounded-md border border-gray-300 p-3"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={customer.email}
            required
            className="w-full rounded-md border border-gray-300 p-3"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Profile Image URL
          </label>
          <input
            id="image_url"
            name="image_url"
            type="text"
            defaultValue={customer.image_url}
            required
            className="w-full rounded-md border border-gray-300 p-3"
          />
        </div>

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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { deleteCustomer } from '@/app/lib/actions';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default async function Page() {
  const customers = await fetchFilteredCustomers('');

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Customers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View customers and manage their invoices.
          </p>
        </div>

        <Link
          href="/dashboard/customers/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Customer
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Invoices</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Paid</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Pending</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/customers/${customer.id}`}
                    className="flex items-center gap-3 font-medium text-gray-900 hover:text-blue-600"
                  >
                    <Image
                      src={customer.image_url}
                      alt={`${customer.name}'s profile`}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    {customer.name}
                  </Link>
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {customer.email}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {customer.total_invoices}
                </td>

                <td className="px-4 py-3 text-green-600">
                  {customer.total_paid}
                </td>

                <td className="px-4 py-3 text-orange-500">
                  {customer.total_pending}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/dashboard/customers/${customer.id}/invoices`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View Invoices
                    </Link>

                    {/* Edit button */}
                    <Link
                      href={`/dashboard/customers/${customer.id}/edit`}
                      className="rounded-md border border-gray-200 p-2 hover:bg-gray-100"
                      title="Edit customer"
                      aria-label="Edit customer"
                    >
                      <PencilIcon className="h-5 w-5 text-gray-600" />
                    </Link>

                    {/* Delete button */}
                    <form action={deleteCustomer.bind(null, customer.id)}>
                      <button
                        type="submit"
                        className="rounded-md border border-gray-200 p-2 hover:bg-red-50"
                        title="Delete customer"
                        aria-label="Delete customer"
                      >
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            No customers found.
          </p>
        )}
      </div>
    </div>
  );
}

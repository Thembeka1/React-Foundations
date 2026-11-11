
import { fetchInvoicesByCustomerId } from '@/app/lib/data';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PlusIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoices = await fetchInvoicesByCustomerId(id);

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === 'paid'
  ).length;
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === 'pending'
  ).length;

  return (
    <div className="w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/customers"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Customers
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">
            Customer Invoices
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage invoices for this customer.
          </p>
        </div>

        <Link
          href={`/dashboard/invoices/create?customerId=${id}`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" />
          Create Invoice
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Total Invoices
            </p>
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">
            {totalInvoices}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Paid Invoices
            </p>
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
          </div>
          <p className="mt-3 text-3xl font-bold text-green-600">
            {paidInvoices}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              Pending Invoices
            </p>
            <ClockIcon className="h-6 w-6 text-orange-500" />
          </div>
          <p className="mt-3 text-3xl font-bold text-orange-500">
            {pendingInvoices}
          </p>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Invoice History
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            A list of all invoices belonging to this customer.
          </p>
        </div>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Invoice ID</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                      {invoice.id}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {new Date(invoice.date).toLocaleDateString('en-ZA')}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                      {invoice.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              No invoices yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              This customer does not have any invoices. Create the first
              invoice to get started.
            </p>

            <Link
              href={`/dashboard/invoices/create?customerId=${id}`}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              Create First Invoice
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchCustomerById } from '@/app/lib/data';

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
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/dashboard/customers"
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to Customers
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <Image
            src={customer.image_url}
            alt={`${customer.name}'s profile`}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {customer.name}
            </h1>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>

        <hr className="my-6" />

        <h2 className="mb-4 text-lg font-semibold">Customer Summary</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total Invoices</p>
            <p className="mt-1 text-xl font-bold">
              {customer.total_invoices}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="mt-1 text-xl font-bold text-green-600">
              {customer.total_paid}
            </p>
          </div>

          <div className="rounded-lg bg-orange-50 p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="mt-1 text-xl font-bold text-orange-600">
              {customer.total_pending}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href={`/dashboard/customers/${customer.id}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Edit Customer
          </Link>

          <Link
            href={`/dashboard/customers/${customer.id}/invoices`}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm"
          >
            View Invoices
          </Link>
        </div>
      </div>
    </div>
  );
}

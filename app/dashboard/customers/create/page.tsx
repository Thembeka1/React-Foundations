
import Link from 'next/link';
import CreateCustomerForm from './form';

export default function Page() {
  return (
    <main>
      <div className="mb-6">
        <Link
          href="/dashboard/customers"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Customers
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Create Customer
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new customer to your dashboard.
        </p>
      </div>

      <CreateCustomerForm />
    </main>
  );
}

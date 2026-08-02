'use client';

import { Invoice } from '@/lib/data/dummyInvoices';
import { Eye } from 'lucide-react';

interface RecentInvoicesTableProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
}

export function RecentInvoicesTable({ invoices, onView }: RecentInvoicesTableProps) {
  // Sort by date (newest first) before taking the top 5 — otherwise this just
  // shows the first 5 items in whatever order they happen to be stored in,
  // which is not necessarily the most "recent" invoices.
  const recentInvoices = [...invoices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice #</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {recentInvoices.slice(0, 5).map((invoice) => (
            <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-3 text-sm text-gray-800 font-medium">{invoice.invoiceNumber}</td>
              <td className="px-6 py-3 text-sm text-gray-600">{invoice.clientName}</td>
              <td className="px-6 py-3 text-sm text-gray-600">{invoice.date}</td>
              <td className="px-6 py-3 text-sm text-gray-800 font-medium">₹{invoice.total.toFixed(2)}</td>
              <td className="px-6 py-3 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'paid'
                    ? 'bg-green-50 text-green-700'
                    : invoice.status === 'pending'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-3 text-sm flex justify-center">
                <button
                  onClick={() => onView(invoice)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {invoices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No invoices found
        </div>
      )}
    </div>
  );
}

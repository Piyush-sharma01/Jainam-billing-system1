'use client';

import { Invoice } from '@/lib/data/dummyInvoices';
import { Eye, Download, Mail } from 'lucide-react';

interface InvoiceHistoryTableProps {
  invoices: Invoice[];
  onView: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
  onEmail: (invoice: Invoice) => void;
}

export function InvoiceHistoryTable({
  invoices,
  onView,
  onDownload,
  onEmail,
}: InvoiceHistoryTableProps) {
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
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
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
              <td className="px-6 py-3 text-sm flex justify-center gap-2">
                <button
                  onClick={() => onView(invoice)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View invoice"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onDownload(invoice)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Download PDF"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => onEmail(invoice)}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Send email"
                >
                  <Mail size={18} />
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

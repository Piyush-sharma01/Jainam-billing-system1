'use client';

import { Invoice } from '@/lib/data/dummyInvoices';
import { X, Download, Mail } from 'lucide-react';

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice;
  onDownload?: (invoice: Invoice) => void;
  onEmail?: (invoice: Invoice) => void;
}

export function InvoiceViewModal({
  isOpen,
  onClose,
  invoice,
  onDownload,
  onEmail,
}: InvoiceViewModalProps) {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Invoice Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="mb-8 pb-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Jainam</h1>
                <p className="text-gray-600">Billing System</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-800 mb-2">{invoice.invoiceNumber}</p>
                <p className="text-sm text-gray-600">Date: {invoice.date}</p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">BILLED TO:</p>
              <p className="font-medium text-gray-800">{invoice.clientName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">STATUS:</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                invoice.status === 'paid'
                  ? 'bg-green-50 text-green-700'
                  : invoice.status === 'pending'
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Item</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Qty</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">GST %</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-800">{item.productName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">₹{item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.gst}%</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">
                      ₹{item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mb-8 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-800">₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4 pb-4 border-b border-gray-300">
                <span className="text-gray-600">Tax (GST):</span>
                <span className="font-medium text-gray-800">₹{invoice.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-800">Total:</span>
                <span className="text-orange-600">₹{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
            {onDownload && (
              <button
                onClick={() => {
                  onDownload(invoice);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors"
              >
                <Download size={18} />
                Download PDF
              </button>
            )}
            {onEmail && (
              <button
                onClick={() => {
                  onEmail(invoice);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors"
              >
                <Mail size={18} />
                Send Email
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

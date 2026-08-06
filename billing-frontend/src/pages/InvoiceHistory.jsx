import React, { useState, useEffect } from 'react'
import { invoiceAPI } from '../services/api'
import { Eye, Download, Mail, Trash2 } from 'lucide-react'

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, overdue: 0 })

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      setLoading(true)
      const response = await invoiceAPI.getAll()
      const invoices = response.data || []
      setInvoices(invoices)

      const stats = {
        total: invoices.length,
        paid: invoices.filter(i => i.status === 'PAID').length,
        pending: invoices.filter(i => i.status === 'PENDING').length,
        overdue: invoices.filter(i => i.status === 'OVERDUE').length,
      }
      setStats(stats)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
  }

  const handleDownloadInvoice = (invoice) => {
    const lineItemsHtml = (invoice.lineItems || [])
      .map(
        (item) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${item.productName}</td>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">₹${Number(item.unitPrice ?? 0).toFixed(2)}</td>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${Number(item.gstPercentage ?? 0)}%</td>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">₹${Number(item.total ?? 0).toFixed(2)}</td>
          </tr>`
      )
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invoice.invoiceNumber}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; color: #1f2937; padding: 40px; }
            h1 { margin: 0; }
            .muted { color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            th { text-align: left; padding: 8px; border-bottom: 2px solid #1f2937; background: #f9fafb; }
            .totals { margin-top: 16px; width: 280px; margin-left: auto; }
            .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
            .totals .grand { font-weight: bold; font-size: 1.1em; border-top: 2px solid #1f2937; margin-top: 8px; padding-top: 8px; }
          </style>
        </head>
        <body>
          <h1>Jainam Billing System</h1>
          <p class="muted">Invoice ${invoice.invoiceNumber}</p>

          <p><strong>Bill To:</strong> ${invoice.client?.company || 'N/A'}<br/>
          ${invoice.client?.contactPerson || ''}<br/>
          ${invoice.client?.address || ''}<br/>
          GSTIN: ${invoice.client?.gstNumber || 'N/A'}</p>

          <p>
            <strong>Invoice Date:</strong> ${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : 'N/A'}<br/>
            <strong>Due Date:</strong> ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}<br/>
            <strong>Status:</strong> ${invoice.status}
          </p>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Unit Price</th>
                <th style="text-align:right;">GST</th>
                <th style="text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>${lineItemsHtml}</tbody>
          </table>

          <div class="totals">
            <div><span>Subtotal</span><span>₹${Number(invoice.subtotal ?? 0).toFixed(2)}</span></div>
            <div><span>Tax</span><span>₹${Number(invoice.taxAmount ?? 0).toFixed(2)}</span></div>
            <div class="grand"><span>Total</span><span>₹${Number(invoice.grandTotal ?? 0).toFixed(2)}</span></div>
          </div>

          ${invoice.notes ? `<p class="muted" style="margin-top:24px;"><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
        </body>
      </html>`

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to download the invoice.')
      return
    }
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onload = () => printWindow.print()
  }

  const handleSendEmail = async (id) => {
    const email = prompt('Enter client email:')
    if (email) {
      try {
        await invoiceAPI.sendEmail(id, email)
        alert('Email sent successfully')
      } catch (err) {
        alert('Failed to send email: ' + (err.response?.data || err.message))
      }
    }
  }

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Delete this invoice? This cannot be undone.')) return
    try {
      await invoiceAPI.delete(id)
      loadInvoices()
    } catch (err) {
      alert('Failed to delete invoice: ' + (err.response?.data?.message || err.message))
    }
  }

  const StatCard = ({ label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4">
      <p className="text-gray-500 text-xs sm:text-sm">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Invoice History</h1>
        <p className="text-gray-500 text-sm sm:text-base">View all invoices and their status</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Invoices" value={stats.total} color="text-blue-600" />
        <StatCard label="Paid" value={stats.paid} color="text-green-600" />
        <StatCard label="Pending" value={stats.pending} color="text-yellow-600" />
        <StatCard label="Overdue" value={stats.overdue} color="text-red-600" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No invoices found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Invoice No.</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Client</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-800">{invoice.invoiceNumber}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">{invoice.client?.company || 'N/A'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-800">
                      ₹{invoice.grandTotal?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="text-green-600 hover:text-green-800"
                        title="Download PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleSendEmail(invoice.id)}
                        className="text-orange-600 hover:text-orange-800"
                        title="Send Email"
                      >
                        <Mail size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">{selectedInvoice.invoiceNumber}</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Client: {selectedInvoice.client?.company || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Date: {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
            </p>
            <div className="space-y-2 mb-4">
              {(selectedInvoice.lineItems || []).map((item, idx) => (
                <div key={idx} className="flex justify-between gap-2 text-sm text-gray-700 border-b pb-2">
                  <span className="truncate">{item.productName} x {item.quantity}</span>
                  <span className="shrink-0">₹{item.total?.toFixed(2) || '0.00'}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Subtotal</span>
              <span>₹{selectedInvoice.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tax</span>
              <span>₹{selectedInvoice.taxAmount?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 pt-2 border-t">
              <span>Total</span>
              <span>₹{selectedInvoice.grandTotal?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

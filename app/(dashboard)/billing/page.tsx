'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useData } from '@/lib/context/DataContext';
import { Invoice, LineItem } from '@/lib/data/dummyInvoices';
import { InvoiceViewModal } from '@/components/modals/InvoiceViewModal';
import { Trash2, Plus } from 'lucide-react';

interface LineItemForm extends LineItem {
  tempId: string;
}

export default function BillingPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { products, clients, addInvoice, getNextInvoiceNumber } = useData();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [lineItems, setLineItems] = useState<LineItemForm[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | undefined>();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const addLineItem = () => {
    const newItem: LineItemForm = {
      tempId: Math.random().toString(),
      productId: '',
      productName: '',
      quantity: 1,
      price: 0,
      gst: 0,
      subtotal: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (tempId: string) => {
    setLineItems(lineItems.filter(item => item.tempId !== tempId));
  };

  const updateLineItem = (tempId: string, field: string, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.tempId !== tempId) return item;

      const updated = { ...item, [field]: value };

      // If product selected, update product details
      if (field === 'productId' && value) {
        const product = products.find(p => p.id === value);
        if (product) {
          updated.productName = product.name;
          updated.price = product.price;
          updated.gst = product.gst;
        }
      }

      // Recalculate subtotal for any field change that affects the total
      // including productId (which updates price and gst above)
      const qty = field === 'quantity' ? Number(value) : updated.quantity;
      const price = field === 'price' ? Number(value) : updated.price;
      const gst = field === 'gst' ? Number(value) : updated.gst;
      updated.subtotal = qty * price + (qty * price * gst / 100);

      return updated;
    }));
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => {
      const baseTotal = item.quantity * item.price;
      return sum + baseTotal;
    }, 0);

    const taxAmount = lineItems.reduce((sum, item) => {
      const baseTotal = item.quantity * item.price;
      return sum + (baseTotal * item.gst / 100);
    }, 0);

    return { subtotal, taxAmount, total: subtotal + taxAmount };
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  const handleGenerateInvoice = () => {
    if (!selectedClientId) {
      alert('Please select a client');
      return;
    }

    if (lineItems.length === 0) {
      alert('Please add at least one product');
      return;
    }

    const hasUnselectedProducts = lineItems.some(item => !item.productId);
    if (hasUnselectedProducts) {
      alert('Please select a product for each line item');
      return;
    }

    const cleanLineItems: LineItem[] = lineItems.map(({ tempId, ...rest }) => rest);

    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: getNextInvoiceNumber(),
      clientId: selectedClientId,
      clientName: selectedClient?.company || '',
      date: invoiceDate,
      lineItems: cleanLineItems,
      subtotal,
      taxAmount,
      total,
      status: 'pending',
    };

    addInvoice(newInvoice);
    setPreviewInvoice(newInvoice);
    setShowPreview(true);

    // Reset form
    setSelectedClientId('');
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setLineItems([]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Create Invoice</h1>
          <p className="text-gray-600 mt-1">Generate a new invoice for your client</p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Client and Date Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Client</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">-- Choose a client --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.company} ({client.contactPerson})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Line Items Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Line Items</h3>
              <button
                onClick={addLineItem}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {/* Line Items Table */}
            {lineItems.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">Product</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700 w-20">Qty</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700 w-24">Price</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700 w-16">GST %</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700 w-24">Amount</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-700 w-10">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map(item => (
                      <tr key={item.tempId} className="border-b border-gray-200">
                        <td className="px-4 py-3">
                          <select
                            value={item.productId}
                            onChange={(e) => updateLineItem(item.tempId, 'productId', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            required
                          >
                            <option value="">Select product</option>
                            {products.map(prod => (
                              <option key={prod.id} value={prod.id}>
                                {prod.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.tempId, 'quantity', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.price}
                            onChange={(e) => updateLineItem(item.tempId, 'price', parseFloat(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-right"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.gst}
                            onChange={(e) => updateLineItem(item.tempId, 'gst', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-center"
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">
                          ₹{item.subtotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => removeLineItem(item.tempId)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600">No items added yet. Click &quot;Add Item&quot; to start.</p>
              </div>
            )}
          </div>

          {/* Totals */}
          {lineItems.length > 0 && (
            <div className="flex justify-end">
              <div className="w-64 space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 pb-2 border-b border-gray-300">
                  <span>Tax (GST):</span>
                  <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-orange-600">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setSelectedClientId('');
                setLineItems([]);
                setInvoiceDate(new Date().toISOString().split('T')[0]);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleGenerateInvoice}
              disabled={lineItems.length === 0 || !selectedClientId}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Generate Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <InvoiceViewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        invoice={previewInvoice}
        onDownload={() => alert('Invoice PDF downloaded (mock)')}
        onEmail={() => alert('Invoice sent via email (mock)')}
      />
    </MainLayout>
  );
}

'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { InvoiceHistoryTable } from '@/components/tables/InvoiceHistoryTable';
import { InvoiceViewModal } from '@/components/modals/InvoiceViewModal';
import { useData } from '@/lib/context/DataContext';
import { Invoice } from '@/lib/data/dummyInvoices';

export default function InvoiceHistoryPage() {
  const { isLoggedIn } = useAuth();
  const { invoices } = useData();
  const router = useRouter();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice.invoiceNumber);
    alert(`Invoice ${invoice.invoiceNumber} downloaded as PDF (mock)`);
  };

  const handleEmailInvoice = (invoice: Invoice) => {
    console.log('Email invoice:', invoice.invoiceNumber);
    alert(`Invoice ${invoice.invoiceNumber} sent via email to ${invoice.clientName} (mock)`);
  };

  // Sort invoices by date (newest first)
  const sortedInvoices = [...invoices].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Invoice History</h1>
          <p className="text-gray-600 mt-1">View and manage all your invoices</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 font-medium">Total Invoices</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">{invoices.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 font-medium">Paid</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {invoices.filter(i => i.status === 'paid').length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {invoices.filter(i => i.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 font-medium">Overdue</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {invoices.filter(i => i.status === 'overdue').length}
            </p>
          </div>
        </div>

        {/* Invoices Table */}
        <InvoiceHistoryTable
          invoices={sortedInvoices}
          onView={handleViewInvoice}
          onDownload={handleDownloadInvoice}
          onEmail={handleEmailInvoice}
        />
      </div>

      {/* Invoice View Modal */}
      <InvoiceViewModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={selectedInvoice}
        onDownload={handleDownloadInvoice}
        onEmail={handleEmailInvoice}
      />
    </MainLayout>
  );
}

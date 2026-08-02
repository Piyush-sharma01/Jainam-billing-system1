'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { RecentInvoicesTable } from '@/components/tables/RecentInvoicesTable';
import { useData } from '@/lib/context/DataContext';
import { InvoiceViewModal } from '@/components/modals/InvoiceViewModal';
import { Invoice } from '@/lib/data/dummyInvoices';
import { ShoppingCart, Package, Users, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const { products, clients, invoices } = useData();
  const router = useRouter();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  // Calculate totals
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalBills = invoices.length;

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice.invoiceNumber);
    alert(`Invoice ${invoice.invoiceNumber} downloaded (mock)`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your billing management system</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Products"
            value={products.length}
            icon={<Package size={32} />}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <SummaryCard
            title="Total Clients"
            value={clients.length}
            icon={<Users size={32} />}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <SummaryCard
            title="Total Invoices"
            value={totalBills}
            icon={<ShoppingCart size={32} />}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <SummaryCard
            title="Total Revenue"
            value={`₹${totalRevenue.toFixed(0)}`}
            icon={<TrendingUp size={32} />}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>

        {/* Recent Invoices Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Invoices</h2>
            <p className="text-gray-600 text-sm mt-1">Latest 5 invoices from your system</p>
          </div>
          <RecentInvoicesTable
            invoices={invoices}
            onView={handleViewInvoice}
          />
        </div>
      </div>

      {/* Invoice View Modal */}
      <InvoiceViewModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={selectedInvoice}
        onDownload={handleDownloadInvoice}
      />
    </MainLayout>
  );
}

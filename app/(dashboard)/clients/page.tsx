'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ClientsTable } from '@/components/tables/ClientsTable';
import { ClientModal } from '@/components/modals/ClientModal';
import { useData } from '@/lib/context/DataContext';
import { Client } from '@/lib/data/dummyClients';
import { Plus, Search } from 'lucide-react';

export default function ClientsPage() {
  const { isLoggedIn } = useAuth();
  const { clients, addClient, updateClient, deleteClient } = useData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  if (!isLoggedIn) return null;

  const handleAdd = () => {
    setSelectedClient(undefined);
    setShowModal(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleSubmit = (client: Client) => {
    if (selectedClient) {
      updateClient(selectedClient.id, client);
    } else {
      addClient(client);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
            <p className="text-gray-600 mt-1">Manage your client database</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Plus size={20} />
            Add Client
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search clients by company, name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Clients Table */}
        <ClientsTable
          clients={filteredClients}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Result Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredClients.length} of {clients.length} clients
        </div>
      </div>

      {/* Client Modal */}
      <ClientModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        client={selectedClient}
      />
    </MainLayout>
  );
}

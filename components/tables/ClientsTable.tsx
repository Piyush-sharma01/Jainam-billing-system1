'use client';

import { Client } from '@/lib/data/dummyClients';
import { Edit, Trash2 } from 'lucide-react';

interface ClientsTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export function ClientsTable({ clients, onEdit, onDelete }: ClientsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact Person</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">GST Number</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-3 text-sm text-gray-800 font-medium">{client.company}</td>
              <td className="px-6 py-3 text-sm text-gray-600">{client.contactPerson}</td>
              <td className="px-6 py-3 text-sm text-gray-600">{client.phone}</td>
              <td className="px-6 py-3 text-sm text-gray-600">{client.email}</td>
              <td className="px-6 py-3 text-sm text-gray-600">{client.gstNumber}</td>
              <td className="px-6 py-3 text-sm flex justify-center gap-2">
                <button
                  onClick={() => onEdit(client)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(client.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {clients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No clients found
        </div>
      )}
    </div>
  );
}

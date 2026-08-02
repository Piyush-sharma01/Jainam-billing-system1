'use client';

import { Product } from '@/lib/data/dummyProducts';
import { Edit, Trash2 } from 'lucide-react';

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">GST %</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-3 text-sm text-gray-800 font-medium">{product.name}</td>
              <td className="px-6 py-3 text-sm text-gray-600">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  {product.category}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-gray-800 font-medium">₹{product.price.toFixed(2)}</td>
              <td className="px-6 py-3 text-sm text-gray-600">{product.gst}%</td>
              <td className="px-6 py-3 text-sm text-gray-600">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.stock > 20 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {product.stock} units
                </span>
              </td>
              <td className="px-6 py-3 text-sm flex justify-center gap-2">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found
        </div>
      )}
    </div>
  );
}

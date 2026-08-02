'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProductsTable } from '@/components/tables/ProductsTable';
import { ProductModal } from '@/components/modals/ProductModal';
import { useData } from '@/lib/context/DataContext';
import { Product } from '@/lib/data/dummyProducts';
import { Plus, Search } from 'lucide-react';

export default function ProductsPage() {
  const { isLoggedIn } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  if (!isLoggedIn) return null;

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleSubmit = (product: Product) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, product);
    } else {
      addProduct(product);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Products Table */}
        <ProductsTable
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Result Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        product={selectedProduct}
      />
    </MainLayout>
  );
}

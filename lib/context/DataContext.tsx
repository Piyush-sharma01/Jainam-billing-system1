'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, dummyProducts } from '@/lib/data/dummyProducts';
import { Client, dummyClients } from '@/lib/data/dummyClients';
import { Invoice, dummyInvoices } from '@/lib/data/dummyInvoices';

interface DataContextType {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Clients
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Client) => void;
  deleteClient: (id: string) => void;
  
  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  getNextInvoiceNumber: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Initialize with dummy data on mount
  useEffect(() => {
    setProducts(dummyProducts);
    setClients(dummyClients);
    setInvoices(dummyInvoices);
  }, []);

  // Product operations
  const addProduct = (product: Product) => {
    const newProduct = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, product: Product) => {
    setProducts(products.map(p => (p.id === id ? { ...product, id } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Client operations
  const addClient = (client: Client) => {
    const newClient = {
      ...client,
      id: Math.random().toString(36).substr(2, 9),
    };
    setClients([...clients, newClient]);
  };

  const updateClient = (id: string, client: Client) => {
    setClients(clients.map(c => (c.id === id ? { ...client, id } : c)));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  // Invoice operations
  const addInvoice = (invoice: Invoice) => {
    setInvoices([...invoices, invoice]);
  };

  const getNextInvoiceNumber = () => {
    const numbers = invoices.map(inv => {
      const num = inv.invoiceNumber.split('-')[1];
      return parseInt(num, 10);
    });
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
    return `INV-${String(maxNum + 1).padStart(3, '0')}`;
  };

  return (
    <DataContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        clients,
        addClient,
        updateClient,
        deleteClient,
        invoices,
        addInvoice,
        getNextInvoiceNumber,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

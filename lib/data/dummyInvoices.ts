export interface LineItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  gst: number;
  subtotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  lineItems: LineItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
}

export const dummyInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    clientId: '1',
    clientName: 'BuildCo Construction',
    date: '2024-12-15',
    lineItems: [
      {
        productId: '1',
        productName: 'PVC Pipe 2"',
        quantity: 10,
        price: 450,
        gst: 12,
        subtotal: 5040,
      },
      {
        productId: '4',
        productName: 'Brass Ball Valve',
        quantity: 5,
        price: 250,
        gst: 12,
        subtotal: 1400,
      },
    ],
    subtotal: 5750,
    taxAmount: 690,
    total: 6440,
    status: 'paid',
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    clientId: '2',
    clientName: 'AquaFlow Systems',
    date: '2024-12-14',
    lineItems: [
      {
        productId: '3',
        productName: 'Copper Pipe 1"',
        quantity: 8,
        price: 380,
        gst: 12,
        subtotal: 3404.8,
      },
    ],
    subtotal: 3040,
    taxAmount: 364.8,
    total: 3404.8,
    status: 'paid',
  },
  {
    id: '3',
    invoiceNumber: 'INV-003',
    clientId: '3',
    clientName: 'HomeRepair Services',
    date: '2024-12-13',
    lineItems: [
      {
        productId: '6',
        productName: 'Teflon Tape',
        quantity: 20,
        price: 45,
        gst: 5,
        subtotal: 945,
      },
      {
        productId: '7',
        productName: 'Coupling Union',
        quantity: 15,
        price: 95,
        gst: 12,
        subtotal: 1596,
      },
    ],
    subtotal: 2325,
    taxAmount: 216,
    total: 2541,
    status: 'pending',
  },
  {
    id: '4',
    invoiceNumber: 'INV-004',
    clientId: '4',
    clientName: 'Industrial Pipes Ltd',
    date: '2024-12-12',
    lineItems: [
      {
        productId: '8',
        productName: 'Galvanized Pipe 3"',
        quantity: 12,
        price: 650,
        gst: 12,
        subtotal: 8736,
      },
      {
        productId: '9',
        productName: 'Flow Control Valve',
        quantity: 3,
        price: 320,
        gst: 12,
        subtotal: 1075.2,
      },
    ],
    subtotal: 8760,
    taxAmount: 1051.2,
    total: 9811.2,
    status: 'overdue',
  },
  {
    id: '5',
    invoiceNumber: 'INV-005',
    clientId: '5',
    clientName: 'Urban Construction Co',
    date: '2024-12-11',
    lineItems: [
      {
        productId: '2',
        productName: 'Steel Elbow 90°',
        quantity: 25,
        price: 120,
        gst: 12,
        subtotal: 3360,
      },
    ],
    subtotal: 3000,
    taxAmount: 360,
    total: 3360,
    status: 'paid',
  },
];

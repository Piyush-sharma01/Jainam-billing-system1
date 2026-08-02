export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  gst: number;
  stock: number;
  description: string;
}

export const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'PVC Pipe 2"',
    category: 'Pipes',
    price: 450,
    gst: 12,
    stock: 50,
    description: 'High quality PVC pipe for water supply',
  },
  {
    id: '2',
    name: 'Steel Elbow 90°',
    category: 'Fittings',
    price: 120,
    gst: 12,
    stock: 150,
    description: 'Industrial grade steel elbow',
  },
  {
    id: '3',
    name: 'Copper Pipe 1"',
    category: 'Pipes',
    price: 380,
    gst: 12,
    stock: 30,
    description: 'Premium copper pipe for plumbing',
  },
  {
    id: '4',
    name: 'Brass Ball Valve',
    category: 'Valves',
    price: 250,
    gst: 12,
    stock: 80,
    description: 'Durable brass ball valve',
  },
  {
    id: '5',
    name: 'Pipe Wrench',
    category: 'Tools',
    price: 580,
    gst: 18,
    stock: 25,
    description: 'Professional pipe wrench tool',
  },
  {
    id: '6',
    name: 'Teflon Tape',
    category: 'Accessories',
    price: 45,
    gst: 5,
    stock: 200,
    description: 'PTFE thread seal tape',
  },
  {
    id: '7',
    name: 'Coupling Union',
    category: 'Fittings',
    price: 95,
    gst: 12,
    stock: 120,
    description: 'Stainless steel coupling union',
  },
  {
    id: '8',
    name: 'Galvanized Pipe 3"',
    category: 'Pipes',
    price: 650,
    gst: 12,
    stock: 40,
    description: 'Corrosion resistant galvanized pipe',
  },
  {
    id: '9',
    name: 'Flow Control Valve',
    category: 'Valves',
    price: 320,
    gst: 12,
    stock: 60,
    description: 'Precision flow control valve',
  },
  {
    id: '10',
    name: 'Pipe Cutter',
    category: 'Tools',
    price: 420,
    gst: 18,
    stock: 35,
    description: 'Heavy duty pipe cutter tool',
  },
];

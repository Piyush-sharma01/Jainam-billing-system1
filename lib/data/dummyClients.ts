export interface Client {
  id: string;
  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstNumber: string;
  address: string;
}

export const dummyClients: Client[] = [
  {
    id: '1',
    company: 'BuildCo Construction',
    contactPerson: 'Rajesh Kumar',
    phone: '9876543210',
    email: 'rajesh@buildco.com',
    gstNumber: '27AABCU9603R2Z5',
    address: '123 Industrial Zone, Pune',
  },
  {
    id: '2',
    company: 'AquaFlow Systems',
    contactPerson: 'Priya Patel',
    phone: '9876543211',
    email: 'priya@aquaflow.com',
    gstNumber: '27AABCU9603R2Z6',
    address: '456 Tech Park, Mumbai',
  },
  {
    id: '3',
    company: 'HomeRepair Services',
    contactPerson: 'Amit Singh',
    phone: '9876543212',
    email: 'amit@homerepair.com',
    gstNumber: '27AABCU9603R2Z7',
    address: '789 Market Street, Bangalore',
  },
  {
    id: '4',
    company: 'Industrial Pipes Ltd',
    contactPerson: 'Vikram Desai',
    phone: '9876543213',
    email: 'vikram@industrialpipes.com',
    gstNumber: '27AABCU9603R2Z8',
    address: '321 Industrial Area, Ahmedabad',
  },
  {
    id: '5',
    company: 'Urban Construction Co',
    contactPerson: 'Neha Gupta',
    phone: '9876543214',
    email: 'neha@urbanconstruction.com',
    gstNumber: '27AABCU9603R2Z9',
    address: '654 Lakeside, Delhi',
  },
  {
    id: '6',
    company: 'PlumbPro Services',
    contactPerson: 'Suresh Nair',
    phone: '9876543215',
    email: 'suresh@plumbpro.com',
    gstNumber: '27AABCU9603R2Z0',
    address: '987 Commerce Street, Kolkata',
  },
  {
    id: '7',
    company: 'Renovation Experts',
    contactPerson: 'Deepika Roy',
    phone: '9876543216',
    email: 'deepika@renovationexperts.com',
    gstNumber: '27AABCU9603R2Z1',
    address: '147 Greenfield, Hyderabad',
  },
  {
    id: '8',
    company: 'MainFlow Distribution',
    contactPerson: 'Rohit Sharma',
    phone: '9876543217',
    email: 'rohit@mainflow.com',
    gstNumber: '27AABCU9603R2Z2',
    address: '258 Trade Center, Chennai',
  },
];

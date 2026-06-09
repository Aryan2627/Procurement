import fs from 'fs';
import path from 'path';

// Interfaces matching Prisma schema
export interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'BUYER' | 'VENDOR';
  companyId: string | null;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string | null;
  employees: number | null;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  address: string | null;
  rating: number;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  documents: string | null;
  companyId: string | null;
  createdAt: string;
}

export interface RFQ {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  budget: number;
  deadline: string;
  documents: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  buyerId: string;
  selectedVendors: string | null; // Comma-separated vendor IDs
  createdAt: string;
}

export interface Quotation {
  id: string;
  rfqId: string;
  vendorId: string;
  price: number;
  tax: number;
  deliveryDate: string;
  documents: string | null;
  status: 'SUBMITTED' | 'WON' | 'LOST';
  createdAt: string;
}

export interface Auction {
  id: string;
  rfqId: string;
  title: string;
  startTime: string;
  endTime: string;
  currentBid: number;
  minDecrement: number;
  bids: string | null; // JSON Array of bids
  status: 'ACTIVE' | 'COMPLETED';
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  quotationId: string;
  vendorId: string;
  buyerId: string;
  totalPrice: number;
  tax: number;
  deliveryDate: string;
  status: 'PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
}

export interface Invoice {
  id: string;
  purchaseOrderId: string;
  invoiceNumber: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  documents: string | null;
  uploadedById: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  type: 'RFQ' | 'PO' | 'INVOICE';
  targetId: string;
  currentLevel: 'MANAGER' | 'FINANCE' | 'PROCUREMENT_HEAD' | 'ADMIN';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  chainState: string | null; // JSON String representing approval levels
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  companyId: string;
  plan: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  interval: 'MONTHLY' | 'ANNUAL';
  status: 'ACTIVE' | 'CANCELLED';
  expiresAt: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string | null;
  ipAddress: string | null;
  createdAt: string;
}

export interface MockSchema {
  users: User[];
  companies: Company[];
  vendors: Vendor[];
  rfqs: RFQ[];
  quotations: Quotation[];
  auctions: Auction[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  approvals: Approval[];
  notifications: Notification[];
  subscriptions: Subscription[];
  auditLogs: AuditLog[];
}

const FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'mock-db.json');

// Helper to check if file exists
function ensureFileExists() {
  const dirPath = path.dirname(FILE_PATH);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    const seedData = getSeedData();
    fs.writeFileSync(FILE_PATH, JSON.stringify(seedData, null, 2), 'utf-8');
  }
}

export function readMockDb(): MockSchema {
  try {
    ensureFileExists();
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data) as MockSchema;
  } catch (error) {
    console.error('Error reading mock database, using in-memory fallback:', error);
    return getSeedData();
  }
}

export function writeMockDb(data: MockSchema) {
  try {
    ensureFileExists();
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write to mock database:', error);
  }
}

function getSeedData(): MockSchema {
  const companyId1 = 'c1';
  const companyId2 = 'c2';

  const userBuyerId = 'u-buyer';
  const userVendorId = 'u-vendor';
  const userAdminId = 'u-admin';

  return {
    companies: [
      { id: companyId1, name: 'Acme Procurement Corp', industry: 'Logistics', employees: 250, createdAt: new Date().toISOString() },
      { id: companyId2, name: 'Nexis Tech Systems', industry: 'Technology', employees: 50, createdAt: new Date().toISOString() }
    ],
    users: [
      { id: userBuyerId, name: 'Alex Harrison', email: 'buyer@procure.ai', role: 'BUYER', companyId: companyId1, createdAt: new Date().toISOString() },
      { id: userVendorId, name: 'Sanjay Kumar', email: 'vendor@procure.ai', role: 'VENDOR', companyId: companyId2, createdAt: new Date().toISOString() },
      { id: userAdminId, name: 'Sarah Connor', email: 'admin@procure.ai', role: 'ADMIN', companyId: companyId1, createdAt: new Date().toISOString() }
    ],
    vendors: [
      { id: 'v1', name: 'TechCorp Solutions Inc.', contactPerson: 'John Smith', email: 'sales@techcorp.com', phone: '+1 555-0199', gstNumber: '29AAAAA1111A1Z1', panNumber: 'AAAAA1111A', address: '128 Tech Blvd, San Francisco, CA', rating: 4.8, status: 'APPROVED', documents: 'doc_cert.pdf', companyId: companyId2, createdAt: new Date().toISOString() },
      { id: 'v2', name: 'Global Office Suppliers Ltd.', contactPerson: 'Emily Davis', email: 'emily@globaloffice.com', phone: '+1 555-0188', gstNumber: '29BBBBB2222B2Z2', panNumber: 'BBBBB2222B', address: '45 Green Park, New York, NY', rating: 4.5, status: 'APPROVED', documents: 'iso_compliance.pdf', companyId: null, createdAt: new Date().toISOString() },
      { id: 'v3', name: 'Alpha Security Systems', contactPerson: 'Vikram Singh', email: 'vikram@alphasec.in', phone: '+91 98765 43210', gstNumber: '07CCCCC3333C3Z3', panNumber: 'CCCCC3333C', address: '102 Connaught Place, New Delhi', rating: 4.2, status: 'APPROVED', documents: 'pan_card.pdf', companyId: null, createdAt: new Date().toISOString() },
      { id: 'v4', name: 'Apex Construction Group', contactPerson: 'Mark Miller', email: 'mark@apexconstruct.com', phone: '+1 555-0122', gstNumber: null, panNumber: null, address: '888 Industrial Ave, Houston, TX', rating: 3.9, status: 'PENDING', documents: null, companyId: null, createdAt: new Date().toISOString() }
    ],
    rfqs: [
      {
        id: 'rfq-1',
        title: 'Office Laptops Upgrade Q3',
        description: 'Procurement of 50 high-end Developer Laptops. Required specifications: 32GB RAM, 1TB SSD, 14-inch display, Intel Core i7 or M3 processor.',
        category: 'Hardware',
        quantity: 50,
        budget: 75000,
        deadline: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
        documents: 'laptop_specs.docx',
        status: 'PUBLISHED',
        buyerId: userBuyerId,
        selectedVendors: 'v1,v2',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
      },
      {
        id: 'rfq-2',
        title: 'Enterprise Server Hosting Rack',
        description: 'Server storage hosting cabinets, 42U Server Racks, Dual-input PDU, cable trays, and biometric locks setup.',
        category: 'Infrastructure',
        quantity: 8,
        budget: 24000,
        deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
        documents: null,
        status: 'PUBLISHED',
        buyerId: userBuyerId,
        selectedVendors: 'v1,v3',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: 'rfq-3',
        title: 'Q3 Office Stationery Supplies',
        description: 'Bulk order of premium branded pens, notebooks, sticky notes, markers, and printer paper bundles.',
        category: 'Office Supplies',
        quantity: 200,
        budget: 3500,
        deadline: new Date(Date.now() - 86400000).toISOString(), // Past deadline
        documents: null,
        status: 'CLOSED',
        buyerId: userBuyerId,
        selectedVendors: 'v2',
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
      }
    ],
    quotations: [
      {
        id: 'q-1',
        rfqId: 'rfq-1',
        vendorId: 'v1',
        price: 72000,
        tax: 3600,
        deliveryDate: new Date(Date.now() + 86400000 * 14).toISOString(),
        documents: 'quote_v1_laptops.pdf',
        status: 'SUBMITTED',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'q-2',
        rfqId: 'rfq-1',
        vendorId: 'v2',
        price: 74500,
        tax: 2980,
        deliveryDate: new Date(Date.now() + 86400000 * 10).toISOString(),
        documents: 'quote_v2_laptops.pdf',
        status: 'SUBMITTED',
        createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString()
      },
      {
        id: 'q-3',
        rfqId: 'rfq-3',
        vendorId: 'v2',
        price: 3200,
        tax: 160,
        deliveryDate: new Date().toISOString(),
        documents: 'stationery_quote.pdf',
        status: 'WON',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
      }
    ],
    auctions: [
      {
        id: 'auc-1',
        rfqId: 'rfq-2',
        title: 'Reverse Auction: Enterprise Server Rack Procurement',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // Ends in 30 minutes
        currentBid: 22800,
        minDecrement: 200,
        bids: JSON.stringify([
          { bidderName: 'TechCorp Solutions Inc.', amount: 24000, timestamp: new Date(Date.now() - 600000).toISOString() },
          { bidderName: 'Alpha Security Systems', amount: 23500, timestamp: new Date(Date.now() - 500000).toISOString() },
          { bidderName: 'TechCorp Solutions Inc.', amount: 23000, timestamp: new Date(Date.now() - 400000).toISOString() },
          { bidderName: 'Alpha Security Systems', amount: 22800, timestamp: new Date(Date.now() - 300000).toISOString() }
        ]),
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      }
    ],
    purchaseOrders: [
      {
        id: 'po-1',
        poNumber: 'PO-2026-0001',
        quotationId: 'q-3',
        vendorId: 'v2',
        buyerId: userBuyerId,
        totalPrice: 3360,
        tax: 160,
        deliveryDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: 'COMPLETED',
        createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
      }
    ],
    invoices: [
      {
        id: 'inv-1',
        purchaseOrderId: 'po-1',
        invoiceNumber: 'INV-GLOBAL-9092',
        amount: 3360,
        status: 'PAID',
        documents: 'invoice_global_office.pdf',
        uploadedById: userVendorId,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ],
    approvals: [
      {
        id: 'app-1',
        type: 'RFQ',
        targetId: 'rfq-1',
        currentLevel: 'FINANCE',
        status: 'PENDING',
        chainState: JSON.stringify({
          MANAGER: { status: 'APPROVED', user: 'Alex Harrison', date: new Date(Date.now() - 86400000).toISOString() },
          FINANCE: { status: 'PENDING', user: 'Finance Team', date: null },
          PROCUREMENT_HEAD: { status: 'PENDING', user: 'Procurement Head', date: null },
          ADMIN: { status: 'PENDING', user: 'Sarah Connor', date: null }
        }),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    notifications: [
      { id: 'n-1', userId: userBuyerId, message: 'Vendor TechCorp Solutions Inc. submitted a bid for RFQ-1.', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'n-2', userId: userBuyerId, message: 'Approval chain initiated for RFQ-1 Office Laptops Upgrade.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    subscriptions: [
      { id: 's-1', companyId: companyId1, plan: 'ENTERPRISE', interval: 'ANNUAL', status: 'ACTIVE', expiresAt: new Date(Date.now() + 86400000 * 300).toISOString(), createdAt: new Date().toISOString() }
    ],
    auditLogs: [
      { id: 'log-1', userId: userBuyerId, action: 'CREATE_RFQ', details: 'Created RFQ Office Laptops Upgrade Q3 (rfq-1)', ipAddress: '192.168.1.1', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 'log-2', userId: userVendorId, action: 'SUBMIT_QUOTE', details: 'Submitted Quote for RFQ-1 (price: 72000)', ipAddress: '192.168.1.25', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ]
  };
}

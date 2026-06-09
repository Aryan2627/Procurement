import { PrismaClient } from '@prisma/client';
import * as mockDb from './mockDb';

let globalPrisma: PrismaClient | null = null;

function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  if (!globalPrisma) {
    globalPrisma = new PrismaClient({
      log: ['error'],
    });
  }
  return globalPrisma;
}

// Check if PostgreSQL is available by doing a fast query
async function isDbConnected(): Promise<boolean> {
  const prisma = getPrismaClient();
  if (!prisma) return false;
  try {
    // Quick query to check connection
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    return false;
  }
}

// Global db helper with fallback
export const db = {
  // --- USERS ---
  async getUsers() {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.user.findMany({ include: { company: true } });
      } catch (e) {
        console.warn('Prisma getUsers failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    return data.users.map(u => ({
      ...u,
      company: data.companies.find(c => c.id === u.companyId) || null,
    }));
  },

  async findUserByEmail(email: string) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.user.findUnique({
          where: { email },
          include: { company: true },
        });
      } catch (e) {
        console.warn('Prisma findUserByEmail failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    if (!user) return null;
    return {
      ...user,
      company: data.companies.find(c => c.id === user.companyId) || null,
    };
  },

  async createUser(input: { name: string; email: string; role: 'ADMIN' | 'BUYER' | 'VENDOR'; companyName?: string }) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        let companyId: string | null = null;
        if (input.companyName) {
          const comp = await prisma.company.create({ data: { name: input.companyName } });
          companyId = comp.id;
        }
        return await prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            role: input.role,
            companyId,
          },
        });
      } catch (e) {
        console.warn('Prisma createUser failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    let companyId: string | null = null;

    if (input.companyName) {
      const newCompany: mockDb.Company = {
        id: 'c-' + Math.random().toString(36).substring(2, 9),
        name: input.companyName,
        industry: 'Services',
        employees: 10,
        createdAt: new Date().toISOString(),
      };
      data.companies.push(newCompany);
      companyId = newCompany.id;
    }

    const newUser: mockDb.User = {
      id: 'u-' + Math.random().toString(36).substring(2, 9),
      name: input.name,
      email: input.email,
      role: input.role,
      companyId,
      createdAt: new Date().toISOString(),
    };

    data.users.push(newUser);
    mockDb.writeMockDb(data);
    return newUser;
  },

  // --- VENDORS ---
  async getVendors() {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.vendor.findMany({ include: { company: true } });
      } catch (e) {
        console.warn('Prisma getVendors failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    return data.vendors.map(v => ({
      ...v,
      company: data.companies.find(c => c.id === v.companyId) || null,
    }));
  },

  async createVendor(input: Omit<mockDb.Vendor, 'id' | 'createdAt' | 'rating'>) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.vendor.create({
          data: {
            ...input,
            rating: 4.0,
          },
        });
      } catch (e) {
        console.warn('Prisma createVendor failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const newVendor: mockDb.Vendor = {
      id: 'v-' + Math.random().toString(36).substring(2, 9),
      ...input,
      rating: 4.0,
      createdAt: new Date().toISOString(),
    };
    data.vendors.push(newVendor);
    mockDb.writeMockDb(data);
    return newVendor;
  },

  async updateVendorStatus(id: string, status: 'PENDING' | 'APPROVED' | 'SUSPENDED') {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.vendor.update({
          where: { id },
          data: { status },
        });
      } catch (e) {
        console.warn('Prisma updateVendorStatus failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const index = data.vendors.findIndex(v => v.id === id);
    if (index !== -1) {
      data.vendors[index].status = status;
      mockDb.writeMockDb(data);
      return data.vendors[index];
    }
    throw new Error('Vendor not found');
  },

  async deleteVendor(id: string) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.vendor.delete({ where: { id } });
      } catch (e) {
        console.warn('Prisma deleteVendor failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    data.vendors = data.vendors.filter(v => v.id !== id);
    mockDb.writeMockDb(data);
    return { id };
  },

  // --- RFQS ---
  async getRFQs() {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.rFQ.findMany({
          include: { buyer: true, quotations: { include: { vendor: true } } },
        });
      } catch (e) {
        console.warn('Prisma getRFQs failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    return data.rfqs.map(rfq => ({
      ...rfq,
      buyer: data.users.find(u => u.id === rfq.buyerId) || null,
      quotations: data.quotations
        .filter(q => q.rfqId === rfq.id)
        .map(q => ({
          ...q,
          vendor: data.vendors.find(v => v.id === q.vendorId) || null,
        })),
    }));
  },

  async createRFQ(input: Omit<mockDb.RFQ, 'id' | 'createdAt'>) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.rFQ.create({
          data: input,
        });
      } catch (e) {
        console.warn('Prisma createRFQ failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const newRfq: mockDb.RFQ = {
      id: 'rfq-' + Math.random().toString(36).substring(2, 9),
      ...input,
      createdAt: new Date().toISOString(),
    };
    data.rfqs.push(newRfq);
    mockDb.writeMockDb(data);
    return newRfq;
  },

  async updateRFQStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'CLOSED') {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.rFQ.update({
          where: { id },
          data: { status },
        });
      } catch (e) {
        console.warn('Prisma updateRFQStatus failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const index = data.rfqs.findIndex(r => r.id === id);
    if (index !== -1) {
      data.rfqs[index].status = status;
      mockDb.writeMockDb(data);
      return data.rfqs[index];
    }
    throw new Error('RFQ not found');
  },

  async deleteRFQ(id: string) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.rFQ.delete({ where: { id } });
      } catch (e) {
        console.warn('Prisma deleteRFQ failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    data.rfqs = data.rfqs.filter(r => r.id !== id);
    data.quotations = data.quotations.filter(q => q.rfqId !== id);
    data.auctions = data.auctions.filter(a => a.rfqId !== id);
    mockDb.writeMockDb(data);
    return { id };
  },

  // --- QUOTATIONS ---
  async getQuotations() {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.quotation.findMany({
          include: { rfq: true, vendor: true },
        });
      } catch (e) {
        console.warn('Prisma getQuotations failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    return data.quotations.map(q => ({
      ...q,
      rfq: data.rfqs.find(r => r.id === q.rfqId) || null,
      vendor: data.vendors.find(v => v.id === q.vendorId) || null,
    }));
  },

  async createQuotation(input: Omit<mockDb.Quotation, 'id' | 'createdAt'>) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.quotation.create({
          data: input,
        });
      } catch (e) {
        console.warn('Prisma createQuotation failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const newQuote: mockDb.Quotation = {
      id: 'q-' + Math.random().toString(36).substring(2, 9),
      ...input,
      createdAt: new Date().toISOString(),
    };
    data.quotations.push(newQuote);
    mockDb.writeMockDb(data);
    return newQuote;
  },

  async updateQuotationStatus(id: string, status: 'SUBMITTED' | 'WON' | 'LOST') {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.quotation.update({
          where: { id },
          data: { status },
        });
      } catch (e) {
        console.warn('Prisma updateQuotationStatus failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const index = data.quotations.findIndex(q => q.id === id);
    if (index !== -1) {
      data.quotations[index].status = status;
      mockDb.writeMockDb(data);
      return data.quotations[index];
    }
    throw new Error('Quotation not found');
  },

  // --- REVERSE AUCTIONS ---
  async getAuctions() {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.auction.findMany({ include: { rfq: true } });
      } catch (e) {
        console.warn('Prisma getAuctions failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    return data.auctions.map(a => ({
      ...a,
      rfq: data.rfqs.find(r => r.id === a.rfqId) || null,
    }));
  },

  async createAuction(input: Omit<mockDb.Auction, 'id' | 'createdAt' | 'bids'>) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.auction.create({
          data: {
            ...input,
            bids: '[]',
          },
        });
      } catch (e) {
        console.warn('Prisma createAuction failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const newAuction: mockDb.Auction = {
      id: 'auc-' + Math.random().toString(36).substring(2, 9),
      ...input,
      bids: '[]',
      createdAt: new Date().toISOString(),
    };
    data.auctions.push(newAuction);
    mockDb.writeMockDb(data);
    return newAuction;
  },

  async placeBid(auctionId: string, bidderName: string, amount: number) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        const auction = await prisma.auction.findUnique({ where: { id: auctionId } });
        if (auction) {
          const currentBids = JSON.parse(auction.bids || '[]');
          currentBids.unshift({ bidderName, amount, timestamp: new Date().toISOString() });
          return await prisma.auction.update({
            where: { id: auctionId },
            data: {
              currentBid: amount,
              bids: JSON.stringify(currentBids),
            },
          });
        }
      } catch (e) {
        console.warn('Prisma placeBid failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const idx = data.auctions.findIndex(a => a.id === auctionId);
    if (idx !== -1) {
      const auction = data.auctions[idx];
      const bids = JSON.parse(auction.bids || '[]');
      bids.unshift({ bidderName, amount, timestamp: new Date().toISOString() });
      auction.currentBid = amount;
      auction.bids = JSON.stringify(bids);
      mockDb.writeMockDb(data);
      return auction;
    }
    throw new Error('Auction not found');
  },

  // --- PURCHASE ORDERS ---
  async getPurchaseOrders() {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.purchaseOrder.findMany({
          include: { quotation: true, vendor: true, buyer: true },
        });
      } catch (e) {
        console.warn('Prisma getPurchaseOrders failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    return data.purchaseOrders.map(po => ({
      ...po,
      quotation: data.quotations.find(q => q.id === po.quotationId) || null,
      vendor: data.vendors.find(v => v.id === po.vendorId) || null,
      buyer: data.users.find(u => u.id === po.buyerId) || null,
    }));
  },

  async createPurchaseOrder(input: Omit<mockDb.PurchaseOrder, 'id' | 'createdAt' | 'poNumber'>) {
    const poNo = 'PO-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.purchaseOrder.create({
          data: {
            ...input,
            poNumber: poNo,
          },
        });
      } catch (e) {
        console.warn('Prisma createPurchaseOrder failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const newPO: mockDb.PurchaseOrder = {
      id: 'po-' + Math.random().toString(36).substring(2, 9),
      poNumber: poNo,
      ...input,
      createdAt: new Date().toISOString(),
    };
    data.purchaseOrders.push(newPO);
    mockDb.writeMockDb(data);
    return newPO;
  },

  async updatePurchaseOrderStatus(id: string, status: mockDb.PurchaseOrder['status']) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.purchaseOrder.update({
          where: { id },
          data: { status },
        });
      } catch (e) {
        console.warn('Prisma updatePurchaseOrderStatus failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const idx = data.purchaseOrders.findIndex(p => p.id === id);
    if (idx !== -1) {
      data.purchaseOrders[idx].status = status;
      mockDb.writeMockDb(data);
      return data.purchaseOrders[idx];
    }
    throw new Error('Purchase Order not found');
  },

  // --- INVOICES ---
  async getInvoices() {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.invoice.findMany({
          include: { purchaseOrder: { include: { vendor: true } }, uploadedBy: true },
        });
      } catch (e) {
        console.warn('Prisma getInvoices failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    return data.invoices.map(inv => {
      const po = data.purchaseOrders.find(p => p.id === inv.purchaseOrderId) || null;
      return {
        ...inv,
        purchaseOrder: po
          ? {
              ...po,
              vendor: data.vendors.find(v => v.id === po.vendorId) || null,
            }
          : null,
        uploadedBy: data.users.find(u => u.id === inv.uploadedById) || null,
      };
    });
  },

  async createInvoice(input: Omit<mockDb.Invoice, 'id' | 'createdAt'>) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.invoice.create({
          data: input,
        });
      } catch (e) {
        console.warn('Prisma createInvoice failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const newInvoice: mockDb.Invoice = {
      id: 'inv-' + Math.random().toString(36).substring(2, 9),
      ...input,
      createdAt: new Date().toISOString(),
    };
    data.invoices.push(newInvoice);
    mockDb.writeMockDb(data);
    return newInvoice;
  },

  async updateInvoiceStatus(id: string, status: mockDb.Invoice['status']) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.invoice.update({
          where: { id },
          data: { status },
        });
      } catch (e) {
        console.warn('Prisma updateInvoiceStatus failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const idx = data.invoices.findIndex(i => i.id === id);
    if (idx !== -1) {
      data.invoices[idx].status = status;
      mockDb.writeMockDb(data);
      return data.invoices[idx];
    }
    throw new Error('Invoice not found');
  },

  // --- APPROVALS ---
  async getApprovals() {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.approval.findMany();
      } catch (e) {
        console.warn('Prisma getApprovals failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    return data.approvals;
  },

  async createApproval(input: Omit<mockDb.Approval, 'id' | 'createdAt' | 'updatedAt' | 'chainState' | 'status'>) {
    const defaultChain = JSON.stringify({
      MANAGER: { status: 'PENDING', user: 'Alex Harrison', date: null },
      FINANCE: { status: 'PENDING', user: 'Finance Team', date: null },
      PROCUREMENT_HEAD: { status: 'PENDING', user: 'Procurement Head', date: null },
      ADMIN: { status: 'PENDING', user: 'Sarah Connor', date: null },
    });

    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.approval.create({
          data: {
            ...input,
            status: 'PENDING',
            chainState: defaultChain,
          },
        });
      } catch (e) {
        console.warn('Prisma createApproval failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const newApproval: mockDb.Approval = {
      id: 'app-' + Math.random().toString(36).substring(2, 9),
      ...input,
      status: 'PENDING',
      chainState: defaultChain,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.approvals.push(newApproval);
    mockDb.writeMockDb(data);
    return newApproval;
  },

  async updateApprovalLevel(id: string, level: mockDb.Approval['currentLevel'], status: 'APPROVED' | 'REJECTED', approverName: string) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        const app = await prisma.approval.findUnique({ where: { id } });
        if (app) {
          const chain = JSON.parse(app.chainState || '{}');
          if (chain[level]) {
            chain[level].status = status;
            chain[level].user = approverName;
            chain[level].date = new Date().toISOString();
          }

          // Determine next level or overall status
          let overallStatus = app.status;
          let nextLevel = app.currentLevel;

          if (status === 'REJECTED') {
            overallStatus = 'REJECTED';
          } else {
            // Sequence: MANAGER -> FINANCE -> PROCUREMENT_HEAD -> ADMIN
            if (level === 'MANAGER') nextLevel = 'FINANCE';
            else if (level === 'FINANCE') nextLevel = 'PROCUREMENT_HEAD';
            else if (level === 'PROCUREMENT_HEAD') nextLevel = 'ADMIN';
            else if (level === 'ADMIN') {
              overallStatus = 'APPROVED';
            }
          }

          return await prisma.approval.update({
            where: { id },
            data: {
              status: overallStatus as any,
              currentLevel: nextLevel as any,
              chainState: JSON.stringify(chain),
            },
          });
        }
      } catch (e) {
        console.warn('Prisma updateApprovalLevel failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const idx = data.approvals.findIndex(a => a.id === id);
    if (idx !== -1) {
      const app = data.approvals[idx];
      const chain = JSON.parse(app.chainState || '{}');
      if (chain[level]) {
        chain[level].status = status;
        chain[level].user = approverName;
        chain[level].date = new Date().toISOString();
      }

      let overallStatus = app.status;
      let nextLevel = app.currentLevel;

      if (status === 'REJECTED') {
        overallStatus = 'REJECTED';
      } else {
        if (level === 'MANAGER') nextLevel = 'FINANCE';
        else if (level === 'FINANCE') nextLevel = 'PROCUREMENT_HEAD';
        else if (level === 'PROCUREMENT_HEAD') nextLevel = 'ADMIN';
        else if (level === 'ADMIN') {
          overallStatus = 'APPROVED';
        }
      }

      app.status = overallStatus;
      app.currentLevel = nextLevel;
      app.chainState = JSON.stringify(chain);
      app.updatedAt = new Date().toISOString();
      mockDb.writeMockDb(data);
      return app;
    }
    throw new Error('Approval not found');
  },

  // --- NOTIFICATIONS ---
  async getNotifications(userId: string) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
      } catch (e) {
        console.warn('Prisma getNotifications failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    return data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createNotification(userId: string, message: string) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.notification.create({
          data: { userId, message },
        });
      } catch (e) {
        console.warn('Prisma createNotification failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const newNotif: mockDb.Notification = {
      id: 'n-' + Math.random().toString(36).substring(2, 9),
      userId,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    data.notifications.unshift(newNotif);
    mockDb.writeMockDb(data);
    return newNotif;
  },

  async markNotificationRead(id: string) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.notification.update({
          where: { id },
          data: { read: true },
        });
      } catch (e) {
        console.warn('Prisma markNotificationRead failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const idx = data.notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      data.notifications[idx].read = true;
      mockDb.writeMockDb(data);
      return data.notifications[idx];
    }
    throw new Error('Notification not found');
  },

  // --- AUDIT LOGS ---
  async getAuditLogs() {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.auditLog.findMany({
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        });
      } catch (e) {
        console.warn('Prisma getAuditLogs failed, using mock DB:', e);
      }
    }
    const data = mockDb.readMockDb();
    return data.auditLogs
      .map(log => ({
        ...log,
        user: data.users.find(u => u.id === log.userId) || null,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createAuditLog(userId: string, action: string, details?: string, ipAddress?: string) {
    const prisma = getPrismaClient();
    if (prisma && (await isDbConnected())) {
      try {
        return await prisma.auditLog.create({
          data: { userId, action, details, ipAddress },
        });
      } catch (e) {
        console.warn('Prisma createAuditLog failed, using mock DB:', e);
      }
    }

    const data = mockDb.readMockDb();
    const newLog: mockDb.AuditLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      userId,
      action,
      details: details || null,
      ipAddress: ipAddress || null,
      createdAt: new Date().toISOString(),
    };
    data.auditLogs.unshift(newLog);
    mockDb.writeMockDb(data);
    return newLog;
  },

  // --- BOOK DEMO SUBMISSION ---
  async submitBookDemo(input: { name: string; email: string; company: string; phone: string; employees: number; industry: string }) {
    // Audit logs for Admin view or mock entries
    const logDetails = `Demo Request from ${input.name} (${input.email}) for company ${input.company} (${input.employees} emp, industry: ${input.industry})`;
    await this.createAuditLog('u-admin', 'DEMO_REQUESTED', logDetails);
    return { success: true, timestamp: new Date().toISOString() };
  },
};

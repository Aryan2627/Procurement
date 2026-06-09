"use client";

import React, { useState, useEffect } from 'react';
import { 
  Coins, Search, UploadCloud, Check, X, Eye, Clock, 
  DollarSign, FileText, RefreshCw, AlertCircle, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Upload simulation state
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // Seed data matching db service
      const sampleInvoices = [
        {
          id: 'inv-1',
          invoiceNumber: 'INV-2026-9081',
          poNumber: 'PO-2026-0001',
          vendorName: 'TechCorp Solutions Inc.',
          amount: 75600, // 72000 + 3600
          status: 'PAID',
          documents: 'invoice_techcorp_laptops.pdf',
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
        },
        {
          id: 'inv-2',
          invoiceNumber: 'INV-2026-9082',
          poNumber: 'PO-2026-0002',
          vendorName: 'Global Office Suppliers Ltd.',
          amount: 3360,
          status: 'APPROVED',
          documents: 'stationery_receipt.pdf',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setInvoices(sampleInvoices);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newInv = {
      id: 'inv-' + Math.random().toString(36).substring(2, 9),
      invoiceNumber: 'INV-2026-000' + Math.floor(10 + Math.random() * 90),
      poNumber: 'PO-2026-0001', // Link to active PO
      vendorName: 'TechCorp Solutions Inc.',
      amount: 45000,
      status: 'PENDING',
      documents: file.name,
      createdAt: new Date().toISOString()
    };

    setInvoices(prev => [newInv, ...prev]);
    setUploading(false);
    alert('Invoice uploaded successfully! Sent to approval chain.');
  };

  const handleApproveInvoice = (id: string, status: 'APPROVED' | 'PAID') => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id 
        ? { ...inv, status } 
        : inv
    ));
  };

  const getStatusColor = (status: string) => {
    if (status === 'PAID') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/30';
    if (status === 'APPROVED') return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/30';
    if (status === 'REJECTED') return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450 border-rose-200/30';
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/30'; // PENDING
  };

  // Filter & Search
  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Invoices</h1>
          <p className="text-xs text-slate-500 mt-1">Submit vendor invoices, audit bill totals, approve payments, and track payout logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload card */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Submit Invoice</h2>
          
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center space-y-4">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6.5 hover:border-brand-500/30 transition-all flex flex-col items-center justify-center relative">
              <UploadCloud className="w-10 h-10 text-slate-400 mb-2.5" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-250 block">Drag & Drop Sourcing Receipt</span>
              <span className="text-[10px] text-slate-450 block mt-1">PDF or image file sizes up to 10MB</span>
              
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleSimulatedUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
            </div>

            {uploading && (
              <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-brand-650 dark:text-brand-400 animate-pulse">
                <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                <span>Uploading file...</span>
              </div>
            )}
          </div>
        </div>

        {/* Ledger list */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sourcing Invoices Ledger</h2>

          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-7 h-7 text-brand-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Loading invoice ledger...</p>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <Coins className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-850 dark:text-slate-350">No Invoices Submitted</p>
                <p className="text-xs text-slate-450">Upload a vendor invoice receipt file to log standard payouts.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-slate-850">
                      <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice / PO</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Approvals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-5 py-4">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono block">{inv.invoiceNumber}</span>
                            <span className="text-[9px] text-slate-400 font-mono block mt-0.5">PO: {inv.poNumber}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-300">{inv.vendorName}</td>
                        <td className="px-5 py-4 font-bold text-slate-805 dark:text-slate-100">${inv.amount.toLocaleString()}</td>
                        <td className="px-5 py-4 text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(inv.status)}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {inv.status === 'PENDING' && (
                              <button
                                onClick={() => handleApproveInvoice(inv.id, 'APPROVED')}
                                className="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded font-bold cursor-pointer text-[10px]"
                              >
                                Approve
                              </button>
                            )}
                            {inv.status === 'APPROVED' && (
                              <button
                                onClick={() => handleApproveInvoice(inv.id, 'PAID')}
                                className="px-2.5 py-1 bg-emerald-650 hover:bg-emerald-705 text-white rounded font-bold cursor-pointer text-[10px]"
                              >
                                Pay Out
                              </button>
                            )}
                            {inv.status === 'PAID' && (
                              <span className="text-xs text-emerald-600 font-semibold flex items-center">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" /> Disbursed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

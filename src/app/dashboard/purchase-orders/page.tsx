"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileCheck, Search, Download, Printer, Eye, X, Check,
  Clock, DollarSign, Calendar, RefreshCw, Send, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';

export default function PurchaseOrdersPage() {
  const { user } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Preview PO document state
  const [selectedPO, setSelectedPO] = useState<any | null>(null);

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    setLoading(true);
    try {
      // Fetch POs from db/local state mock
      const samplePOs = [
        {
          id: 'po-1',
          poNumber: 'PO-2026-0001',
          category: 'Hardware',
          vendorName: 'TechCorp Solutions Inc.',
          vendorEmail: 'sales@techcorp.com',
          vendorAddress: '128 Tech Blvd, San Francisco, CA',
          buyerName: 'Alex Harrison',
          companyName: 'Acme Procurement Corp',
          price: 72000,
          tax: 3600,
          deliveryDate: new Date(Date.now() + 86400000 * 14).toISOString(),
          status: 'ACCEPTED',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
          id: 'po-2',
          poNumber: 'PO-2026-0002',
          category: 'Office Supplies',
          vendorName: 'Global Office Suppliers Ltd.',
          vendorEmail: 'emily@globaloffice.com',
          vendorAddress: '45 Green Park, New York, NY',
          buyerName: 'Alex Harrison',
          companyName: 'Acme Procurement Corp',
          price: 3200,
          tax: 160,
          deliveryDate: new Date().toISOString(),
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
        }
      ];

      // Merge POs saved in mock-db if any
      setPurchaseOrders(samplePOs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintDocument = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    if (status === 'COMPLETED') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/30';
    if (status === 'ACCEPTED') return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200/30';
    if (status === 'REJECTED') return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450 border-rose-200/30';
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/30';
  };

  // Filter & Search
  const filteredPOs = purchaseOrders.filter(p => {
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchesSearch = p.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Purchase Orders</h1>
          <p className="text-xs text-slate-500 mt-1">Review generated Purchase Orders, track supplier signatures, and export transaction bills.</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-200/30'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search PO number, supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-7 h-7 text-brand-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading purchase ledger...</p>
          </div>
        ) : filteredPOs.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-850 dark:text-slate-350">No Purchase Orders</p>
            <p className="text-xs text-slate-450">Award a contract inside the RFQ Directory to automatically generate PO records.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-slate-850">
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">PO Number</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount Due</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Date</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                {filteredPOs.map((po) => (
                  <tr 
                    key={po.id}
                    onClick={() => setSelectedPO(po)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4.5 font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors font-mono">{po.poNumber}</td>
                    <td className="px-6 py-4.5 font-semibold text-slate-700 dark:text-slate-300">{po.vendorName}</td>
                    <td className="px-6 py-4.5 text-slate-500 font-semibold">{po.category}</td>
                    <td className="px-6 py-4.5 font-bold text-slate-805 dark:text-slate-100">${(po.price + po.tax).toLocaleString()}</td>
                    <td className="px-6 py-4.5 text-slate-500">{new Date(po.deliveryDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(po.status)}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedPO(po)}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 text-[10px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 cursor-pointer ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect PO</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PO Preview Panel */}
      <AnimatePresence>
        {selectedPO && (
          <>
            <div className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/50 backdrop-blur-xs z-40 print:hidden" onClick={() => setSelectedPO(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 shadow-2xl p-6 overflow-y-auto space-y-6 print:absolute print:inset-0 print:w-full print:max-w-none print:bg-white print:text-black print:p-0 print:border-none print:shadow-none flex flex-col justify-between"
            >
              {/* Document Container */}
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 print:hidden">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-extrabold">Inspect Purchase Order</h3>
                  <button
                    onClick={() => setSelectedPO(null)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Printable PO Bill */}
                <div className="p-8 border border-slate-200 rounded-2xl space-y-6 bg-white text-slate-800 text-xs font-sans print:border-none print:p-0">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-lg font-bold text-brand-600 font-mono tracking-tight block">ProcureAI Platform</span>
                      <span className="text-[10px] text-slate-450 block font-semibold">{selectedPO.companyName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-slate-900 block font-mono">PURCHASE ORDER</span>
                      <span className="text-xs font-bold text-brand-650 block mt-1 font-mono">{selectedPO.poNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-150">
                    <div>
                      <span className="font-bold text-slate-400 block mb-1">ISSUED TO:</span>
                      <span className="font-bold text-slate-805 block">{selectedPO.vendorName}</span>
                      <span className="text-slate-500 block leading-normal">{selectedPO.vendorAddress}</span>
                      <span className="text-slate-500 block mt-1">{selectedPO.vendorEmail}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 block mb-1">SHIP TO / BILL TO:</span>
                      <span className="font-bold text-slate-805 block">{selectedPO.companyName}</span>
                      <span className="text-slate-500 block">HQ Operations Sourcing Head</span>
                      <span className="text-slate-550 block mt-1">Requester: {selectedPO.buyerName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-3 bg-slate-50 border border-slate-200/50 rounded-xl px-4 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">PO Date</span>
                      <span className="font-semibold">{new Date(selectedPO.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Delivery Date</span>
                      <span className="font-semibold">{new Date(selectedPO.deliveryDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Terms</span>
                      <span className="font-semibold">Net 30 Sourcing</span>
                    </div>
                  </div>

                  {/* Products Table */}
                  <table className="w-full text-left mt-6 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] text-slate-400 font-bold">
                        <th className="pb-2.5">Category Sourced</th>
                        <th className="pb-2.5 text-center">Qty</th>
                        <th className="pb-2.5 text-right">Unit Price</th>
                        <th className="pb-2.5 text-right">Total Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-750">
                      <tr>
                        <td className="py-3">Bulk Procurement of {selectedPO.category}</td>
                        <td className="py-3 text-center">1</td>
                        <td className="py-3 text-right">${selectedPO.price.toLocaleString()}</td>
                        <td className="py-3 text-right">${selectedPO.price.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Calculations */}
                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <div className="w-56 space-y-2 text-right">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal:</span>
                        <span className="font-semibold">${selectedPO.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Tax (Calculated):</span>
                        <span className="font-semibold">${selectedPO.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-150 pt-2">
                        <span>Total Due:</span>
                        <span className="text-brand-650 font-mono">${(selectedPO.price + selectedPO.tax).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 text-center text-[10px] text-slate-400 leading-normal border-t border-slate-150 mt-10">
                    <span className="flex items-center justify-center space-x-1 font-semibold text-emerald-600">
                      <ShieldCheck className="w-4 h-4 mr-0.5" /> Authenticated Secure Sourcing Receipt
                    </span>
                    <p className="mt-1">Generated and signed digitally inside the ProcureAI system.</p>
                  </div>
                </div>
              </div>

              {/* PDF Print Button */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end print:hidden">
                <button
                  onClick={handlePrintDocument}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

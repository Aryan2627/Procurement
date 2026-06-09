"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Download, Trash2, Edit3, X, Eye, 
  Check, Calendar, DollarSign, FileText, ChevronRight, 
  Briefcase, Loader2, Award, ClipboardCheck, ArrowUpRight, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';

export default function RFQsPage() {
  const { user } = useAuth();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create RFQ Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Hardware',
    quantity: '',
    budget: '',
    deadline: '',
    selectedVendors: [] as string[],
    documents: ''
  });

  // RFQ Details slide-over
  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);
  const [awardingId, setAwardingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const rfqRes = await fetch('/api/rfq');
      const rfqData = await rfqRes.json();
      if (rfqData.success) {
        setRfqs(rfqData.data);
      }

      // Fetch vendors to select in form
      const vendorsRes = await fetch('/api/quote'); // Let's mock vendors
      // Using values from our db helper mock schema
      setVendors([
        { id: 'v1', name: 'TechCorp Solutions Inc.', email: 'sales@techcorp.com' },
        { id: 'v2', name: 'Global Office Suppliers Ltd.', email: 'emily@globaloffice.com' },
        { id: 'v3', name: 'Alpha Security Systems', email: 'vikram@alphasec.in' }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    if (!formData.title || !formData.description || !formData.quantity || !formData.budget || !formData.deadline) {
      setFormError('Please enter all required procurement parameters.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          buyerId: user?.id || 'u-buyer'
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish RFQ');
      }

      setDrawerOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'Hardware',
        quantity: '',
        budget: '',
        deadline: '',
        selectedVendors: [],
        documents: ''
      });
      fetchData(); // reload
    } catch (e: any) {
      setFormError(e.message || 'Error occurred while creating RFQ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRfq = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this RFQ?')) return;
    
    try {
      const res = await fetch(`/api/rfq?id=${id}&buyerId=${user?.id || 'u-buyer'}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
        if (selectedRfq && selectedRfq.id === id) {
          setSelectedRfq(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Award Quotation (Mark Quote as WON, triggers backend PO + approvals creation)
  const handleAwardContract = async (quoteId: string) => {
    if (!confirm('Are you sure you want to award the contract to this vendor? This will automatically close the RFQ, generate a Purchase Order, and launch the approval workflow.')) return;
    
    setAwardingId(quoteId);
    try {
      const res = await fetch('/api/quote', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: quoteId,
          status: 'WON',
          buyerId: user?.id || 'u-buyer'
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Contract awarded successfully! Purchase Order generated.');
        fetchData(); // reload RFQ list
        setSelectedRfq(null); // close detail
      } else {
        alert(data.error || 'Failed to award contract.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error awarding contract.');
    } finally {
      setAwardingId(null);
    }
  };

  // Client-side CSV Download
  const handleExportCSV = () => {
    const csvHeaders = ['RFQ ID', 'Title', 'Category', 'Quantity', 'Budget', 'Deadline', 'Status'];
    const csvRows = filteredRfqs.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.quantity,
      r.budget,
      r.deadline.split('T')[0],
      r.status
    ]);
    
    const content = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RFQs_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search Logic
  const filteredRfqs = rfqs.filter(r => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    if (status === 'PUBLISHED') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/30';
    if (status === 'CLOSED') return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200/10';
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/30';
  };

  return (
    <div className="space-y-6 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">RFQ Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Issue and review Requests for Quotations, select suppliers, and issue PO contracts.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Publish RFQ</span>
          </button>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PUBLISHED', 'DRAFT', 'CLOSED'].map((st) => (
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
            placeholder="Search RFQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Main RFQ list table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-7 h-7 text-brand-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading RFQs ledger...</p>
          </div>
        ) : filteredRfqs.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-350">No RFQs Found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or create a new request.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-slate-850">
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Title / ID</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredRfqs.map((rfq) => (
                  <tr 
                    key={rfq.id} 
                    onClick={() => setSelectedRfq(rfq)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4.5">
                      <div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors block">
                          {rfq.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{rfq.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-xs text-slate-550 dark:text-slate-350 font-semibold">{rfq.category}</td>
                    <td className="px-6 py-4.5 text-xs text-slate-550 dark:text-slate-350 font-semibold">{rfq.quantity} units</td>
                    <td className="px-6 py-4.5 text-xs text-slate-700 dark:text-slate-200 font-bold">
                      ${rfq.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4.5 text-xs text-slate-500">
                      {new Date(rfq.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(rfq.status)}`}>
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRfq(rfq);
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-450 hover:text-slate-700 cursor-pointer"
                          title="View quotes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteRfq(rfq.id, e)}
                          className="p-1.5 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 cursor-pointer"
                          title="Delete RFQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-out details drawer: Shows RFQ info & vendor quotes */}
      <AnimatePresence>
        {selectedRfq && (
          <>
            <div className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/50 backdrop-blur-xs z-40" onClick={() => setSelectedRfq(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 shadow-2xl p-6 overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">RFQ Sourcing Details</h3>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{selectedRfq.id}</span>
                </div>
                <button
                  onClick={() => setSelectedRfq(null)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* RFQ Meta Info */}
              <div className="space-y-3.5 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-slate-450 block mb-0.5">Title</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedRfq.title}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-450 block mb-0.5">Description</span>
                  <p className="text-slate-600 dark:text-slate-405 leading-relaxed">{selectedRfq.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="font-bold text-slate-450 block mb-0.5">Quantity</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedRfq.quantity} units</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-450 block mb-0.5">Budget</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">${selectedRfq.budget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-450 block mb-0.5">Deadline</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(selectedRfq.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Vendor quotes received */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Supplier Quotations Received</h4>
                  <span className="text-[10px] bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 font-bold px-2 py-0.5 rounded">
                    {selectedRfq.quotations?.length || 0} Quotes
                  </span>
                </div>

                {(!selectedRfq.quotations || selectedRfq.quotations.length === 0) ? (
                  <div className="text-center py-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400 space-y-1">
                    <Eye className="w-5 h-5 mx-auto text-slate-300" />
                    <p>No supplier quotations submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedRfq.quotations.map((q: any) => (
                      <div 
                        key={q.id} 
                        className={`p-4 border rounded-2xl flex flex-col justify-between transition-all ${
                          q.status === 'WON' 
                            ? 'bg-emerald-50/20 border-emerald-500/30' 
                            : 'bg-white dark:bg-slate-950 border-slate-200/50 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{q.vendor?.name || 'Supplier'}</span>
                            <span className="block text-[9px] text-slate-400">Rep: {q.vendor?.contactPerson}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">${(q.price + q.tax).toLocaleString()}</span>
                            <span className="block text-[9px] text-slate-400">Base: ${q.price.toLocaleString()} + Tax: ${q.tax.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] pt-3 border-t border-slate-100 dark:border-slate-900 mt-2">
                          <span className="text-slate-500">Deliv: {new Date(q.deliveryDate).toLocaleDateString()}</span>
                          {selectedRfq.status === 'PUBLISHED' ? (
                            <button
                              onClick={() => handleAwardContract(q.id)}
                              disabled={awardingId === q.id}
                              className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                            >
                              {awardingId === q.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Award className="w-3.5 h-3.5 mr-0.5" />
                                  <span>Award Contract</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              q.status === 'WON' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {q.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sliding Drawer Form to Create/Publish RFQ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <div className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/50 backdrop-blur-xs z-45" onClick={() => setDrawerOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 shadow-2xl p-6 overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Publish Sourcing RFQ</h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateRfq} className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">RFQ Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Q3 Developer Laptops Upgrade"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Procurement Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Specify specifications, brands, ram sizes, delivery rules..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                {/* Category & Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                    >
                      <option value="Hardware">Hardware</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Services">Services</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">Quantity Units</label>
                    <input
                      type="number"
                      required
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="50"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {/* Budget & Deadline */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">Estimated Budget ($)</label>
                    <input
                      type="number"
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="75000"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">Bidding Deadline</label>
                    <input
                      type="date"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Vendor selection checklist */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Invite Approved Vendors</label>
                  <div className="max-h-28 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2 bg-slate-50 dark:bg-slate-950/20">
                    {vendors.map((v) => (
                      <label key={v.id} className="flex items-center space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.selectedVendors.includes(v.id)}
                          onChange={(e) => {
                            const active = e.target.checked;
                            const current = [...formData.selectedVendors];
                            if (active) {
                              current.push(v.id);
                            } else {
                              const idx = current.indexOf(v.id);
                              if (idx !== -1) current.splice(idx, 1);
                            }
                            setFormData({ ...formData, selectedVendors: current });
                          }}
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{v.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-500/50 text-white rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                      <span>Publishing RFQ...</span>
                    </>
                  ) : (
                    <>
                      <span>Publish & Notify Vendors</span>
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

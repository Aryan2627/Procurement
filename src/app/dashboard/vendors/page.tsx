"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Star, Trash2, Edit3, X, Eye, Check, AlertCircle,
  FileCheck, ShieldAlert, Ban, RefreshCw, Mail, Phone, MapPin, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';

export default function VendorsPage() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Intake Form state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    panNumber: '',
    address: '',
    documents: ''
  });

  // Selected vendor details modal
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rfq'); // Trigger general load or read mock
      // Since our mock database is loaded in db.ts, we can fetch all vendors.
      // Let's call our db service client dynamically using standard client-side API.
      // In this setup, we'll write a clean fetch wrapper or mock state locally for rapid execution.
      const sampleVendors = [
        { id: 'v1', name: 'TechCorp Solutions Inc.', contactPerson: 'John Smith', email: 'sales@techcorp.com', phone: '+1 555-0199', gstNumber: '29AAAAA1111A1Z1', panNumber: 'AAAAA1111A', address: '128 Tech Blvd, San Francisco, CA', rating: 4.8, status: 'APPROVED', documents: 'certification_iso.pdf' },
        { id: 'v2', name: 'Global Office Suppliers Ltd.', contactPerson: 'Emily Davis', email: 'emily@globaloffice.com', phone: '+1 555-0188', gstNumber: '29BBBBB2222B2Z2', panNumber: 'BBBBB2222B', address: '45 Green Park, New York, NY', rating: 4.5, status: 'APPROVED', documents: 'compliance_report.pdf' },
        { id: 'v3', name: 'Alpha Security Systems', contactPerson: 'Vikram Singh', email: 'vikram@alphasec.in', phone: '+91 98765 43210', gstNumber: '07CCCCC3333C3Z3', panNumber: 'CCCCC3333C', address: '102 Connaught Place, New Delhi', rating: 4.2, status: 'APPROVED', documents: 'pan_card.pdf' },
        { id: 'v4', name: 'Apex Construction Group', contactPerson: 'Mark Miller', email: 'mark@apexconstruct.com', phone: '+1 555-0122', gstNumber: '07DDDDD4444D4Z4', panNumber: 'DDDDD4444D', address: '888 Industrial Ave, Houston, TX', rating: 3.9, status: 'PENDING', documents: null }
      ];
      setVendors(sampleVendors);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');

    if (!formData.name || !formData.contactPerson || !formData.email || !formData.phone) {
      setFormError('Please enter all required vendor parameters.');
      setSubmitting(false);
      return;
    }

    try {
      // Create new vendor local state addition
      const newV = {
        id: 'v-' + Math.random().toString(36).substring(2, 9),
        ...formData,
        rating: 4.0,
        status: 'PENDING'
      };
      setVendors(prev => [...prev, newV]);
      setDrawerOpen(false);
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        gstNumber: '',
        panNumber: '',
        address: '',
        documents: ''
      });
    } catch (err: any) {
      setFormError(err.message || 'Error onboarding vendor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: 'APPROVED' | 'SUSPENDED') => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status: nextStatus } : v));
    if (selectedVendor && selectedVendor.id === id) {
      setSelectedVendor((prev: any) => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to remove this vendor from the registry?')) return;
    setVendors(prev => prev.filter(v => v.id !== id));
    setSelectedVendor(null);
  };

  // Filter & Search
  const filteredVendors = vendors.filter(v => {
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (v.panNumber && v.panNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    if (status === 'APPROVED') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/30';
    if (status === 'SUSPENDED') return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/30';
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/30';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-3.5 h-3.5 ${
            i <= floor 
              ? 'text-amber-500 fill-amber-500' 
              : i - 0.5 <= rating 
                ? 'text-amber-550 fill-amber-500 opacity-50' 
                : 'text-slate-300 dark:text-slate-700'
          }`} 
        />
      );
    }
    return <div className="flex space-x-0.5 items-center">{stars} <span className="text-[10px] text-slate-500 font-bold ml-1">{rating.toFixed(1)}</span></div>;
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Supplier Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Register suppliers, check ratings, review credentials, and manage approval status.</p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'APPROVED', 'PENDING', 'SUSPENDED'].map((st) => (
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
            placeholder="Search suppliers name, PAN, rep..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Supplier Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-7 h-7 text-brand-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading supplier registry...</p>
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
          <Ban className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-350">No Suppliers Registered</p>
          <p className="text-xs text-slate-450">Onboard a supplier to see their profile details.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVendor(v)}
              className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800 hover:border-brand-500/30 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{v.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{v.id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColor(v.status)}`}>
                    {v.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{v.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{v.phone}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                    <span className="truncate max-w-[220px]">{v.address}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center">
                {renderStars(v.rating)}
                <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                  View Dossier &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vendor Dossier Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <>
            <div className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/50 backdrop-blur-xs z-40" onClick={() => setSelectedVendor(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 shadow-2xl p-6 overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-extrabold">Supplier Dossier</h3>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5 text-xs">
                <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-850">
                  <div className="w-16 h-16 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                    {selectedVendor.name[0]}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedVendor.name}</h4>
                  <div className="flex justify-center mt-1">{renderStars(selectedVendor.rating)}</div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Operational Details</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-slate-450 block">Contact Person</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedVendor.contactPerson}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-450 block">Phone</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedVendor.phone}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-450 block">Email Address</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedVendor.email}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-450 block">Registered Address</span>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{selectedVendor.address}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">TAX & Compliance Verification</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-slate-450 block">PAN Number</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold uppercase">{selectedVendor.panNumber || 'UNAVAILABLE'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-450 block">GST Number</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold uppercase">{selectedVendor.gstNumber || 'UNAVAILABLE'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-450 block">Verification Files</span>
                    {selectedVendor.documents ? (
                      <span className="inline-flex items-center space-x-1 text-brand-600 hover:underline cursor-pointer font-semibold">
                        <FileCheck className="w-4 h-4 text-emerald-600 mr-0.5" /> {selectedVendor.documents}
                      </span>
                    ) : (
                      <span className="text-rose-500 font-semibold flex items-center">
                        <ShieldAlert className="w-4 h-4 mr-1 flex-shrink-0" /> Pending file upload
                      </span>
                    )}
                  </div>
                </div>

                {/* Status operations */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex flex-col space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrative Control</span>
                  <div className="flex gap-2">
                    {selectedVendor.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedVendor.id, 'APPROVED')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Vendor</span>
                      </button>
                    )}
                    {selectedVendor.status !== 'SUSPENDED' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedVendor.id, 'SUSPENDED')}
                        className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455 rounded-lg font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Suspend Vendor</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteVendor(selectedVendor.id)}
                      className="p-2 border border-slate-250 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 cursor-pointer"
                      title="Remove Vendor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Onboard Supplier Drawer Form */}
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
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Register Supplier Dossier</h3>
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

              <form onSubmit={handleCreateVendor} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Vendor / Supplier Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="TechCorp Solutions Inc."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Contact Person Rep</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="John Smith"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">Work Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sales@techcorp.com"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 555-0199"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">PAN Number (TAX ID)</label>
                    <input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      placeholder="ABCDE1234F"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">GST Registration ID</label>
                    <input
                      type="text"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                      placeholder="29AAAAA1111A1Z1"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Operational Corporate Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="128 Tech Blvd, San Francisco, CA"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-500/50 text-white rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <span>Onboard & Register Supplier</span>
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

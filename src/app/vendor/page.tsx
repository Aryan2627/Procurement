"use client";

import React, { useState, useEffect } from 'react';
import { 
  Store, LayoutDashboard, FileText, FileSpreadsheet, ArrowUpRight, DollarSign,
  TrendingUp, Award, Calendar, Bell, Plus, Check, Clock, X, UploadCloud,
  User, ShieldCheck, RefreshCw, Send, Loader2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import { useTheme } from '@/components/ThemeProvider';

export default function VendorPortalPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'opportunities' | 'quotes' | 'profile'>('dashboard');

  // Datasets
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quote Submittal Drawer
  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const [quoteData, setQuoteData] = useState({
    price: '',
    tax: '',
    deliveryDate: '',
    documents: ''
  });

  // Profile data
  const [vendorProfile, setVendorProfile] = useState({
    name: 'Nexis Tech Systems',
    contactPerson: 'Sanjay Kumar',
    email: 'vendor@procure.ai',
    phone: '+1 555-0188',
    gstNumber: '29BBBBB2222B2Z2',
    panNumber: 'BBBBB2222B',
    address: '45 Green Park, New York, NY'
  });

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    setLoading(true);
    try {
      // Load open RFQs and quotations submitted
      const rfqRes = await fetch('/api/rfq');
      const rfqData = await rfqRes.json();
      if (rfqData.success) {
        setRfqs(rfqData.data.filter((r: any) => r.status === 'PUBLISHED'));
      }

      const quoteRes = await fetch('/api/quote');
      const quoteData = await quoteRes.json();
      if (quoteData.success) {
        setQuotes(quoteData.data.filter((q: any) => q.vendorId === 'v1' || q.vendor?.email === user?.email));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuote(true);
    setQuoteError('');

    if (!quoteData.price || !quoteData.deliveryDate) {
      setQuoteError('Please fill in price and delivery date.');
      setSubmittingQuote(false);
      return;
    }

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rfqId: selectedRfq.id,
          vendorId: 'v1', // standard mock vendor ID associated with vendor@procure.ai
          price: parseFloat(quoteData.price),
          tax: parseFloat(quoteData.tax || '0'),
          deliveryDate: new Date(quoteData.deliveryDate).toISOString(),
          documents: quoteData.documents || 'quote_specs_upload.pdf'
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Quotation submitted successfully! Buyer notified.');
        setSelectedRfq(null);
        setQuoteData({ price: '', tax: '', deliveryDate: '', documents: '' });
        fetchVendorData(); // reload
      } else {
        throw new Error(data.error || 'Failed to submit quote');
      }
    } catch (err: any) {
      setQuoteError(err.message || 'Error occurred.');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const getQuoteStatusColor = (status: string) => {
    if (status === 'WON') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-250/20';
    if (status === 'LOST') return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-250/20';
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-250/20';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Navigation Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-6 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center">
            <Store className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold dark:text-white">
            Procure<span className="text-brand-600 dark:text-brand-400 font-extrabold">AI</span> <span className="text-xs font-normal text-slate-400">Vendor Portal</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Meta */}
          <div className="flex items-center space-x-2 border-r border-slate-200 dark:border-slate-800 pr-4 text-xs text-right">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">{vendorProfile.name}</span>
              <span className="text-slate-400 block text-[10px]">{vendorProfile.contactPerson} (Rep)</span>
            </div>
            <div className="w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
              S
            </div>
          </div>

          <button
            onClick={logout}
            className="text-xs font-semibold text-slate-550 hover:text-rose-600 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-6 py-8 gap-8">
        
        {/* Left side tabs navigation */}
        <aside className="w-64 space-y-2 hidden md:block">
          <h2 className="text-xs font-bold text-slate-450 uppercase tracking-widest block mb-4">Portal Tabs</h2>
          {[
            { id: 'dashboard', name: 'Overview', icon: LayoutDashboard },
            { id: 'opportunities', name: 'Sourcing Opportunities', icon: FileSpreadsheet },
            { id: 'quotes', name: 'Sent Quotations', icon: FileText },
            { id: 'profile', name: 'Vendor Dossier', icon: User }
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  active 
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400 border border-brand-200/20' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2.5 ${active ? 'text-brand-650' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Box */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-brand-650 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading portal dashboard...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'dashboard' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Vendor Portal Overview</h2>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                    <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Open RFQs</span>
                        <h3 className="text-lg font-extrabold dark:text-white">{rfqs.length}</h3>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-650">
                        <FileSpreadsheet className="w-4.5 h-4.5" />
                      </div>
                    </div>

                    <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Bids Sent</span>
                        <h3 className="text-lg font-extrabold dark:text-white">{quotes.length}</h3>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-650">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                    </div>

                    <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Won Orders</span>
                        <h3 className="text-lg font-extrabold dark:text-white">
                          {quotes.filter(q => q.status === 'WON').length}
                        </h3>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-650">
                        <Award className="w-4.5 h-4.5" />
                      </div>
                    </div>

                    <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Revenue Sourced</span>
                        <h3 className="text-lg font-extrabold dark:text-white">
                          ${(quotes.filter(q => q.status === 'WON').reduce((sum, q) => sum + q.price + q.tax, 0) || 75600).toLocaleString()}
                        </h3>
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-650">
                        <DollarSign className="w-4.5 h-4.5" />
                      </div>
                    </div>
                  </div>

                  {/* Sourcing guidelines info card */}
                  <div className="p-5 border border-slate-200/50 rounded-2xl bg-white dark:bg-slate-900 flex items-start space-x-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <Info className="w-5 h-5 text-brand-650 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block mb-0.5">Sourcing Guidelines</span>
                      Please ensure your Tax IDs (PAN/GST) are correct in the **Vendor Dossier** tab. Sourcing buyers check compliance records before awarding purchase orders.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: OPPORTUNITIES */}
              {activeTab === 'opportunities' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Open Sourcing Opportunities</h2>
                  
                  {rfqs.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-slate-250 dark:border-slate-850 rounded-2xl text-xs text-slate-450">
                      No active RFQ opportunities published.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {rfqs.map((rfq) => (
                        <div key={rfq.id} className="glass-card p-5 rounded-2xl border border-slate-205 dark:border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <span className="text-sm font-bold text-slate-850 dark:text-slate-200 block">{rfq.title}</span>
                            <p className="text-xs text-slate-500 max-w-lg leading-relaxed line-clamp-1">{rfq.description}</p>
                            <div className="flex space-x-4 text-[10px] text-slate-450 font-semibold pt-1">
                              <span>Units: {rfq.quantity}</span>
                              <span>Target Budget: ${rfq.budget.toLocaleString()}</span>
                              <span>Category: {rfq.category}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedRfq(rfq)}
                            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer flex-shrink-0"
                          >
                            <span>Submit Quotation</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: SENT QUOTATIONS */}
              {activeTab === 'quotes' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Sent Quotations Ledger</h2>

                  <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    {quotes.length === 0 ? (
                      <div className="text-center py-16 text-slate-400 text-xs">No quotations submitted.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-slate-850">
                              <th className="px-5 py-3 text-xs font-bold text-slate-450 uppercase tracking-wider">RFQ Target</th>
                              <th className="px-5 py-3 text-xs font-bold text-slate-450 uppercase tracking-wider">Bid Price</th>
                              <th className="px-5 py-3 text-xs font-bold text-slate-450 uppercase tracking-wider">Tax</th>
                              <th className="px-5 py-3 text-xs font-bold text-slate-450 uppercase tracking-wider">Delivery date</th>
                              <th className="px-5 py-3 text-xs font-bold text-slate-450 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {quotes.map((q) => (
                              <tr key={q.id}>
                                <td className="px-5 py-4 truncate max-w-[200px]">{q.rfq?.title || 'Upgrade RFQ'}</td>
                                <td className="px-5 py-4 font-bold">${q.price.toLocaleString()}</td>
                                <td className="px-5 py-4">${q.tax.toLocaleString()}</td>
                                <td className="px-5 py-4">{new Date(q.deliveryDate).toLocaleDateString()}</td>
                                <td className="px-5 py-4">
                                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${getQuoteStatusColor(q.status)}`}>
                                    {q.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: PROFILE DOSSIER */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Vendor Dossier details</h2>
                  
                  <div className="glass-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-400 uppercase">Entity Name</label>
                        <input
                          type="text"
                          value={vendorProfile.name}
                          onChange={(e) => setVendorProfile({ ...vendorProfile, name: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl py-2 px-3 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-400 uppercase">Contact Rep</label>
                        <input
                          type="text"
                          value={vendorProfile.contactPerson}
                          onChange={(e) => setVendorProfile({ ...vendorProfile, contactPerson: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl py-2 px-3 text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-400 uppercase">PAN ID (TAX ID)</label>
                        <input
                          type="text"
                          value={vendorProfile.panNumber}
                          onChange={(e) => setVendorProfile({ ...vendorProfile, panNumber: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl py-2 px-3 text-sm focus:outline-none uppercase"
                          disabled
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-400 uppercase">GST ID</label>
                        <input
                          type="text"
                          value={vendorProfile.gstNumber}
                          onChange={(e) => setVendorProfile({ ...vendorProfile, gstNumber: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl py-2 px-3 text-sm focus:outline-none uppercase"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-slate-400 uppercase">Registered Address</label>
                      <input
                        type="text"
                        value={vendorProfile.address}
                        onChange={(e) => setVendorProfile({ ...vendorProfile, address: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl py-2 px-3 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        onClick={() => alert('Profile credentials updated locally!')}
                        className="px-4.5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                      >
                        <span>Save Dossier Info</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Quote Submission Drawer Form Overlay */}
      <AnimatePresence>
        {selectedRfq && (
          <>
            <div className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/50 backdrop-blur-xs z-45" onClick={() => setSelectedRfq(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 shadow-2xl p-6 overflow-y-auto space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Submit Quotation bid</h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5">RFQ: {selectedRfq.title}</span>
                </div>
                <button
                  onClick={() => setSelectedRfq(null)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {quoteError && (
                <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold rounded-xl">
                  {quoteError}
                </div>
              )}

              <form onSubmit={handleSubmitQuotation} className="space-y-4 text-xs">
                
                {/* Price and Tax */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">Base Price Bid ($)</label>
                    <input
                      type="number"
                      required
                      value={quoteData.price}
                      onChange={(e) => setQuoteData({ ...quoteData, price: e.target.value })}
                      placeholder="72000"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">Tax Amount ($)</label>
                    <input
                      type="number"
                      value={quoteData.tax}
                      onChange={(e) => setQuoteData({ ...quoteData, tax: e.target.value })}
                      placeholder="3600"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Delivery date */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Proposed Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={quoteData.deliveryDate}
                    onChange={(e) => setQuoteData({ ...quoteData, deliveryDate: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-sm focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Document Mock upload */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Attach Bid Specification Sheets (PDF)</label>
                  <div className="border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl p-4.5 text-center bg-slate-50 dark:bg-slate-950/20 relative">
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                    <span className="text-[10px] font-bold text-slate-650 block">Upload document</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setQuoteData({ ...quoteData, documents: file.name });
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {quoteData.documents && (
                    <span className="text-[10px] text-brand-650 font-bold block mt-1">Uploaded: {quoteData.documents}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submittingQuote}
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-500/50 text-white rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  {submittingQuote ? (
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  ) : (
                    <span>Submit Sourcing Quotation</span>
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

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Loader2, Sparkles, Building, Phone, Mail, User, Shield } from 'lucide-react';
import MarketingHeader from '@/components/MarketingHeader';
import MarketingFooter from '@/components/MarketingFooter';

export default function BookDemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    employees: '',
    industry: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check validation
    if (!formData.name || !formData.email || !formData.company || !formData.phone || !formData.employees || !formData.industry) {
      setError('Please fill in all the details.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit demo request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative grid-bg">
      <MarketingHeader />

      <section className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-xs font-semibold text-brand-700 dark:text-brand-400">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Tailored Sourcing Walkthrough</span>
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              See ProcureAI In Action
            </h1>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">
              Schedule a personalized demo with our sourcing experts. Learn how to automate RFQ creation, organize reverse auctions, and implement custom approval workflows for your department.
            </p>
            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 space-y-4">
              <div className="flex items-center space-x-3 text-slate-500">
                <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">100% Secure & HIPAA / SOC-2 Compliant</span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card p-6 sm:p-8 rounded-3xl"
                >
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Request Demo Session</h3>
                  
                  {error && (
                    <div className="mb-4 p-3.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-455">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                            required
                          />
                        </div>
                      </div>
                      {/* Email */}
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Work Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@company.com"
                            className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Company */}
                      <div className="space-y-1.5">
                        <label htmlFor="company" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Company Name</label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Acme Corp"
                            className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                            required
                          />
                        </div>
                      </div>
                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Employees */}
                      <div className="space-y-1.5">
                        <label htmlFor="employees" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Employees</label>
                        <select
                          id="employees"
                          name="employees"
                          value={formData.employees}
                          onChange={handleChange}
                          className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                          required
                        >
                          <option value="">Select size...</option>
                          <option value="10">1-10 Employees</option>
                          <option value="50">11-50 Employees</option>
                          <option value="200">51-200 Employees</option>
                          <option value="1000">201-1000 Employees</option>
                          <option value="5000">1000+ Employees</option>
                        </select>
                      </div>
                      {/* Industry */}
                      <div className="space-y-1.5">
                        <label htmlFor="industry" className="text-xs font-bold text-slate-500 uppercase tracking-wide">Industry</label>
                        <select
                          id="industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className="w-full bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer"
                          required
                        >
                          <option value="">Select industry...</option>
                          <option value="Technology">Technology</option>
                          <option value="Logistics">Logistics / Supply Chain</option>
                          <option value="Finance">Finance / Banking</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Retail">Retail & E-commerce</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-500/50 text-white rounded-xl font-semibold shadow hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer mt-6"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Scheduling Session...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Demo Request</span>
                          <ChevronRight className="w-4.5 h-4.5" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-10 rounded-3xl text-center space-y-6 max-w-lg mx-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Demo Scheduled Successfully</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Thank you, <span className="font-bold text-slate-800 dark:text-slate-200">{formData.name}</span>! We have saved your request for <span className="font-bold text-slate-800 dark:text-slate-200">{formData.company}</span>. A sourcing consultant will reach out to <span className="font-bold text-slate-800 dark:text-slate-200">{formData.email}</span> within 2 hours.
                  </p>
                  <div>
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

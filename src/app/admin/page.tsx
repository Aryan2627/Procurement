"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Building, ShieldCheck, CreditCard, RefreshCw, X, LogOut,
  UserCheck, ShieldAlert, Award, Calendar, Check, Trash2, Ban, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import { useTheme } from '@/components/ThemeProvider';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Admin states
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Seed users matching db client
      setUsersList([
        { id: 'u-buyer', name: 'Alex Harrison', email: 'buyer@procure.ai', role: 'BUYER', companyName: 'Acme Procurement Corp', plan: 'ENTERPRISE' },
        { id: 'u-vendor', name: 'Sanjay Kumar', email: 'vendor@procure.ai', role: 'VENDOR', companyName: 'Nexis Tech Systems', plan: 'GROWTH' },
        { id: 'u-admin', name: 'Sarah Connor', email: 'admin@procure.ai', role: 'ADMIN', companyName: 'Acme Procurement Corp', plan: 'ENTERPRISE' }
      ]);

      // Seed audit logs
      setAuditLogs([
        { id: '1', user: 'Alex Harrison', action: 'AWARD_RFQ_CONTRACT', details: 'Marked quotation q-3 as WON, generated PO-2026-0001', ip: '192.168.1.1', time: '10m ago' },
        { id: '2', user: 'Sarah Connor', action: 'APPROVE_INVOICE_STAGE', details: 'Signed off FINANCE stage for Invoice INV-2026-9082', ip: '192.168.1.25', time: '1h ago' },
        { id: '3', user: 'Sanjay Kumar', action: 'SUBMIT_QUOTE', details: 'Submitted Quotation bid for RFQ-1 (Office Laptops Upgrade)', ip: '172.16.0.4', time: '3h ago' },
        { id: '4', user: 'Alex Harrison', action: 'CREATE_RFQ', details: 'Published RFQ: Office Laptops Upgrade Q3 (rfq-1)', ip: '192.168.1.1', time: '1d ago' }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = (id: string, nextRole: 'BUYER' | 'VENDOR' | 'ADMIN') => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, role: nextRole } : u));
    alert(`User role updated to ${nextRole} successfully.`);
  };

  const handleUpdateSubscription = (id: string, nextPlan: 'STARTER' | 'GROWTH' | 'ENTERPRISE') => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, plan: nextPlan } : u));
    alert(`Subscription plan updated to ${nextPlan}.`);
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Header */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-6 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-900 to-indigo-900 flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-lg font-bold dark:text-white">
            Procure<span className="text-brand-600 dark:text-brand-400 font-extrabold">AI</span> <span className="text-xs font-normal text-slate-400">Platform Admin</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 border-r border-slate-200 dark:border-slate-800 pr-4 text-xs text-right text-slate-650">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">{user?.name}</span>
              <span className="text-slate-400 block text-[10px]">Super Administrator</span>
            </div>
            <div className="w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold">
              A
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

      {/* Main Body */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        
        {/* Title row */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Sourcing Admin Console</h1>
            <p className="text-xs text-slate-500 mt-1">Global audit logs, company memberships, database user seats, and subscription control keys.</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Platform Users</span>
              <h3 className="text-lg font-extrabold dark:text-white">{usersList.length} Seats</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-605">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Entities</span>
              <h3 className="text-lg font-extrabold dark:text-white">18 Companies</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-605">
              <Building className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Tiers</span>
              <h3 className="text-lg font-extrabold dark:text-white">15 Active</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-650">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Traces</span>
              <h3 className="text-lg font-extrabold dark:text-white">2,840 Logs</h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-650">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User management table */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">User Seats Controller</h2>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-[10px] pl-7 pr-3 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-slate-205 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-slate-850">
                      <th className="px-4 py-3 font-bold text-slate-400 uppercase">User / Company</th>
                      <th className="px-4 py-3 font-bold text-slate-400 uppercase">Role</th>
                      <th className="px-4 py-3 font-bold text-slate-400 uppercase">Plan</th>
                      <th className="px-4 py-3 font-bold text-slate-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-300">
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="px-4 py-3">
                          <div>
                            <span className="block font-bold text-slate-850 dark:text-slate-200">{u.name}</span>
                            <span className="block text-[9px] text-slate-400 font-mono mt-0.5">{u.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-[10px] text-brand-650">{u.role}</td>
                        <td className="px-4 py-3 font-bold text-[10px] text-slate-500">{u.plan}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateRole(u.id, e.target.value as any)}
                              className="text-[9px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-1 rounded cursor-pointer font-bold focus:outline-none"
                            >
                              <option value="BUYER">BUYER</option>
                              <option value="VENDOR">VENDOR</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                            <select
                              value={u.plan}
                              onChange={(e) => handleUpdateSubscription(u.id, e.target.value as any)}
                              className="text-[9px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-1 rounded cursor-pointer font-bold focus:outline-none"
                            >
                              <option value="STARTER">STARTER</option>
                              <option value="GROWTH">GROWTH</option>
                              <option value="ENTERPRISE">ENTERPRISE</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Platform Security Audit Logs */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">System Security Audit Logs</h2>

            <div className="glass-card rounded-2xl border border-slate-205 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-slate-850">
                      <th className="px-4 py-3 font-bold text-slate-400 uppercase">Action / Actor</th>
                      <th className="px-4 py-3 font-bold text-slate-400 uppercase">Details</th>
                      <th className="px-4 py-3 font-bold text-slate-400 uppercase">IP Address</th>
                      <th className="px-4 py-3 font-bold text-slate-400 uppercase text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-350">
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-4 py-3.5">
                          <div>
                            <span className="block font-bold text-[10px] text-brand-650 font-mono uppercase leading-none">{log.action}</span>
                            <span className="block text-[9px] text-slate-450 mt-1">{log.user}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 font-semibold max-w-[200px] leading-relaxed truncate" title={log.details}>
                          {log.details}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 font-mono font-semibold">{log.ip}</td>
                        <td className="px-4 py-3.5 text-slate-400 text-right">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { 
  Settings, User, Bell, Shield, Sun, Moon, Info, Check, 
  Mail, Phone, Save, CreditCard, RefreshCw, Sparkles
} from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useTheme } from '@/components/ThemeProvider';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Profile settings
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileCompany, setProfileCompany] = useState(user?.companyName || '');

  // Notifications toggles
  const [notifs, setNotifs] = useState({
    emailAlerts: true,
    smsAlerts: false,
    auditLogs: true,
    auctionReminders: true
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-905 dark:text-white">System Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure your corporate account details, system notifications, billing subscriptions, and visual preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Tabs (Vertical representation) */}
        <div className="md:col-span-1 space-y-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-4">Sectors</h2>
          
          <div className="space-y-2">
            {[
              { name: 'Profile Details', icon: User },
              { name: 'Sourcing Alerts', icon: Bell },
              { name: 'Billing & Plan', icon: CreditCard }
            ].map((tab, idx) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={idx}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                    idx === 0
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900'
                  }`}
                >
                  <IconComp className="w-4 h-4 mr-2.5 text-slate-400 flex-shrink-0" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Box */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Profile settings card */}
            <div className="glass-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white pb-3.5 border-b border-slate-100 dark:border-slate-850 flex items-center">
                <User className="w-4 h-4 mr-2 text-brand-650" /> Profile Details
              </h3>

              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400 flex items-center">
                  <Check className="w-4 h-4 mr-1.5 flex-shrink-0" /> Settings updated successfully!
                </div>
              )}

              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">Your Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl py-2 px-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase">Work Email</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl py-2 px-3 text-sm focus:outline-none"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase">Company Entity</label>
                  <input
                    type="text"
                    value={profileCompany}
                    onChange={(e) => setProfileCompany(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl py-2 px-3 text-sm focus:outline-none"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Notification settings card */}
            <div className="glass-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white pb-3.5 border-b border-slate-100 dark:border-slate-850 flex items-center">
                <Bell className="w-4 h-4 mr-2 text-cyan-600" /> Sourcing Alert Toggles
              </h3>

              <div className="space-y-4 text-xs">
                {/* Email Toggler */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850/50">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Email RFQ Summaries</span>
                    <span className="text-[10px] text-slate-450 block mt-0.5">Receive quotation submittal summaries in your email inbox.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifs.emailAlerts}
                    onChange={(e) => setNotifs({ ...notifs, emailAlerts: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* SMS Toggler */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850/50">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">SMS Reverse Auction Alerts</span>
                    <span className="text-[10px] text-slate-450 block mt-0.5">Receive countdown alerts and low bid alerts on your registered phone.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifs.smsAlerts}
                    onChange={(e) => setNotifs({ ...notifs, smsAlerts: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                  />
                </div>

                {/* Audit Toggler */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Audit Activity Logs</span>
                    <span className="text-[10px] text-slate-450 block mt-0.5">Enables platform user audit activity logging on other seats.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifs.auditLogs}
                    onChange={(e) => setNotifs({ ...notifs, auditLogs: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Visual configuration card */}
            <div className="glass-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white pb-3.5 border-b border-slate-100 dark:border-slate-850 flex items-center">
                <Sun className="w-4 h-4 mr-2 text-amber-500" /> Visual Preferences
              </h3>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Toggle Sourcing Theme</span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Switch the platform workspace interface colors.</span>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-4.5 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm text-slate-700 dark:text-slate-350"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Light Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-brand-600" />
                      <span>Dark Theme</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Subscription Box */}
            <div className="glass-card p-6 rounded-3xl bg-gradient-to-tr from-brand-900 to-slate-900 border border-brand-900 text-white shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,171,250,0.1),transparent_35%)]" />
              
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div className="space-y-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-500 text-[9px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 mr-0.5" /> Active Sourcing Plan
                  </span>
                  <h4 className="text-sm font-bold mt-1">Enterprise Sourcing Subscription</h4>
                  <p className="text-[10px] text-slate-400">Renews on September 15, 2026 • Billing cycle: Annual</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl shadow cursor-pointer text-xs"
                >
                  Manage Billing
                </button>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-500/50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

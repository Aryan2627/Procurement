"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { 
  LayoutDashboard, FileSpreadsheet, Store, Coins, FileCheck, 
  TrendingDown, BarChart3, Settings, LogOut, Bell, Search, 
  Sun, Moon, Menu, X, Brain, User, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/quote`); // Standard endpoint fallback or custom logic
      // In this setup, we will mock state directly from our db client or API
      // Let's create mock notifications local state for immediate responsiveness
      setNotifs([
        { id: '1', message: 'Vendor "TechCorp Solutions Inc." submitted a bid for RFQ Office Laptops Upgrade.', read: false, time: '10m ago' },
        { id: '2', message: 'Approval chain level initiated for Invoice INV-GLOBAL-9092.', read: true, time: '1d ago' },
        { id: '3', message: 'RFQ "Q3 Office Stationery Supplies" was marked as closed.', read: true, time: '2d ago' }
      ]);
    } catch (e) {
      console.warn(e);
    }
  };

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'RFQs', href: '/dashboard/rfqs', icon: FileSpreadsheet },
    { name: 'Vendors', href: '/dashboard/vendors', icon: Store },
    { name: 'Auctions', href: '/dashboard/auctions', icon: TrendingDown },
    { name: 'Purchase Orders', href: '/dashboard/purchase-orders', icon: FileCheck },
    { name: 'Invoices', href: '/dashboard/invoices', icon: Coins },
    { name: 'Approvals', href: '/dashboard/approvals', icon: FileSpreadsheet },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'AI Sourcing', href: '/dashboard/ai-assistant', icon: Brain },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Checking enterprise session...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-950 transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <Link href="/dashboard" className="flex items-center space-x-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-bold bg-gradient-to-r from-slate-900 via-brand-600 to-slate-900 dark:from-white dark:via-brand-400 dark:to-white bg-clip-text text-transparent">
                Procure<span className="font-extrabold text-brand-600">AI</span>
              </span>
            )}
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <IconComp className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-650'}`} />
                {sidebarOpen && <span className="ml-3 truncate">{item.name}</span>}
                
                {/* Active Indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/5 bottom-1/5 w-1 bg-brand-600 dark:bg-brand-400 rounded-r-md" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-550 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/20 dark:hover:text-rose-455 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-rose-500" />
            {sidebarOpen && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 relative z-40 transition-colors duration-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search Input Mockup */}
            <div className="relative max-w-xs sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search spend records, vendors, RFQs..."
                className="w-48 sm:w-64 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notification Icon & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all relative cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-40 overflow-hidden"
                    >
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-xs font-bold dark:text-white">Recent Sourcing Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-[10px] font-bold text-brand-600 hover:underline dark:text-brand-400 cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {notifs.map((n) => (
                          <div key={n.id} className={`p-4 text-xs transition-colors ${n.read ? 'bg-white dark:bg-slate-900' : 'bg-brand-50/20 dark:bg-brand-950/20'}`}>
                            <p className="text-slate-700 dark:text-slate-300 leading-normal">{n.message}</p>
                            <span className="block text-[9px] text-slate-400 mt-1">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-3 sm:pl-4">
              <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {user.name ? user.name[0] : 'U'}
              </div>
              <div className="hidden md:block text-left max-w-[120px]">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-450 truncate">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Pages Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { 
  DollarSign, TrendingDown, FileText, Users, Clock, 
  ArrowUpRight, ArrowDownRight, RefreshCw, ChevronRight, Activity 
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { useAuth } from '@/components/AuthContext';

// Color palette for charts
const COLORS = ['#0270c9', '#06b6d4', '#6366f1', '#a855f7', '#ec4899'];

// Mock static analytics datasets
const monthlySpendData = [
  { month: 'Jan', spend: 85000, savings: 15000 },
  { month: 'Feb', spend: 92000, savings: 18000 },
  { month: 'Mar', spend: 110000, savings: 24000 },
  { month: 'Apr', spend: 95000, savings: 21000 },
  { month: 'May', spend: 120000, savings: 32000 },
  { month: 'Jun', spend: 135000, savings: 35000 },
  { month: 'Jul', spend: 142000, savings: 38000 },
];

const categorySpendData = [
  { name: 'Hardware', value: 75000 },
  { name: 'Infrastructure', value: 48000 },
  { name: 'Services', value: 32000 },
  { name: 'Office Supplies', value: 12000 },
  { name: 'Logistics', value: 25000 },
];

const supplierDistributionData = [
  { name: 'TechCorp Solutions', value: 45 },
  { name: 'Global Office Suppliers', value: 25 },
  { name: 'Alpha Security Systems', value: 20 },
  { name: 'Other Vendors', value: 10 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalSpend: 0,
    savingsGenerated: 0,
    activeRFQs: 0,
    approvedVendors: 0,
    pendingApprovals: 0
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API load
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setDashboardStats({
        totalSpend: 1420000,
        savingsGenerated: 320500,
        activeRFQs: 12,
        approvedVendors: 45,
        pendingApprovals: 3
      });

      setActivities([
        { id: '1', user: 'Alex Harrison', action: 'Created RFQ', detail: 'Q3 Developer Laptops Upgrade', date: '15m ago' },
        { id: '2', user: 'Sanjay Kumar (Vendor)', action: 'Placed Bid', detail: '$22,800 on Server Rack Sourcing', date: '32m ago' },
        { id: '3', user: 'Sarah Connor', action: 'Approved Invoice', detail: 'PO-2026-0001 Stationery Invoice', date: '2h ago' },
        { id: '4', user: 'System Bot', action: 'Automated PO', detail: 'Drafted PO-2026-0002 for Hardware Bid', date: '5h ago' },
        { id: '5', user: 'Alex Harrison', action: 'Approved Vendor', detail: 'TechCorp Solutions status updated to APPROVED', date: '1d ago' }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Compiling spend statistics...</p>
        </div>
      </div>
    );
  }

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Hello, {user?.name}. Here is what requires your attention today.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Metric 1 */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Spend</span>
            <h3 className="text-xl font-extrabold dark:text-white">{formatCurrency(dashboardStats.totalSpend)}</h3>
            <span className="text-[10px] text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +12.4% vs last Q
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Savings Won</span>
            <h3 className="text-xl font-extrabold dark:text-white">{formatCurrency(dashboardStats.savingsGenerated)}</h3>
            <span className="text-[10px] text-emerald-600 flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-0.5" /> -4.2% procurement cost
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active RFQs</span>
            <h3 className="text-xl font-extrabold dark:text-white">{dashboardStats.activeRFQs}</h3>
            <span className="text-[10px] text-slate-450">7 receiving quotations</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved Vendors</span>
            <h3 className="text-xl font-extrabold dark:text-white">{dashboardStats.approvedVendors}</h3>
            <span className="text-[10px] text-emerald-600">4 pending verification</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-450">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 5 */}
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
            <h3 className="text-xl font-extrabold dark:text-white">{dashboardStats.pendingApprovals}</h3>
            <span className="text-[10px] text-amber-500 font-bold">2 high value POs</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-550 dark:text-amber-450">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Spend Trend Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Spend Trend vs Cost Savings</h3>
              <p className="text-xs text-slate-400">Monthly aggregate for calendar year 2026</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySpendData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0270c9" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0270c9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area 
                  type="monotone" 
                  name="Monthly Spend"
                  dataKey="spend" 
                  stroke="#0270c9" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#spendGrad)" 
                />
                <Area 
                  type="monotone" 
                  name="Negotiated Savings"
                  dataKey="savings" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#savingsGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Spend Distribution */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Spend by Sourcing Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySpendData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={10} tickLine={false} width={80} />
                <Tooltip formatter={(v: any) => formatCurrency(v)} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categorySpendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Supplier share Pie Chart */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Sourcing Vendor Allocation</h3>
          <div className="h-60 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={supplierDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {supplierDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend verticalAlign="bottom" height={36} iconSize={10} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sourcing Audit logs Activity feed */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Sourcing Activity</h3>
            </div>
            <span className="text-[10px] bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 font-bold px-2 py-0.5 rounded">Real-time Feed</span>
          </div>

          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((item, idx) => (
                <li key={item.id}>
                  <div className="relative pb-6.5">
                    {idx !== activities.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-3.5">
                      <div>
                        <span className="h-8.5 w-8.5 rounded-full bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 ring-4 ring-white dark:ring-slate-900 font-bold text-xs">
                          {item.user[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1 flex justify-between space-x-4">
                        <div>
                          <p className="text-xs text-slate-500 leading-normal">
                            <span className="font-bold text-slate-800 dark:text-slate-205">{item.user}</span>{' '}
                            {item.action}: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.detail}</span>
                          </p>
                        </div>
                        <div className="text-right text-[10px] whitespace-nowrap text-slate-400 font-medium">
                          {item.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

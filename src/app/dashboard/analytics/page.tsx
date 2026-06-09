"use client";

import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar,
  Activity, Award, RefreshCw, BarChart, Percent, Clock, FileCheck
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart as RechartsBarChart, Bar, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie
} from 'recharts';

// Mock detailed dataset
const monthlySpendSavings = [
  { month: 'Jan', spend: 85000, savings: 15000, targetBudget: 100000 },
  { month: 'Feb', spend: 92000, savings: 18000, targetBudget: 110000 },
  { month: 'Mar', spend: 110000, savings: 24000, targetBudget: 130000 },
  { month: 'Apr', spend: 95000, savings: 21000, targetBudget: 115000 },
  { month: 'May', spend: 120000, savings: 32000, targetBudget: 150000 },
  { month: 'Jun', spend: 135000, savings: 35000, targetBudget: 165000 },
  { month: 'Jul', spend: 142000, savings: 38000, targetBudget: 180000 },
];

const categoryData = [
  { name: 'Hardware', value: 75000 },
  { name: 'Infrastructure', value: 48000 },
  { name: 'Services', value: 32000 },
  { name: 'Office Supplies', value: 12000 },
  { name: 'Logistics', value: 25000 },
];

const vendorEfficiency = [
  { name: 'TechCorp Solutions', rating: 4.8, cycleDays: 5.5, volume: 14 },
  { name: 'Global Office Suppliers', rating: 4.5, cycleDays: 7.2, volume: 22 },
  { name: 'Alpha Security Systems', rating: 4.2, cycleDays: 9.0, volume: 8 },
  { name: 'Apex Construction Group', rating: 3.9, cycleDays: 14.5, volume: 3 }
];

const procurementCycleTime = [
  { month: 'Jan', avgDays: 12.4 },
  { month: 'Feb', avgDays: 11.8 },
  { month: 'Mar', avgDays: 10.2 },
  { month: 'Apr', avgDays: 9.5 },
  { month: 'May', avgDays: 8.4 },
  { month: 'Jun', avgDays: 6.8 },
  { month: 'Jul', avgDays: 5.2 }
];

const COLORS = ['#0270c9', '#06b6d4', '#6366f1', '#a855f7', '#ec4899'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setLoading(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-905 dark:text-white">Procurement Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">Deep analysis of corporate spending, budget benchmarks, vendor scores, and cycle times.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Models</span>
        </button>
      </div>

      {/* Analytics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">COST AVOIDANCE RATIO</span>
            <h3 className="text-xl font-extrabold dark:text-white">22.5%</h3>
            <span className="text-[10px] text-emerald-600 font-semibold block">Goal: 20.0% benchmarked</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SOURCING SETTLE TIME</span>
            <h3 className="text-xl font-extrabold dark:text-white">5.2 Days</h3>
            <span className="text-[10px] text-emerald-600 font-semibold block">Down from 12.4 in Jan</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">BUDGET COMPLIANCE</span>
            <h3 className="text-xl font-extrabold dark:text-white">96.8%</h3>
            <span className="text-[10px] text-emerald-600 font-semibold block">+1.2% variance control</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CONTRACTED VALUE</span>
            <h3 className="text-xl font-extrabold dark:text-white">$756,000</h3>
            <span className="text-[10px] text-slate-450 block">8 core contracts awarded</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Core Chart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cost Savings Area Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Sourcing Spend and Settle Budgets</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlySpendSavings}>
                <defs>
                  <linearGradient id="spendCol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0270c9" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#0270c9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="budgetCol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip formatter={(v: any) => formatCurrency(v)} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area 
                  type="monotone" 
                  name="Calculated Spend"
                  dataKey="spend" 
                  stroke="#0270c9" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#spendCol)" 
                />
                <Area 
                  type="monotone" 
                  name="Budget Limit"
                  dataKey="targetBudget" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#budgetCol)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top categories distribution */}
        <div className="lg:col-span-4 glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Spend Volume Categories</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={10} tickLine={false} width={80} />
                <Tooltip formatter={(v: any) => formatCurrency(v)} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cycle time Line Chart */}
        <div className="lg:col-span-6 glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6">Sourcing Process Speed (Avg Days to Settle)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={procurementCycleTime}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit=" days" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="avgDays" 
                  name="Average Days"
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vendor Efficiency */}
        <div className="lg:col-span-6 glass-card p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Sourced Vendor Score Cards</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="pb-3.5">Vendor</th>
                  <th className="pb-3.5">Contracts</th>
                  <th className="pb-3.5">Avg Cycle Speed</th>
                  <th className="pb-3.5 text-right">Rating Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-300">
                {vendorEfficiency.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="py-3.5">{item.name}</td>
                    <td className="py-3.5">{item.volume} contracts</td>
                    <td className="py-3.5">{item.cycleDays} days</td>
                    <td className="py-3.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-650 font-bold dark:bg-brand-950/40 dark:text-brand-400">
                        ★ {item.rating.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, FileText, TrendingDown, ClipboardCheck, ScrollText, 
  Coins, BarChart2, ShieldCheck, Sparkles, ArrowRight, CheckCircle2
} from 'lucide-react';
import MarketingHeader from '@/components/MarketingHeader';
import MarketingFooter from '@/components/MarketingFooter';

export default function FeaturesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const categories = [
    {
      title: "Core Procurement",
      features: [
        {
          icon: Users,
          color: "text-brand-600 dark:text-brand-455 bg-brand-500/10",
          title: "Supplier Management",
          desc: "Maintains a secure vendor database with contact persons, address coordinates, rating values, and uploaded PDF verification files. Verify PAN and GST details instantly."
        },
        {
          icon: FileText,
          color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
          title: "Dynamic RFQ Processing",
          desc: "Create RFQ forms specifying category groups, deadlines, budgets, and quantity sizes. Select target suppliers and trigger notifications with a single click."
        },
        {
          icon: TrendingDown,
          color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
          title: "Live Reverse Auctions",
          desc: "Create real-time competitive bidding events. Automatic bidder ranking, minimum decrement enforcement, countdown clocks, and instant winner selection."
        }
      ]
    },
    {
      title: "Finance & Operations",
      features: [
        {
          icon: ClipboardCheck,
          color: "text-emerald-600 dark:text-emerald-450 bg-emerald-500/10",
          title: "Purchase Order Generation",
          desc: "Automatically drafts a formatted purchase order when a quotation is marked as won. Exports formatted tax, address details, and delivery date lists."
        },
        {
          icon: Coins,
          color: "text-amber-600 dark:text-amber-450 bg-amber-500/10",
          title: "Invoice Tracking & Statuses",
          desc: "Vendors upload PDF invoices directly. Track transaction status (Pending -> Approved -> Paid) and sync metadata immediately to the buyer ledger."
        },
        {
          icon: ScrollText,
          color: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
          title: "Multi-Level Approval Chain",
          desc: "Define hierarchical approvals (Manager -> Finance -> Procurement Head -> Admin). Visually trace who has approved a PO or invoice and identify bottlenecks."
        }
      ]
    },
    {
      title: "Intelligence & Platform",
      features: [
        {
          icon: BarChart2,
          color: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
          title: "Sleek Spend Analytics",
          desc: "Explore charts detailing monthly trends, category distributions, cost savings margins, and supplier performance scorecards using Recharts."
        },
        {
          icon: Sparkles,
          color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
          title: "AI Procurement Assistant",
          desc: "Interact with our natural language AI model. Generate RFQs, evaluate quotes, summarize contract clauses, and search supplier databases using simple prompts."
        },
        {
          icon: ShieldCheck,
          color: "text-teal-600 dark:text-teal-400 bg-teal-500/10",
          title: "Audit Logging & Subscriptions",
          desc: "Complete security compliance logs. Track every user login, RFQ creation, PO generation, and role settings changes. Supports Starter, Growth, and Enterprise plans."
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative grid-bg">
      <MarketingHeader />

      {/* Main Hero */}
      <section className="pt-32 pb-12 sm:pt-40 lg:pt-44 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            PRODUCT Tour
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3 mb-5">
            Enterprise Sourcing, Reimagined.
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate manuals and fragmented spreadsheets. ProcureAI groups supplier management, live reverse bidding, and approvals under a single security framework.
          </p>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-8">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {cat.title}
                  </h2>
                  <div className="flex-1 h-px bg-slate-200/60 dark:bg-slate-800" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {cat.features.map((feat, fIdx) => {
                    const IconComp = feat.icon;
                    return (
                      <motion.div
                        key={fIdx}
                        variants={itemVariants}
                        className="glass-card p-6.5 rounded-2xl flex flex-col justify-between"
                      >
                        <div className="space-y-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${feat.color}`}>
                            <IconComp className="w-5.5 h-5.5" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {feat.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Screenshot / Mockup Preview */}
      <section className="py-20 bg-slate-100/40 dark:bg-slate-900/10 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Interactive Dashboard Console Mockup
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                Take a look at the actual active layout built for buyers. With responsive navigation sidebars, live transaction monitors, and interactive data metrics, it gives managers instant control over corporate spend profiles.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Responsive side layout controls",
                  "Consolidated audit records list",
                  "PDF quotation summary printing",
                  "Live WebSocket auction deck"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Link href="/register" className="inline-flex items-center space-x-1.5 px-6 py-3 font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors shadow">
                  <span>Sign Up & View Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Simulated Desktop Preview UI */}
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col h-[320px] bg-white dark:bg-slate-950">
              {/* Browser bar */}
              <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2 border-b border-slate-200/60 dark:border-slate-800 flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-450" />
                <div className="w-3 h-3 rounded-full bg-amber-450" />
                <div className="w-3 h-3 rounded-full bg-emerald-450" />
                <div className="bg-white dark:bg-slate-950 text-[10px] text-slate-400 dark:text-slate-500 px-6 py-0.5 rounded border border-slate-200/30 flex-1 text-center max-w-[240px] mx-auto truncate">
                  procure.ai/dashboard/overview
                </div>
              </div>

              {/* Layout body */}
              <div className="flex flex-1 overflow-hidden">
                {/* Mini sidebar */}
                <div className="w-16 bg-slate-50 dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800 p-2 flex flex-col space-y-3 items-center">
                  <div className="w-6 h-6 rounded bg-brand-500/20" />
                  <div className="w-8 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-8 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-8 h-2 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                {/* Main area mockup */}
                <div className="flex-1 p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-16 h-5 bg-brand-500/10 rounded-full" />
                  </div>
                  {/* Grid blocks */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl space-y-2">
                      <div className="w-6 h-2 bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="w-12 h-4 bg-brand-600/20 rounded" />
                    </div>
                    <div className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl space-y-2">
                      <div className="w-6 h-2 bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="w-10 h-4 bg-emerald-600/20 rounded" />
                    </div>
                    <div className="p-3 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl space-y-2">
                      <div className="w-6 h-2 bg-slate-200 dark:bg-slate-850 rounded" />
                      <div className="w-8 h-4 bg-slate-300 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                  {/* Chart representation */}
                  <div className="h-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-end p-2 justify-between">
                    {[30, 50, 45, 60, 40, 75, 90, 85].map((h, i) => (
                      <div key={i} style={{ height: `${h}%` }} className="w-4.5 bg-gradient-to-t from-brand-600 to-cyan-500 rounded-t" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

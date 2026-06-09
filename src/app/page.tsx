"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Zap, Sparkles, TrendingUp, DollarSign, 
  Users, Layers, Award, ChevronDown, Check, FileText, ChevronRight,
  MessageSquare, BarChart3, Database, Send, Play
} from 'lucide-react';
import MarketingHeader from '@/components/MarketingHeader';
import MarketingFooter from '@/components/MarketingFooter';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const analyticsData = [
  { name: 'Jan', spend: 4000, savings: 2400 },
  { name: 'Feb', spend: 3000, savings: 1398 },
  { name: 'Mar', spend: 2000, savings: 9800 },
  { name: 'Apr', spend: 2780, savings: 3908 },
  { name: 'May', spend: 1890, savings: 4800 },
  { name: 'Jun', spend: 2390, savings: 3800 },
  { name: 'Jul', spend: 3490, savings: 4300 },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'spend' | 'savings'>('spend');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Procurement Assistant. How can I help you optimize your procurement cycle today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Statistics counters
  const [stats, setStats] = useState({ spend: 0, savings: 0, efficiency: 0 });

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStats({
        spend: Math.floor((14.2 / steps) * step * 10) / 10,
        savings: Math.floor((32 / steps) * step),
        efficiency: Math.floor((85 / steps) * step)
      });

      if (step >= steps) {
        setStats({ spend: 14.2, savings: 32, efficiency: 85 });
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const handleSendChat = (text: string) => {
    if (!text.trim()) return;
    
    const newMsgs = [...chatMessages, { role: 'user', content: text }];
    setChatMessages(newMsgs);
    setChatInput('');
    setIsTyping(true);

    // Simulated responses
    setTimeout(() => {
      let reply = "I've analyzed that request. Let me know if you would like me to compile details.";
      const lowText = text.toLowerCase();
      if (lowText.includes('supplier') || lowText.includes('vendor')) {
        reply = "Based on GST history and delivery ratings, I suggest **TechCorp Solutions** (Rating 4.8) and **Global Office Suppliers** (Rating 4.5) for your office upgrades. Shall I draft the invitation?";
      } else if (lowText.includes('rfq') || lowText.includes('draft')) {
        reply = "I've drafted a draft RFQ outline for 'Office Laptops Upgrade': \n\n* **Title:** Q3 Developer Laptops Upgrade\n* **Quantity:** 50 Units\n* **Specifications:** 32GB RAM, 1TB SSD\n* **Estimated Budget:** $75,000\n\nWould you like me to publish this to our approved suppliers?";
      } else if (lowText.includes('spend') || lowText.includes('analyze')) {
        reply = "Analyzing your Q2 spending: We identified $4,200 in redundant SaaS licenses and recommend consolidation, yielding a potential **12% cost reduction**.";
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const faqs = [
    { q: "How does the AI assistant suggest vendors?", a: "Our AI queries your internal supplier base combined with market intelligence, evaluating historical compliance, delivery timelines, GST status, PAN cards, and performance feedback score cards." },
    { q: "Can we run multi-stage approval workflows?", a: "Yes, ProcureAI enables setting chains (Manager -> Finance -> Procurement Head -> Admin) based on monetary thresholds, categories, or department parameters." },
    { q: "What is a reverse auction and how does it work?", a: "A reverse auction is a bidding portal where vendors submit progressively lower bids in real-time. Dynamic countdowns and decrements drive competitive pricing, automatically generating purchase orders for winners." },
    { q: "Is our invoice data secure?", a: "Absolutely. All documents are stored using AES-256 encryption. We support role-based credentials (RBAC) ensuring only authorized financial auditors see payments, in compliance with standard SaaS security protocols." }
  ];

  return (
    <div className="flex flex-col min-h-screen relative grid-bg">
      <MarketingHeader />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pt-44 lg:pb-32 overflow-hidden">
        {/* Glow Blobs */}
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-brand-400/20 dark:bg-brand-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute top-80 right-1/4 w-80 h-80 bg-cyan-400/15 dark:bg-cyan-500/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200/50 dark:border-brand-900/50 text-xs font-semibold text-brand-700 dark:text-brand-400 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation AI Procurement Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-none mb-6"
          >
            Transform Procurement <br className="hidden sm:inline" />
            With <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">AI Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Manage suppliers, RFQs, auctions, approvals and spending from one platform. Empower your finance teams to save millions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16"
          >
            <Link
              href="/book-demo"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 rounded-xl shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-200"
            >
              Book Demo
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-350 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 backdrop-blur-sm transition-all"
            >
              Start Free Trial
            </Link>
          </motion.div>

          {/* Interactive Statistics Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto glass-card p-6 sm:p-8 rounded-2xl mb-12"
          >
            <div className="text-center">
              <span className="block text-4xl sm:text-5xl font-extrabold text-brand-600 dark:text-brand-400">
                ${stats.spend}B
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Spend Under Management</span>
            </div>
            <div className="text-center border-t sm:border-t-0 sm:border-x border-slate-200/50 dark:border-slate-800/50 py-4 sm:py-0">
              <span className="block text-4xl sm:text-5xl font-extrabold text-brand-600 dark:text-brand-400">
                {stats.savings}%
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Average Cost Savings</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl sm:text-5xl font-extrabold text-brand-600 dark:text-brand-400">
                {stats.efficiency}%
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Cycle Time Reduction</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted Companies Section */}
      <section className="py-8 bg-slate-50/50 dark:bg-slate-950/20 border-y border-slate-200/30 dark:border-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6">
            TRUSTED BY FORWARD-THINKING PROCUREMENT TEAMS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-75">
            {['TechCorp', 'Stripe Inc.', 'Uber Technologies', 'Flexport Logistics', 'Webflow'].map((logo, idx) => (
              <span key={idx} className="text-sm sm:text-base font-bold text-slate-400 dark:text-slate-600 tracking-tight">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Everything You Need To Secure Your Margins
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            A comprehensive tool suite built for CFOs, buyers, and suppliers. Streamline compliance, decrease cycle times, and automate audits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Supplier Management</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Build a secure directory. Validate GST compliance, PAN verification, and monitor performance feedback score cards in real-time.
            </p>
          </div>
          {/* Card 2 */}
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Dynamic RFQ Management</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Create, review, and issue Requests for Quotations instantly. Export formatted summaries, attach spec sheets, and notify vendors.
            </p>
          </div>
          {/* Card 3 */}
          <div className="glass-card p-8 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold dark:text-white">Real-Time Reverse Auctions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Conduct competitive bidding. Watch bids drop with active count-down timers and automatic selection of the lowest verified bid.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/features" className="inline-flex items-center space-x-1 text-brand-600 dark:text-brand-400 font-semibold hover:underline group">
            <span>Explore all features</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Spend Analytics Preview Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
                SAVINGS OPTIMIZATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Visualize Spending Patterns Instantly
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect your accounting systems and ERPs. Our analytics dashboards aggregate spending by department, category, and vendor to highlight leakages and opportunities.
              </p>
              <div className="space-y-3">
                {[
                  'Automated categories categorization',
                  'Cost savings calculation compared to budgets',
                  'Vendor concentration audits'
                ].map((b, i) => (
                  <div key={i} className="flex items-center space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-350">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recharts Block */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-base font-bold dark:text-white">Procurement Forecast</h4>
                  <p className="text-xs text-slate-400">Total Spend vs. Calculated Savings</p>
                </div>
                <div className="flex space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('spend')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      activeTab === 'spend' 
                        ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-900 dark:text-brand-400' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                    }`}
                  >
                    Spend
                  </button>
                  <button
                    onClick={() => setActiveTab('savings')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      activeTab === 'savings' 
                        ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-900 dark:text-brand-400' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                    }`}
                  >
                    Savings
                  </button>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0270c9" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0270c9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey={activeTab === 'spend' ? 'spend' : 'savings'} 
                      stroke="#0270c9" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Procurement Assistant Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Simulated Chat Interface */}
          <div className="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[400px]">
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">ProcureAI Assistant (Live Demonstration)</span>
              </div>
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-brand-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-slate-400 flex items-center space-x-1 border border-slate-200/50 dark:border-slate-700/50">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Chips */}
            <div className="px-4 py-2 border-t border-slate-200/40 dark:border-slate-800 flex flex-wrap gap-2">
              <button 
                onClick={() => handleSendChat("Suggest suppliers for IT laptops")}
                className="text-xs px-2.5 py-1 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:hover:bg-brand-900 dark:text-brand-400 border border-brand-200/20 cursor-pointer"
              >
                🔍 Suggest Suppliers
              </button>
              <button 
                onClick={() => handleSendChat("Draft Q3 laptop RFQ specifications")}
                className="text-xs px-2.5 py-1 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:hover:bg-brand-900 dark:text-brand-400 border border-brand-200/20 cursor-pointer"
              >
                📝 Generate RFQ
              </button>
              <button 
                onClick={() => handleSendChat("Analyze spend consolidation")}
                className="text-xs px-2.5 py-1 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:hover:bg-brand-900 dark:text-brand-400 border border-brand-200/20 cursor-pointer"
              >
                📊 Analyze Spend
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat(chatInput);
              }}
              className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center space-x-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask your assistant (e.g. 'Draft laptops RFQ')..."
                className="flex-1 bg-white dark:bg-slate-950 text-sm px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="p-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Natural Language Procurement</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              AI That Thinks Like A Procurement Head
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Stop writing templates manually. Ask our neural search core to analyze vendor history, draft statements of work, compare bid pricing spreadsheets, or suggest vendor compliance approvals inside a unified chat interface.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Contract Summaries</h4>
                <p className="text-xs text-slate-500">Auto-extract clauses, penalty markers, and renewal terms.</p>
              </div>
              <div className="p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Bid Comparisons</h4>
                <p className="text-xs text-slate-500">Instantly generate cross-quote charts based on delivery and prices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/10 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Approved By Leading CFOs
            </h2>
            <p className="text-slate-500">See how enterprises save millions of dollars in sourcing cycles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "ProcureAI consolidated our vendor bidding process. Sourcing cycles dropped from 3 weeks to 48 hours, saving us 14% on dev laptops.",
                author: "Sarah Jenkins",
                role: "Director of Sourcing, TechCorp"
              },
              {
                quote: "The automated multi-level approvals chain took away the spreadsheet headaches. Auditors are happy, and operations are faster.",
                author: "Devon Carter",
                role: "VP of Finance, Stripe Log"
              },
              {
                quote: "Conducting reverse auctions on server cabinets saved us $35,000 on infrastructure costs. The real-time bid portal works like magic.",
                author: "Vikram Mehta",
                role: "Head of Infrastructure, Nexis Systems"
              }
            ].map((t, idx) => (
              <div key={idx} className="glass-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.author}</h4>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-slate-500 mt-2">Everything you need to know about the platform capabilities.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full text-left px-6 py-4.5 flex justify-between items-center text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transform transition-transform duration-200 ${activeFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30"
                  >
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-brand-900 to-indigo-900 p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,171,250,0.15),transparent_40%)]" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready To Maximize Sourcing Savings?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
              Get started today. Empower your buying operations with AI automation, reverse auctions, and custom approvals.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3.5 sm:space-y-0 sm:space-x-4 pt-4">
              <Link href="/book-demo" className="w-full sm:w-auto px-8 py-3.5 font-bold text-brand-950 bg-white hover:bg-slate-100 rounded-xl transition-colors">
                Book Demo
              </Link>
              <Link href="/register" className="w-full sm:w-auto px-8 py-3.5 font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

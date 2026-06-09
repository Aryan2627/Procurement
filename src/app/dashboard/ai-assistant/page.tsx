"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, Send, Sparkles, RefreshCw, Cpu, Award, 
  FileText, ShieldCheck, BarChart3, Database, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  statusLogs?: string[];
}

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeStatus, setActiveStatus] = useState<string>('');
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome back, ${user?.name || 'Sourcing Leader'}. I am your dedicated AI Procurement Assistant. 

I can help you:
* **Generate RFQs** with detailed specs instantly.
* **Suggest Suppliers** from our database matching ratings and PAN/GST compliance.
* **Analyze Corporate Spend** to identify license redundancies.
* **Summarize Contracts** and highlight penalty clauses or SLA metrics.

Select a quick-preset on the left sidebar, or type a query below.`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const presets = [
    {
      title: "🔍 Suggest Suppliers",
      prompt: "Suggest suppliers for 50 Developer Laptops upgrades.",
      reply: `I have queried our verified database for **Developer Hardware** suppliers. Based on PAN/GST validation, rating metrics, and proximity, here are my recommendations:

| Supplier Name | Rating | Active Contracts | Tax Status | Contact Rep |
| :--- | :---: | :---: | :---: | :--- |
| **TechCorp Solutions Inc.** | ★ 4.8 | 14 | GST Verified | John Smith |
| **Global Office Suppliers Ltd.** | ★ 4.5 | 22 | GST Verified | Emily Davis |
| **Alpha Security Systems** | ★ 4.2 | 8 | GST Verified | Vikram Singh |

*TechCorp has the shortest average cycle delivery times (5.5 days).* Would you like me to draft a request invitation for them?`,
      statusLogs: ['Querying database directory...', 'Checking GST compliance status...', 'Compiling vendor performance scores...']
    },
    {
      title: "📝 Generate RFQ Specs",
      prompt: "Draft specs for Q3 Sourcing RFQ - 8 Cabinet Server Racks.",
      reply: `I have compiled a specification layout for the **Server hosting cabinets** RFQ:

### Draft RFQ Outline: Infrastructure Procurement
* **Category:** Datacenter Infrastructure
* **Target Quantity:** 8 Units
* **Ceiling Budget:** $24,000
* **Deadline:** 10 Days from publication

#### General Specifications Required:
1. **Enclosure Size:** 42U Rack, Width 600mm, Depth 1000mm.
2. **PDU Configuration:** Dual-input vertical intelligent PDU (24 outlets).
3. **Physical Protection:** Biometric fingerprint lock integration on doors.
4. **Airflow Rating:** Perforated front/rear doors allowing 80% ventilation.

Would you like to auto-fill this draft into our **RFQ Directory Creation Form**?`,
      statusLogs: ['Analyzing category standards...', 'Compiling hardware benchmarks...', 'Generating draft template layout...']
    },
    {
      title: "📊 Analyze Redundant Spend",
      prompt: "Analyze Q2 spending and suggest cost consolidation.",
      reply: `Analyzing Q2 transaction registries. Sourcing audit identifies **two redundant software subscription pipelines**:

1. **Category: CRM Software licenses**
   * Settle Spend: $14,500.
   * Redundancy: 12 seat licenses inactive for 45+ days.
   * **Calculated Savings: $1,800/mo (12.4% cost drop).**

2. **Category: Cloud Storage Hosting**
   * Settle Spend: $22,000.
   * Redundancy: Duplicate cloud hosting slots between marketing and operations.
   * **Calculated Savings: $2,400/mo (10.9% cost drop).**

**Consolidated Sourcing Recommendation:** Terminate inactive accounts and merge cloud host buckets. This yields a total projected savings of **$4,200/mo**.`,
      statusLogs: ['Loading invoice ledgers...', 'Checking software seats utilization...', 'Calculating cost avoidance margins...']
    },
    {
      title: "📄 Summarize SLA Contract",
      prompt: "Summarize penalty clauses from TechCorp SLA proposal.",
      reply: `SLA contract analysis complete for **TechCorp Developer Laptops proposal**. Sourcing audit highlights:

* **General Delivery SLA:** Settle within 14 business days of PO receipt.
* **Late Penalty Clause:** 1.5% fee decrement of total PO volume per day of late delivery, capped at a maximum of 15% discount.
* **Return & Refund window:** 30 calendar days for defective hardware replacement at zero shipping expense.
* **Payment Terms:** Net 30 days upon verified invoice upload.

*Sourcing Head Alert:* The 15% penalty cap is standard, but the 1.5% daily decrement is stricter than average (usually 1.0%). Would you like me to propose a counter-draft?`,
      statusLogs: ['OCR scanning contract PDF...', 'Searching for "penalty" and "SLA" keywords...', 'Extracting net payment timelines...']
    }
  ];

  const handleSendPrompt = async (text: string, customReply?: string, logs?: string[]) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Dynamic logs display simulation
    const steps = logs || ['Accessing procurement models...', 'Formulating response...'];
    for (const step of steps) {
      setActiveStatus(step);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const replyText = customReply || `I have evaluated: "${text}". Let me know if you would like me to compile specific reports from the database or run contract comparisons.`;

    const botMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'assistant',
      content: replyText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
    setActiveStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-905 dark:text-white">AI Sourcing Assistant</h1>
        <p className="text-xs text-slate-500 mt-1">Chat in natural language to search databases, draft specification files, summarize vendor SLAs, and optimize spend.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[540px]">
        {/* Preset chips */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sourcing Prompts</h2>
          <div className="grid grid-cols-1 gap-3.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(p.prompt, p.reply, p.statusLogs)}
                disabled={isTyping}
                className="w-full text-left p-4.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 hover:border-brand-500/35 hover:bg-slate-50/50 dark:hover:bg-slate-950/20 rounded-2xl transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{p.title}</span>
                <span className="text-[10px] text-slate-450 block mt-1.5 line-clamp-1 italic">"{p.prompt}"</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-8 glass-card border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between h-full bg-white dark:bg-slate-900 rounded-3xl">
          {/* Header */}
          <div className="bg-slate-50 dark:bg-slate-950 px-5 py-4 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500">
                <Brain className="w-4.5 h-4.5 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Sourcing Agent Core</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Dual Sourcing Models • Active</span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-brand-650 dark:text-brand-400" />
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-250 rounded-bl-none border border-slate-100 dark:border-slate-800'
                  }`}
                >
                  {/* Render simulated formatting for markdown list bullet points */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-center space-x-2">
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl rounded-bl-none px-4 py-3 text-[10px] text-slate-400 flex items-center space-x-1.5 border border-slate-100 dark:border-slate-800">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                </div>
                {activeStatus && (
                  <span className="text-[9px] text-slate-450 animate-pulse font-semibold">{activeStatus}</span>
                )}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Console */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(input);
            }}
            className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'draft cabinet specs', 'verify TechCorp compliance')..."
              className="flex-1 bg-white dark:bg-slate-900 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-1 focus:ring-brand-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="p-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-500/50 text-white rounded-xl shadow transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

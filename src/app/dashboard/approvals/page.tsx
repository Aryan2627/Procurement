"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileCheck, Shield, ChevronRight, Check, Clock, X, AlertCircle,
  TrendingDown, FileSpreadsheet, RefreshCw, FileText, CheckCircle2, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';

export default function ApprovalsPage() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      // Seed data matching mock db approvals
      const sampleApprovals = [
        {
          id: 'app-1',
          type: 'PO',
          targetId: 'po-1',
          targetName: 'PO-2026-0001 (TechCorp Laptops)',
          amount: 75600,
          currentLevel: 'FINANCE',
          status: 'PENDING',
          chainState: {
            MANAGER: { status: 'APPROVED', user: 'Alex Harrison', date: '1d ago' },
            FINANCE: { status: 'PENDING', user: 'Finance Team', date: null },
            PROCUREMENT_HEAD: { status: 'PENDING', user: 'Procurement Head', date: null },
            ADMIN: { status: 'PENDING', user: 'Sarah Connor', date: null }
          },
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'app-2',
          type: 'RFQ',
          targetId: 'rfq-2',
          targetName: 'RFQ-2026-0002 (Infrastructure Cabinet)',
          amount: 24000,
          currentLevel: 'MANAGER',
          status: 'PENDING',
          chainState: {
            MANAGER: { status: 'PENDING', user: 'Alex Harrison', date: null },
            FINANCE: { status: 'PENDING', user: 'Finance Team', date: null },
            PROCUREMENT_HEAD: { status: 'PENDING', user: 'Procurement Head', date: null },
            ADMIN: { status: 'PENDING', user: 'Sarah Connor', date: null }
          },
          createdAt: new Date().toISOString()
        }
      ];
      setApprovals(sampleApprovals);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStage = async (appId: string, level: string) => {
    setUpdating(true);
    try {
      // Simulate API call to approve level
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setApprovals(prev => prev.map(app => {
        if (app.id !== appId) return app;
        
        const chain = { ...app.chainState };
        chain[level] = {
          status: 'APPROVED',
          user: user?.name || 'Authorized Auditor',
          date: 'Just now'
        };

        // Determine next level
        let nextLevel = app.currentLevel;
        let overallStatus = app.status;

        if (level === 'MANAGER') nextLevel = 'FINANCE';
        else if (level === 'FINANCE') nextLevel = 'PROCUREMENT_HEAD';
        else if (level === 'PROCUREMENT_HEAD') nextLevel = 'ADMIN';
        else if (level === 'ADMIN') {
          nextLevel = 'ADMIN';
          overallStatus = 'APPROVED';
        }

        const updated = {
          ...app,
          currentLevel: nextLevel,
          status: overallStatus,
          chainState: chain
        };

        if (selectedApproval && selectedApproval.id === appId) {
          setSelectedApproval(updated);
        }
        return updated;
      }));

    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const levelsOrder = ['MANAGER', 'FINANCE', 'PROCUREMENT_HEAD', 'ADMIN'];

  const getStepStatusIcon = (stepStatus: string, isCurrent: boolean) => {
    if (stepStatus === 'APPROVED') {
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-emerald-100 dark:ring-emerald-950">
          <Check className="w-4 h-4" />
        </div>
      );
    }
    if (isCurrent) {
      return (
        <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-brand-100 dark:ring-brand-950 animate-pulse">
          <Clock className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200 dark:border-slate-700">
        <Clock className="w-4 h-4" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Approvals Console</h1>
        <p className="text-xs text-slate-500 mt-1">Audit high-value transactions, review details, and sign off on stages of the sourcing lifecycle.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Approvals List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Awaiting Sourcing Signatures</h2>

          <div className="space-y-4">
            {loading ? (
              <div className="py-10 text-center">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-600" />
              </div>
            ) : approvals.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl text-slate-400 text-xs">
                All approval requests signed off.
              </div>
            ) : (
              approvals.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => setSelectedApproval(app)}
                  className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedApproval?.id === app.id 
                      ? 'border-brand-500 bg-brand-50/5 dark:border-brand-400 dark:bg-brand-950/10 shadow-md' 
                      : 'border-slate-200/50 dark:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-[180px]">{app.targetName}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Category: {app.type}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/30'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/30'
                    }`}>
                      {app.status === 'APPROVED' ? 'COMPLETE' : `AWAITING: ${app.currentLevel}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 dark:border-slate-850 mt-3 text-xs">
                    <span className="text-slate-500 font-bold">${app.amount.toLocaleString()}</span>
                    <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center">
                      Inspect Chain &rarr;
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Visual Approval Chain */}
        <div className="lg:col-span-7">
          {selectedApproval ? (
            <div className="glass-card p-6 rounded-3xl space-y-6 relative overflow-hidden bg-white dark:bg-slate-900 shadow-xl border border-slate-200/80 dark:border-slate-800 h-[520px] flex flex-col justify-between">
              
              {/* Telemetry Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-150 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                      Workflow Pipeline Visualizer
                    </span>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">
                      {selectedApproval.targetName}
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-205">${selectedApproval.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Vertical Visual Timeline */}
              <div className="flex-1 flex flex-col justify-center px-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-8.5 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-800" />
                
                <div className="space-y-6 relative z-10">
                  {levelsOrder.map((lvl) => {
                    const step = selectedApproval.chainState[lvl];
                    const isCurrent = selectedApproval.currentLevel === lvl && selectedApproval.status !== 'APPROVED';
                    const isPassed = step.status === 'APPROVED';

                    return (
                      <div key={lvl} className="flex items-center space-x-4">
                        {getStepStatusIcon(step.status, isCurrent)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className={`text-xs font-extrabold tracking-wide ${
                              isCurrent ? 'text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-250'
                            }`}>
                              {lvl} {isCurrent && '(PENDING ACTION)'}
                            </h4>
                            {isPassed && <span className="text-[9px] text-slate-400">{step.date}</span>}
                          </div>
                          <p className="text-[10px] text-slate-450 mt-0.5">
                            {isPassed ? `Signed off by: ${step.user}` : isCurrent ? `Awaiting sign-off` : 'Hold stage'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions Area */}
              <div className="pt-4 border-t border-slate-150 dark:border-slate-800">
                {selectedApproval.status !== 'APPROVED' ? (
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span>Security credentials authenticated</span>
                    </div>
                    <button
                      onClick={() => handleApproveStage(selectedApproval.id, selectedApproval.currentLevel)}
                      disabled={updating}
                      className="px-5 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <UserCheck className="w-4 h-4 mr-0.5" />
                      <span>Sign Off Current Stage ({selectedApproval.currentLevel})</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50/20 border border-emerald-500/25 rounded-2xl text-center space-y-2 dark:bg-emerald-950/20">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto animate-bounce" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Approval Chain Fully Signed Off</h4>
                    <p className="text-[10px] text-slate-450">This transaction has been approved at all company levels and logged in audit files.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl h-[520px] flex flex-col justify-center items-center text-center space-y-3.5 p-8">
              <FileCheck className="w-12 h-12 text-slate-350" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Approvals Visualizer Inactive</h3>
                <p className="text-xs text-slate-450 mt-1 max-w-xs leading-relaxed">
                  Select a transaction card from the left directory to visually trace its operational approvals lifecycle status.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from 'react';
import Link from 'next/link';
import { Cpu } from 'lucide-react';

export default function MarketingFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center">
                <Cpu className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-bold dark:text-white">
                Procure<span className="text-brand-600 dark:text-brand-400 font-extrabold">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Automating vendor communication, RFQs, reverse auctions, approvals, and invoice operations with artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-brand-600 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-brand-600 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-brand-600 transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Nav Categories */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><Link href="/features" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">Pricing Tiers</Link></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">Integrations</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">Enterprise Security</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">API Docs</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">Supplier Guide</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">System Status</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">Procurement Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-450 transition-colors">SLA Agreement</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-455 transition-colors">GDPR & Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} ProcureAI Technologies, Inc. All rights reserved. Platform operates under ISO 27001 standard.
          </p>
        </div>
      </div>
    </footer>
  );
}

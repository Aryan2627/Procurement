"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, HelpCircle, ArrowRight } from 'lucide-react';
import MarketingHeader from '@/components/MarketingHeader';
import MarketingFooter from '@/components/MarketingFooter';

export default function PricingPage() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  const tiers = [
    {
      name: "Starter",
      description: "Ideal for growing teams starting to centralize vendor communication.",
      priceMonthly: 199,
      priceAnnual: 159,
      features: [
        "Up to 2 User Seats",
        "Active RFQ Creation (Max 5/mo)",
        "Standard Supplier Directory",
        "Email Notifications",
        "PDF Document Export",
        "Standard CSV/Excel Reports"
      ],
      cta: "Start Free Trial",
      href: "/register?plan=starter",
      popular: false
    },
    {
      name: "Growth",
      description: "Best for mid-market organizations optimizing vendor quotes and auctions.",
      priceMonthly: 499,
      priceAnnual: 399,
      features: [
        "Up to 10 User Seats",
        "Unlimited RFQs",
        "Live Reverse Auction Portal",
        "Custom approvals chain (Manager + Finance)",
        "Purchase Order Auto-generation",
        "Basic AI Sourcing Assistance",
        "Priority Support (Email + Slack)"
      ],
      cta: "Start Free Trial",
      href: "/register?plan=growth",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For global supply networks needing audit logs, SMS alerts, and full AI automation.",
      priceMonthly: 1299,
      priceAnnual: 999,
      features: [
        "Unlimited Seats & User Roles",
        "Full Reverse Auctions Lobby",
        "Advanced AI Sourcing Assistant",
        "Full Multi-Stage Approval Workflows",
        "SMS & Email Alert Integrations",
        "Security audit logs & activity records",
        "Dedicated Sourcing Account Manager",
        "Custom API Integrations"
      ],
      cta: "Talk to Sourcing Expert",
      href: "/book-demo?plan=enterprise",
      popular: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative grid-bg">
      <MarketingHeader />

      {/* Hero Header */}
      <section className="pt-32 pb-10 sm:pt-40 lg:pt-44 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            PLANS & PRICING
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3 mb-5">
            Transparent Sourcing Pricing
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Choose a plan that matches your monthly procurement scale. Save 20% by committing to an annual billing cycles.
          </p>

          {/* Toggle Button */}
          <div className="mt-10 flex items-center justify-center">
            <div className="relative bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-1 rounded-xl flex space-x-1">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-4.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  billingInterval === 'monthly'
                    ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-950 dark:text-brand-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-305'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingInterval('annual')}
                className={`px-4.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  billingInterval === 'annual'
                    ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-950 dark:text-brand-400'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-305'
                }`}
              >
                Annual Billing
                <span className="ml-1.5 inline-block text-[10px] px-1.5 py-0.5 rounded bg-brand-500 text-white font-bold tracking-wide uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Pricing Section */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mt-8">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                tier.popular 
                  ? 'glass-card border-2 border-brand-500 dark:border-brand-400 shadow-xl shadow-brand-500/5 ring-1 ring-brand-500' 
                  : 'glass-card border border-slate-250/50 dark:border-slate-850 shadow-sm'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 text-[11px] font-bold text-white bg-brand-600 rounded-full tracking-wider uppercase shadow-md shadow-brand-500/20">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{tier.name}</h3>
                  <p className="text-xs text-slate-550 dark:text-slate-400 mt-1 leading-relaxed">{tier.description}</p>
                </div>

                <div className="flex items-baseline text-slate-900 dark:text-white">
                  <span className="text-3xl font-extrabold">$</span>
                  <span className="text-5xl font-extrabold tracking-tight">
                    {billingInterval === 'monthly' ? tier.priceMonthly : tier.priceAnnual}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-1.5">/month</span>
                </div>

                {/* Features List */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-900 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Included Features:</span>
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-2.5">
                      <Check className="w-4.5 h-4.5 text-brand-600 dark:text-brand-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-650 dark:text-slate-300 font-medium leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-900">
                <Link
                  href={tier.href}
                  className={`block text-center py-3 px-4 font-semibold text-sm rounded-xl transition-all ${
                    tier.popular
                      ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/10'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-850'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compare Table Callout */}
      <section className="pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Need a custom integration or multi-entity setup?</h3>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          We offer bespoke SLA terms, private server sandboxes, and SSO integrations for high-volume purchasing houses.
        </p>
        <div>
          <Link href="/book-demo?plan=custom" className="inline-flex items-center space-x-1.5 text-brand-600 dark:text-brand-400 font-semibold hover:underline">
            <span>Contact Enterprise Sourcing Sales</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingDown, Clock, Trophy, Play, RefreshCw, AlertCircle,
  TrendingUp, Send, CheckCircle2, ChevronRight, User, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';

interface Bid {
  bidderName: string;
  amount: number;
  timestamp: string;
}

export default function AuctionsPage() {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<any | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  
  // Timer & Simulation States
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
  const [auctionActive, setAuctionActive] = useState(false);
  const [manualBidAmount, setManualBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  
  // Simulation interval references
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadAuctions();
    return () => {
      stopSimulation();
    };
  }, []);

  const loadAuctions = () => {
    // Standard mock list
    setAuctions([
      {
        id: 'auc-1',
        title: 'Reverse Sourcing: Enterprise Server Rack Cabinets',
        rfqId: 'rfq-2',
        budget: 24000,
        currentBid: 22800,
        minDecrement: 200,
        status: 'ACTIVE',
        endTime: new Date(Date.now() + 120000).toISOString()
      },
      {
        id: 'auc-2',
        title: 'Reverse Sourcing: Fiber Optic Splicers Q4',
        rfqId: 'rfq-4',
        budget: 18000,
        currentBid: 16500,
        minDecrement: 150,
        status: 'COMPLETED',
        winnerName: 'TechCorp Solutions Inc.',
        winningBid: 15200,
        endTime: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  };

  const startAuctionSimulation = (auction: any) => {
    setSelectedAuction(auction);
    setAuctionActive(true);
    setTimeLeft(120); // Reset timer to 2 minutes
    setBidError('');
    
    // Seed initial bids
    const initialBids = [
      { bidderName: 'TechCorp Solutions Inc.', amount: 24000, timestamp: new Date(Date.now() - 600000).toISOString() },
      { bidderName: 'Alpha Security Systems', amount: 23500, timestamp: new Date(Date.now() - 500000).toISOString() },
      { bidderName: 'TechCorp Solutions Inc.', amount: 23000, timestamp: new Date(Date.now() - 400000).toISOString() },
      { bidderName: 'Alpha Security Systems', amount: 22800, timestamp: new Date(Date.now() - 300000).toISOString() }
    ];
    setBids(initialBids);

    // 1. Start Countdown clock
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endAuction(auction);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 2. Start Simulated WebSocket Bidding (Socket.io Mockup)
    // Every 6-9 seconds, a random supplier drops the bid
    if (simulationRef.current) clearInterval(simulationRef.current);
    simulationRef.current = setInterval(() => {
      simulateSupplierBid(auction);
    }, 7000);
  };

  const stopSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (simulationRef.current) clearInterval(simulationRef.current);
  };

  const endAuction = (auction: any) => {
    stopSimulation();
    setAuctionActive(false);
    
    // Find winner
    setBids((currentBids) => {
      if (currentBids.length === 0) return currentBids;
      // Sort to find lowest bid
      const sorted = [...currentBids].sort((a, b) => a.amount - b.amount);
      const winner = sorted[0];

      // Update auctions list
      setAuctions((prev: any[]) => prev.map(a => 
        a.id === auction.id 
          ? { 
              ...a, 
              status: 'COMPLETED', 
              winnerName: winner.bidderName, 
              winningBid: winner.amount,
              currentBid: winner.amount
            } 
          : a
      ));

      // Update selected auction status
      setSelectedAuction((prev: any) => prev ? { 
        ...prev, 
        status: 'COMPLETED', 
        winnerName: winner.bidderName, 
        winningBid: winner.amount,
        currentBid: winner.amount
      } : null);

      return currentBids;
    });
  };

  const simulateSupplierBid = (auction: any) => {
    const suppliers = ['TechCorp Solutions Inc.', 'Alpha Security Systems', 'Global Office Suppliers Ltd.'];
    
    setBids((prev: any[]) => {
      if (prev.length === 0) return prev;
      
      const currentLow = prev[0].amount;
      const decrement = auction.minDecrement;
      
      // Calculate random drop
      const drop = decrement + Math.floor(Math.random() * 3) * 50;
      const newBidVal = currentLow - drop;
      
      if (newBidVal <= auction.budget * 0.6) {
        // Prevent dropping below 60% of budget for sanity
        return prev;
      }

      const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const newBid: Bid = {
        bidderName: randomSupplier,
        amount: newBidVal,
        timestamp: new Date().toISOString()
      };

      // Update current bid on selected auction
      setSelectedAuction((prevSel: any) => prevSel ? { ...prevSel, currentBid: newBidVal } : null);
      
      return [newBid, ...prev];
    });
  };

  const handlePlaceManualBid = (e: React.FormEvent) => {
    e.preventDefault();
    setBidError('');

    if (!manualBidAmount) return;
    const bidVal = parseFloat(manualBidAmount);

    if (isNaN(bidVal)) {
      setBidError('Please enter a valid price.');
      return;
    }

    const currentLow = bids.length > 0 ? bids[0].amount : selectedAuction.currentBid;
    const decrement = selectedAuction.minDecrement;

    if (bidVal >= currentLow) {
      setBidError(`Bid must be lower than the current lowest bid of $${currentLow.toLocaleString()}.`);
      return;
    }

    if (currentLow - bidVal < decrement) {
      setBidError(`Bid decrement must be at least $${decrement.toLocaleString()}.`);
      return;
    }

    // Place bid
    const newBid: Bid = {
      bidderName: `${user?.name || 'Buyer Rep'} (Test)`,
      amount: bidVal,
      timestamp: new Date().toISOString()
    };

    setBids((prev: any[]) => [newBid, ...prev]);
    setSelectedAuction((prevSel: any) => prevSel ? { ...prevSel, currentBid: bidVal } : null);
    setManualBidAmount('');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reverse Sourcing Auctions</h1>
        <p className="text-xs text-slate-500 mt-1">Host live competitive bidding sessions, monitor real-time rankings, and select cost-efficient suppliers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Auctions directory */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Available Sessions</h2>
          
          <div className="space-y-4">
            {auctions.map((auc) => (
              <div 
                key={auc.id}
                className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedAuction?.id === auc.id 
                    ? 'border-brand-500 bg-brand-50/5 dark:border-brand-400 dark:bg-brand-950/10 shadow-md' 
                    : 'border-slate-200/50 dark:border-slate-800'
                }`}
                onClick={() => {
                  stopSimulation();
                  if (auc.status === 'ACTIVE') {
                    startAuctionSimulation(auc);
                  } else {
                    setSelectedAuction(auc);
                    setAuctionActive(false);
                    // Seed standard completed bids
                    setBids([
                      { bidderName: 'TechCorp Solutions Inc.', amount: 15200, timestamp: new Date().toISOString() },
                      { bidderName: 'Alpha Security Systems', amount: 15400, timestamp: new Date().toISOString() },
                      { bidderName: 'Global Office Suppliers Ltd.', amount: 16100, timestamp: new Date().toISOString() }
                    ]);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-normal">{auc.title}</h3>
                    <span className="text-[9px] text-slate-400 font-mono block mt-0.5">Auction ID: {auc.id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                    auc.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/30 animate-pulse'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200/10'
                  }`}>
                    {auc.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-100 dark:border-slate-850 mt-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Budget Ceiling</span>
                    <span className="font-bold text-slate-800 dark:text-slate-250">${auc.budget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      {auc.status === 'ACTIVE' ? 'Current Low Bid' : 'Winning Bid'}
                    </span>
                    <span className="font-bold text-brand-650 dark:text-brand-400">
                      ${(auc.status === 'ACTIVE' ? auc.currentBid : auc.winningBid).toLocaleString()}
                    </span>
                  </div>
                </div>

                {auc.status === 'COMPLETED' && (
                  <div className="mt-3.5 p-2 bg-emerald-50/35 border border-emerald-100 text-[10px] rounded-lg text-emerald-700 flex items-center dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400">
                    <Trophy className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-amber-500" />
                    <span>Winner: <strong>{auc.winnerName}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live bidding telemetry */}
        <div className="lg:col-span-7">
          {selectedAuction ? (
            <div className="glass-card p-6 rounded-3xl space-y-6 relative overflow-hidden bg-white dark:bg-slate-900 shadow-xl border border-slate-200/80 dark:border-slate-800 h-[560px] flex flex-col justify-between">
              {/* Telemetry Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-150 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                      Live Telemetry Dashboard
                    </span>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">
                      {selectedAuction.title}
                    </h2>
                  </div>
                  {selectedAuction.status === 'ACTIVE' && (
                    <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 px-3 py-1 rounded-xl">
                      <Clock className="w-4.5 h-4.5 text-brand-600 dark:text-brand-400 animate-spin" />
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Main Telemetry Box */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-850 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">CURRENT LOW BID</span>
                    <span className="text-2xl font-extrabold text-brand-650 dark:text-brand-400">
                      ${selectedAuction.currentBid.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-850 text-center">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">MIN DECREMENT</span>
                    <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-205">
                      ${selectedAuction.minDecrement.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bids Log Feed */}
              <div className="flex-1 overflow-y-auto my-4 space-y-2.5 max-h-[220px]">
                <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider block">Bids History Stream (Real-Time)</h3>
                
                {bids.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No bids logged.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bids.map((b, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl border flex justify-between items-center text-xs ${
                          idx === 0 
                            ? 'bg-brand-50/20 border-brand-500/20 ring-1 ring-brand-500/10' 
                            : 'bg-slate-50/30 border-slate-100 dark:border-slate-850'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-brand-500 animate-ping' : 'bg-slate-300'}`} />
                          <span className="font-semibold text-slate-850 dark:text-slate-200">{b.bidderName}</span>
                          {idx === 0 && <span className="text-[9px] bg-brand-600 text-white font-bold px-1.5 py-0.5 rounded leading-none">Rank #1</span>}
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-850 dark:text-slate-100">${b.amount.toLocaleString()}</span>
                          <span className="block text-[8px] text-slate-400 font-mono mt-0.5">{new Date(b.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Bid Form or Completion Box */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                {selectedAuction.status === 'ACTIVE' && auctionActive ? (
                  <form onSubmit={handlePlaceManualBid} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                        <input
                          type="number"
                          placeholder="Place custom bid decrement..."
                          value={manualBidAmount}
                          onChange={(e) => setManualBidAmount(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 text-xs pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4.5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow"
                      >
                        <span>Place Bid</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {bidError && (
                      <p className="text-[10px] text-rose-500 font-semibold flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1" /> {bidError}
                      </p>
                    )}
                  </form>
                ) : selectedAuction.status === 'COMPLETED' ? (
                  <div className="p-4 bg-emerald-50/20 border border-emerald-500/25 rounded-2xl text-center space-y-2 dark:bg-emerald-950/20">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Auction Bidding Complete</h4>
                    <p className="text-[10px] text-slate-500">
                      Winner: <strong>{selectedAuction.winnerName}</strong> with a bid of <strong>${selectedAuction.winningBid?.toLocaleString()}</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <button
                      onClick={() => startAuctionSimulation(selectedAuction)}
                      className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 mx-auto cursor-pointer"
                    >
                      <Play className="w-4 h-4 mr-0.5 fill-white" />
                      <span>Launch Simulated Bidding</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl h-[560px] flex flex-col justify-center items-center text-center space-y-3.5 p-8">
              <TrendingDown className="w-12 h-12 text-slate-300" />
              <div>
                <h3 className="text-base font-bold text-slate-905 dark:text-white">Bidding Telemetry Inactive</h3>
                <p className="text-xs text-slate-450 mt-1 max-w-sm leading-relaxed">
                  Select an active session from the left directory menu to enter the WebSocket auction dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomerFooter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000); // resets after 5 seconds
    }
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto pb-24 md:pb-0 font-body-md text-body-md">
      {/* Upper Newsletter Bar */}
      <div className="border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-max-width mx-auto px-margin-desktop py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center lg:text-left">
            <h4 className="font-title-lg text-title-lg text-white font-extrabold tracking-tight flex items-center justify-center lg:justify-start gap-2">
              <span className="material-symbols-outlined text-action-orange animate-bounce">campaign</span>
              Stay Updated on Premium Naija Deals
            </h4>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Subscribe to get immediate alerts on seasonal price drops, featured Nigerian product launches, and exclusive verified merchant discount codes.
            </p>
          </div>
          
          <div className="w-full lg:w-auto min-w-[320px] md:min-w-[440px] relative">
            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubscribe} 
                  className="flex gap-2"
                >
                  <div className="relative flex-grow">
                    <span className="material-symbols-outlined text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px]">mail</span>
                    <input
                      type="email"
                      required
                      placeholder="Enter your professional email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-action-orange transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-action-orange hover:bg-orange-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shrink-0 shadow-lg shadow-orange-600/20"
                  >
                    Subscribe
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-300 text-sm"
                >
                  <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                  <div>
                    <p className="font-bold">Ẹ ku oriire! (Congratulations)</p>
                    <p className="text-xs text-emerald-400/80">You're now on our premium priority updates list.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-max-width mx-auto px-margin-desktop py-14 flex flex-col gap-10">
        
        {/* Top Info section: Brand Info, Escrow, and Socials side-by-side */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 flex-grow w-full">
            <span className="font-headline-md text-headline-md font-black text-action-orange tracking-tight block shrink-0">
              Naija Online Stores
            </span>
            <p className="text-slate-400 text-sm leading-relaxed md:border-l md:border-slate-800 md:pl-6">
              Nigeria's premier secure multi-vendor digital marketplace. We connect approved local fashion houses, visual arts, crafts, and high-quality sellers with buyers globally under a strictly managed safe escrow platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Escrow Badge */}
            <div className="inline-flex items-center gap-3.5 bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 shadow-inner max-w-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </div>
              <div className="text-left">
                <span className="block text-xs font-black text-white uppercase tracking-wider">Escrow Secure Checkouts</span>
                <span className="block text-[11px] text-slate-500">Platform-mediated local payments via Paystack</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-2.5">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-action-orange hover:text-white flex items-center justify-center text-slate-400 transition-all hover:-translate-y-1" aria-label="Instagram">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-action-orange hover:text-white flex items-center justify-center text-slate-400 transition-all hover:-translate-y-1" aria-label="Twitter / X">
                <span className="material-symbols-outlined text-[18px]">alternate_email</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-action-orange hover:text-white flex items-center justify-center text-slate-400 transition-all hover:-translate-y-1" aria-label="Facebook">
                <span className="material-symbols-outlined text-[18px]">group</span>
              </a>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Links Rows */}
        <div className="space-y-6">
          
          {/* Row 1: Shop Collections */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 py-1 text-sm">
            <span className="font-extrabold text-white text-xs uppercase tracking-widest border-l-2 border-action-orange pl-3 w-44 shrink-0">
              Shop Collections
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400">
              <Link to="/customer/categories" className="hover:text-action-orange transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">explore</span> Explore All Products
              </Link>
              <span className="text-slate-700 hidden md:inline">•</span>
              <Link to="/customer/categories" className="hover:text-action-orange transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">palette</span> Nigerian Crafts
              </Link>
              <span className="text-slate-700 hidden md:inline">•</span>
              <Link to="/customer/categories" className="hover:text-action-orange transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">checkroom</span> Vetted Local Fashion
              </Link>
              <span className="text-slate-700 hidden md:inline">•</span>
              <Link to="/customer/categories" className="hover:text-action-orange transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">devices</span> Trending Electronics
              </Link>
            </div>
          </div>

          {/* Row 2: For Merchants */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 py-1 text-sm border-t border-slate-800/40 pt-4">
            <span className="font-extrabold text-white text-xs uppercase tracking-widest border-l-2 border-action-orange pl-3 w-44 shrink-0">
              For Merchants
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400">
              <Link to="/vendor" className="hover:text-action-orange transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">storefront</span> Merchant Portal
              </Link>
              <span className="text-slate-700 hidden md:inline">•</span>
              <Link to="/vendor" className="hover:text-action-orange transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">add_business</span> Register as Seller
              </Link>
              <span className="text-slate-700 hidden md:inline">•</span>
              <span className="text-slate-500 text-xs italic">
                Secure bank payout matching via manual platform transfer verification.
              </span>
            </div>
          </div>

          {/* Row 3: Support & Safety */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 py-1 text-sm border-t border-slate-800/40 pt-4">
            <span className="font-extrabold text-white text-xs uppercase tracking-widest border-l-2 border-action-orange pl-3 w-44 shrink-0">
              Support & Safety
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400">
              <a href="#" className="hover:text-action-orange transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">gavel</span> Dispute Resolution
              </a>
              <span className="text-slate-700 hidden md:inline">•</span>
              <a href="#" className="hover:text-action-orange transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified_user</span> Terms of Service
              </a>
              <span className="text-slate-700 hidden md:inline">•</span>
              <a href="#" className="hover:text-action-orange transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">policy</span> Privacy Policy
              </a>
              <span className="text-slate-700 hidden md:inline">•</span>
              <a href="#" className="hover:text-action-orange transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_shipping</span> Shipping Guidelines
              </a>
            </div>
          </div>

          {/* Row 4: Contact Support */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 py-1 text-sm border-t border-slate-800/40 pt-4">
            <span className="font-extrabold text-white text-xs uppercase tracking-widest border-l-2 border-action-orange pl-3 w-44 shrink-0">
              Contact Support
            </span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-400 font-mono text-xs">
              <a href="tel:+23480000NAIJA" className="hover:text-action-orange flex items-center gap-1.5 transition-colors">
                <span className="material-symbols-outlined text-slate-500 text-[14px]">phone</span>
                +234 (0) 800-00-NAIJA
              </a>
              <span className="text-slate-700 hidden md:inline">|</span>
              <a href="mailto:support@naijaonlinestores.com" className="hover:text-action-orange flex items-center gap-1.5 transition-colors">
                <span className="material-symbols-outlined text-slate-500 text-[14px]">mail</span>
                support@naijaonlinestores.com
              </a>
              <span className="text-slate-700 hidden md:inline">|</span>
              <span className="text-slate-400 flex items-center gap-1.5 font-light font-sans">
                <span className="material-symbols-outlined text-slate-500 text-[14px]">schedule</span>
                Mon - Fri, 8:00 AM - 6:00 PM
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950/60">
        <div className="max-w-max-width mx-auto px-margin-desktop py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Naija Online Stores. All rights reserved. Secure escrow verified platform.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
              <span className="font-bold text-slate-400">Platform Status:</span> Live &amp; Insured
            </span>
            <span className="text-slate-800">|</span>
            <span className="font-light tracking-wide">Made with Care for Nigerian Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
}



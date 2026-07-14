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
          <div className="space-y-1 text-center lg:text-left">
            <h4 className="font-title-lg text-title-lg text-white font-bold tracking-tight">Stay Updated on Naija Deals</h4>
            <p className="text-slate-400 text-sm max-w-md">Subscribe to get real-time price drops, new local vendor launches, and exclusive discount codes.</p>
          </div>
          
          <div className="w-full lg:w-auto min-w-[320px] md:min-w-[420px] relative">
            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubscribe} 
                  className="flex gap-2"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-action-orange transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-action-orange hover:bg-orange-600 active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shrink-0"
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
      <div className="max-w-max-width mx-auto px-margin-desktop py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Column 1: Brand Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <span className="font-headline-md text-headline-md font-black text-action-orange tracking-tight block">
              Naija Online Stores
            </span>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Nigeria's premier secure multi-vendor digital marketplace. Connecting thousands of local approved makers, fashion houses, craft artisans, and sellers with secure client checkout.
            </p>
          </div>

          {/* Escrow Badge */}
          <div className="inline-flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
            <span className="material-symbols-outlined text-action-orange">verified_user</span>
            <div className="text-left">
              <span className="block text-xs font-bold text-white uppercase tracking-wider">Escrow Assured</span>
              <span className="block text-[11px] text-slate-500">100% Secure Payments via Paystack</span>
            </div>
          </div>
          
          {/* Social Icons */}
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-action-orange hover:text-white flex items-center justify-center text-slate-400 transition-all hover:scale-105" aria-label="Instagram">
              <span className="material-symbols-outlined text-sm">photo_camera</span>
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-action-orange hover:text-white flex items-center justify-center text-slate-400 transition-all hover:scale-105" aria-label="Twitter / X">
              <span className="material-symbols-outlined text-sm">alternate_email</span>
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-action-orange hover:text-white flex items-center justify-center text-slate-400 transition-all hover:scale-105" aria-label="Facebook">
              <span className="material-symbols-outlined text-sm">group</span>
            </a>
          </div>
        </div>

        {/* Column 2: Shop Links */}
        <div className="space-y-4">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">Shop Collections</h5>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/customer/categories" className="text-slate-400 hover:text-action-orange transition-colors duration-200">
                Explore All Products
              </Link>
            </li>
            <li>
              <Link to="/customer/categories" className="text-slate-400 hover:text-action-orange transition-colors duration-200">
                Nigerian Crafts
              </Link>
            </li>
            <li>
              <Link to="/customer/categories" className="text-slate-400 hover:text-action-orange transition-colors duration-200">
                Vetted Local Fashion
              </Link>
            </li>
            <li>
              <Link to="/customer/categories" className="text-slate-400 hover:text-action-orange transition-colors duration-200">
                Trending Electronics
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: For Vendors */}
        <div className="space-y-4">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">For Vendors</h5>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/vendor" className="text-slate-400 hover:text-action-orange transition-colors duration-200 flex items-center gap-1">
                Merchant Portal <span className="material-symbols-outlined text-[14px]">logout</span>
              </Link>
            </li>
            <li>
              <Link to="/vendor" className="text-slate-400 hover:text-action-orange transition-colors duration-200">
                Register as Seller
              </Link>
            </li>
            <li>
              <span className="text-slate-500 text-xs block italic leading-snug">
                Vetted onboarding with standard platform-backed bank transfer payouts.
              </span>
            </li>
          </ul>
        </div>

        {/* Column 4: Platform Security & Policy */}
        <div className="space-y-4">
          <h5 className="font-bold text-white text-sm uppercase tracking-wider">Support & Safety</h5>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#" className="text-slate-400 hover:text-action-orange transition-colors duration-200">
                Buyer Dispute Escrow
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-action-orange transition-colors duration-200">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-action-orange transition-colors duration-200">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-action-orange transition-colors duration-200">
                Standard Shipping Info
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950/60">
        <div className="max-w-max-width mx-auto px-margin-desktop py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Naija Online Stores. All rights reserved. Secure escrow verified platform.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Platform Status: Live
            </span>
            <span className="text-slate-600">|</span>
            <span>Made with Care for Nigerian Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


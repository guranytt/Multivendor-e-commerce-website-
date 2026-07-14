import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function CustomerFooter() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto pb-24 md:pb-0 font-body-md text-body-md">
      {/* Upper Escrow Trust Bar */}
      <div className="border-b border-slate-800 bg-slate-950/40">
        <div className="max-w-max-width mx-auto px-margin-desktop py-6">
          {/* Escrow Informative block */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-left text-xs bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-slate-300">
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="material-symbols-outlined text-emerald-400 text-[24px]">verified_user</span>
              <p className="font-bold text-white text-sm flex items-center gap-1.5">
                Secure Escrow Guarantee
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Active</span>
              </p>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs md:border-l md:border-slate-800 md:pl-4 flex-1">
              All customer payments are held in our secure escrow accounts and only disbursed to vendors <span className="text-action-orange font-semibold">after you confirm</span> complete satisfaction with your delivery, protecting both buyers and local businesses against fraud.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-max-width mx-auto px-margin-desktop py-14 flex flex-col gap-10">
        
        {/* Top Info section: Brand Info, Escrow, and Socials side-by-side */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 flex-grow w-full">
            <span className="font-headline-sm text-headline-sm font-black tracking-tight flex items-center gap-2.5 shrink-0">
              <img 
                src="https://res.cloudinary.com/dqpjjfsya/image/upload/v1780680415/IMG_20260605_180310_438_ztopwj.png" 
                alt="Naija Online Stores Logo" 
                className="h-7 w-7 object-contain rounded-md border-2 border-action-orange p-0.5"
                referrerPolicy="no-referrer"
              />
              <span>
                <span className="text-success-emerald">Naija</span>{' '}
                <span className="text-action-orange">Online Stores</span>
              </span>
            </span>
            <p className="text-slate-400 text-xs leading-relaxed md:border-l md:border-slate-800 md:pl-6 max-w-2xl">
              Nigeria's premier secure multi-vendor digital marketplace. We connect approved local fashion houses, visual arts, crafts, and high-quality sellers with buyers globally under a strictly managed safe escrow platform.
            </p>
          </div>

          <div className="flex flex-row items-center gap-4 shrink-0">
            {/* Escrow Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 shadow-inner">
              <div className="w-7 h-7 rounded-md bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <span className="material-symbols-outlined text-[15px]">shield</span>
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-black text-white uppercase tracking-wider leading-none">Escrow Secure</span>
                <span className="block text-[9px] text-slate-500 mt-0.5 leading-none">via Paystack</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-1.5">
              <a href="#" className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-action-orange hover:text-white flex items-center justify-center text-slate-400 transition-all hover:-translate-y-0.5" aria-label="Instagram">
                <span className="material-symbols-outlined text-[13px]">photo_camera</span>
              </a>
              <a href="#" className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-action-orange hover:text-white flex items-center justify-center text-slate-400 transition-all hover:-translate-y-0.5" aria-label="Twitter / X">
                <span className="material-symbols-outlined text-[13px]">alternate_email</span>
              </a>
              <a href="#" className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-action-orange hover:text-white flex items-center justify-center text-slate-400 transition-all hover:-translate-y-0.5" aria-label="Facebook">
                <span className="material-symbols-outlined text-[13px]">group</span>
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



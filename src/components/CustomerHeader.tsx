import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { SignOutButton } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomerHeader({ cartCount }: { cartCount: number }) {
  const { user, role } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/customer/categories?q=${encodeURIComponent(searchVal)}`);
    }
  };
  
  return (
    <header className="sticky top-0 w-full z-50 bg-action-orange dark:bg-orange-600 text-white font-headline-md text-headline-md shadow-[0px_20px_25px_rgba(10,10,10,0.08)] transition-all duration-200 h-20">
      <div className="flex items-center justify-between px-margin-desktop max-w-max-width mx-auto h-full">
        {/* Mobile Menu Icon */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden flex items-center justify-center p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Open Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
 
        {/* Brand Logo */}
        <Link to="/customer" className="font-display-lg text-display-lg font-black flex items-center gap-2 tracking-tight hover:scale-[1.02] transition-transform">
          <img 
            src="https://res.cloudinary.com/dqpjjfsya/image/upload/v1780680415/IMG_20260605_180310_438_ztopwj.png" 
            alt="Naija Online Stores Logo" 
            className="h-10 w-10 object-contain rounded-md border-2 border-white p-0.5 bg-white"
            referrerPolicy="no-referrer"
          />
          <span className="hidden xs:inline">
            <span className="text-white">Naija</span>{' '}
            <span className="text-white font-black">Online Stores</span>
          </span>
        </Link>
 
        {/* Search Bar (Desktop) */}
        <motion.div 
          animate={{ 
            maxWidth: isSearchFocused ? '850px' : '576px',
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="hidden md:flex flex-1 mx-8 relative group"
        >
          <input 
            type="text" 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearchSubmit}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search products, brands and categories..."
            className="w-full bg-white/10 text-white border border-white/30 hover:border-white/50 rounded-xl py-2.5 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white focus:text-slate-900 focus:border-white transition-all font-body-md text-body-md placeholder-orange-100 focus:placeholder-slate-500 shadow-sm"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-orange-100 group-focus-within:text-slate-600 transition-colors">search</span>
          {searchVal && (
            <button 
              onClick={() => setSearchVal('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-100 group-focus-within:text-slate-600 hover:text-white group-focus-within:hover:text-slate-800 p-1 rounded-full hover:bg-white/10 group-focus-within:hover:bg-slate-100 transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </motion.div>
 
        {/* Desktop Navigation */}
        <motion.nav 
          animate={{ 
            width: isSearchFocused ? 0 : 'auto', 
            opacity: isSearchFocused ? 0 : 1,
            marginLeft: isSearchFocused ? 0 : 24,
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className={`hidden md:flex items-center gap-6 overflow-hidden whitespace-nowrap ${
            isSearchFocused ? 'pointer-events-none' : ''
          }`}
        >
          <Link to="/customer" className="text-white font-extrabold font-label-md text-label-md hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200">Home</Link>
          <Link to="/customer/categories" className="text-white font-extrabold font-label-md text-label-md hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200">Categories</Link>
          <Link to="/customer/orders" className="text-white font-extrabold font-label-md text-label-md hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200">Orders</Link>
          
          {role === 'admin' && (
            <Link to="/admin" className="text-white font-bold font-label-md text-label-md hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 border border-white/30">
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              Admin Console
            </Link>
          )}

          <Link to="/customer/cart" className="relative text-white font-extrabold font-label-md text-label-md hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 group">
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-white text-orange-600 text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <SignOutButton>
              <button className="w-10 h-10 rounded-full bg-white/20 overflow-hidden border-2 border-white/50 hover:border-white transition-all flex items-center justify-center text-white">
                <span className="material-symbols-outlined">person</span>
              </button>
            </SignOutButton>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-white font-extrabold font-label-md text-label-md hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-200">
                Log In
              </Link>
              <Link to="/sign-up" className="bg-white text-orange-600 font-label-md text-label-md hover:bg-orange-50 px-4 py-2 rounded-lg transition-all duration-200 shadow-md font-bold">
                Sign Up
              </Link>
            </div>
          )}
        </motion.nav>
 
        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          <button className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
          {user ? (
            <SignOutButton>
              <button className="w-8 h-8 rounded-full bg-white/20 overflow-hidden border border-white/30 flex items-center justify-center text-white">
                <span className="material-symbols-outlined">person</span>
              </button>
            </SignOutButton>
          ) : (
            <Link to="/sign-up" className="bg-white text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-orange-50 transition-colors">
              Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* Slide-in Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />

            {/* Side Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-surface-white dark:bg-inverse-surface shadow-2xl z-50 md:hidden flex flex-col p-6 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-variant/50">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://res.cloudinary.com/dqpjjfsya/image/upload/v1780680415/IMG_20260605_180310_438_ztopwj.png" 
                    alt="Naija Online Stores Logo" 
                    className="h-8 w-8 object-contain rounded-md"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-display-md text-display-md font-black">
                    <span className="text-success-emerald">Naija</span>{' '}
                    <span className="text-action-orange">Stores</span>
                  </span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-variant/20 text-on-surface transition-colors"
                  aria-label="Close Menu"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Drawer User Info */}
              {user && (
                <div className="mb-6 p-4 rounded-xl bg-surface-container-low flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-action-orange/10 flex items-center justify-center text-action-orange">
                    <span className="material-symbols-outlined text-[24px]">account_circle</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md font-bold text-on-surface truncate">
                      {user.emailAddresses?.[0]?.emailAddress || 'User'}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant capitalize">
                      Role: {role || 'customer'}
                    </span>
                  </div>
                </div>
              )}

              {/* Drawer Links */}
              <nav className="flex flex-col gap-2 flex-grow">
                <Link 
                  to="/customer" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-variant/10 text-on-surface font-label-md text-label-md transition-colors"
                >
                  <span className="material-symbols-outlined text-on-surface-variant">home</span>
                  <span>Home</span>
                </Link>

                <Link 
                  to="/customer/categories" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-variant/10 text-on-surface font-label-md text-label-md transition-colors"
                >
                  <span className="material-symbols-outlined text-on-surface-variant">grid_view</span>
                  <span>Explore Categories</span>
                </Link>

                 <Link 
                  to="/customer/orders" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-variant/10 text-on-surface font-label-md text-label-md transition-colors"
                >
                  <span className="material-symbols-outlined text-on-surface-variant">receipt_long</span>
                  <span>My Orders</span>
                </Link>

                <Link 
                  to="/customer/cart" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-surface-variant/10 text-on-surface font-label-md text-label-md transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">shopping_cart</span>
                    <span>Shopping Cart</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="bg-action-orange text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {role === 'admin' && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-action-orange/5 hover:bg-action-orange/10 text-action-orange font-bold font-label-md text-label-md transition-colors mt-4 border border-action-orange/10"
                  >
                    <span className="material-symbols-outlined text-action-orange">admin_panel_settings</span>
                    <span>Admin Console</span>
                  </Link>
                )}
              </nav>

              {/* Drawer Footer / Logout */}
              <div className="pt-6 border-t border-surface-variant/50 flex flex-col gap-3">
                {user ? (
                  <SignOutButton>
                    <button className="w-full flex items-center justify-center gap-2 bg-surface-container-high hover:bg-error-red hover:text-white dark:hover:bg-error-red text-on-surface font-label-md text-label-md py-3 rounded-xl transition-all">
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Sign Out
                    </button>
                  </SignOutButton>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-surface-container-high text-on-surface font-label-md text-label-md py-3 rounded-xl transition-all"
                    >
                      Log In
                    </Link>
                    <Link 
                      to="/sign-up"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-action-orange text-white font-label-md text-label-md py-3 rounded-xl transition-all shadow-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Escrow Protection Info Modal */}
      <AnimatePresence>
        {isEscrowModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEscrowModalOpen(false)}
              className="fixed inset-0 bg-slate-950 z-[100] backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Body */}
            <div className="fixed inset-0 z-[101] overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsEscrowModalOpen(false)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center focus:outline-none"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>

                {/* Modal Title */}
                <div className="flex items-center gap-3.5 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[28px]">shield_lock</span>
                  </div>
                  <div>
                    <h3 className="font-display-md text-xl md:text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white uppercase">
                      Escrow Safety Program
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Nigeria's premier platform-mediated purchase guarantee.
                    </p>
                  </div>
                </div>

                {/* Process Steps */}
                <div className="space-y-6 my-6">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    Naija Online Stores operates under a strict, automated <strong className="text-action-orange font-bold">Escrow Payment System</strong> to eliminate commerce fraud. Your money is never sent directly to merchants until your order is safely delivered and verified.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Step 1 */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-action-orange text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Funds Secured</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Your checkout payment is processed via Paystack and held by our secure platform escrow trust.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-action-orange text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Merchant Dispatches</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          The verified merchant receives order alerts and ships your parcel using local registered couriers.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-action-orange text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Inspect & Confirm</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Upon courier arrival, you inspect the items. If completely satisfied, click "Confirm Delivery".
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-action-orange text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Safe Disbursement</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Once confirmed, the system immediately disburses the funds to the merchant's local bank account.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dispute Info */}
                  <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex gap-3">
                    <span className="material-symbols-outlined text-amber-500 text-[20px] shrink-0 mt-0.5">warning</span>
                    <div className="space-y-1">
                      <p className="font-bold uppercase tracking-wider">What if there is a dispute?</p>
                      <p className="leading-relaxed opacity-90">
                        If goods are damaged, missing, or do not match specifications, initiate a dispute instantly. Our dedicated administration panel will review the evidence and issue a full escrow refund if verified.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-5 mt-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
                    <span>Fully Verified Escrow Framework</span>
                  </div>
                  <button
                    onClick={() => setIsEscrowModalOpen(false)}
                    className="w-full sm:w-auto bg-action-orange hover:bg-orange-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md shadow-orange-600/10 cursor-pointer"
                  >
                    Understood, Thank You
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

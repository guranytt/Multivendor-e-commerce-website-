import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { SignOutButton } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CustomerHeader({ cartCount }: { cartCount: number }) {
  const { user, role } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 w-full z-50 bg-surface-white dark:bg-inverse-surface text-primary dark:text-primary-fixed-dim font-headline-md text-headline-md shadow-[0px_20px_25px_rgba(10,10,10,0.05)] shadow-sm dark:bg-surface-container-high transition-all duration-200 h-20">
      <div className="flex items-center justify-between px-margin-desktop max-w-max-width mx-auto h-full">
        {/* Mobile Menu Icon */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden flex items-center justify-center p-2 text-on-surface hover:bg-surface-variant/5 rounded-full transition-colors"
          aria-label="Open Menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
 
        {/* Brand Logo */}
        <Link to="/customer" className="font-display-lg text-display-lg font-black text-action-orange flex items-center gap-2 tracking-tight">
          Naija Online Stores
        </Link>
 
        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Search products, brands and categories..."
            className="w-full bg-surface-container-low text-on-surface border border-surface-variant rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-action-orange/50 focus:border-action-orange transition-all font-body-md text-body-md placeholder-on-surface-variant"
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
        </div>
 
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/customer" className="text-primary font-bold font-label-md text-label-md hover:bg-surface-variant/5 px-3 py-2 rounded-lg transition-all duration-200">Home</Link>
          <Link to="/customer/categories" className="text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant/5 px-3 py-2 rounded-lg transition-all duration-200">Categories</Link>
          <Link to="/customer/orders" className="text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant/5 px-3 py-2 rounded-lg transition-all duration-200">Orders</Link>
          
          {role === 'admin' && (
            <Link to="/admin" className="text-action-orange font-bold font-label-md text-label-md hover:bg-action-orange/5 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 border border-action-orange/20">
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              Admin Console
            </Link>
          )}

          <Link to="/customer/cart" className="relative p-2 text-on-surface-variant hover:bg-surface-variant/5 rounded-full transition-colors group">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-action-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </Link>
          <SignOutButton>
            <button className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border-2 border-transparent hover:border-action-orange transition-all flex items-center justify-center">
              <span className="material-symbols-outlined">person</span>
            </button>
          </SignOutButton>
        </nav>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-3">
          <button className="p-2 text-on-surface-variant hover:bg-surface-variant/5 rounded-full transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
          <SignOutButton>
            <button className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-transparent flex items-center justify-center">
              <span className="material-symbols-outlined">person</span>
            </button>
          </SignOutButton>
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
                <span className="font-display-md text-display-md font-black text-action-orange">
                  Naija Stores
                </span>
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
              <div className="pt-6 border-t border-surface-variant/50">
                <SignOutButton>
                  <button className="w-full flex items-center justify-center gap-2 bg-surface-container-high hover:bg-error-red hover:text-white dark:hover:bg-error-red text-on-surface font-label-md text-label-md py-3 rounded-xl transition-all">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

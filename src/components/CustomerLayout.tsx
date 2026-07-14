import { ReactNode, useEffect, useState } from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useAuth } from './AuthProvider';
import { Link, useLocation } from 'react-router-dom';

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const { getToken } = useClerkAuth();
  const { role, user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotionMessage, setPromotionMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    fetchCartCount();
  }, [location]);

  const fetchCartCount = async () => {
    const token = await getToken();
    try {
      const res = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const count = data.reduce((acc: number, group: any) => acc + group.items.length, 0);
        setCartCount(count);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMakeAdmin = async () => {
    if (!user) return;
    setIsPromoting(true);
    setPromotionMessage('Elevating your account to Admin...');
    try {
      const token = await getToken();
      const res = await fetch('/api/users/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setPromotionMessage('Success! Reloading to activate Admin mode...');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const data = await res.json();
        setPromotionMessage(data.error || 'Failed to promote to admin. Check server logs.');
        setIsPromoting(false);
      }
    } catch (err) {
      console.error(err);
      setPromotionMessage('Network error elevating account.');
      setIsPromoting(false);
    }
  };

  return (
    <div className="bg-background-slate min-h-screen text-on-surface font-body-md antialiased flex flex-col pb-16 md:pb-0">
      <CustomerHeader cartCount={cartCount} />
      
      {/* Dev Mode Admin Promotion Banner */}
      {user && role !== 'admin' && (
        <div className="w-full bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/30 py-3 px-4">
          <div className="max-w-max-width mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-amber-600">construction</span>
              <span><strong>Development Mode:</strong> Logged in as <span className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">{role || 'customer'}</span>. Elevate this user to test the master admin console.</span>
            </div>
            <button 
              onClick={handleMakeAdmin}
              disabled={isPromoting}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-1.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 text-xs flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
              {isPromoting ? 'Elevating...' : 'Make Me Admin'}
            </button>
          </div>
          {promotionMessage && (
            <div className="max-w-max-width mx-auto mt-2 text-xs font-medium text-amber-700 dark:text-amber-300 text-center sm:text-left">
              {promotionMessage}
            </div>
          )}
        </div>
      )}

      <main className="flex-grow w-full max-w-max-width mx-auto flex flex-col items-center justify-start overflow-x-hidden">
        {children}
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface-white dark:bg-inverse-surface text-primary dark:text-primary-fixed-dim font-label-sm text-label-sm border-t border-surface-variant dark:border-outline-variant shadow-[0_-4px_12px_rgba(0,0,0,0.03)] pb-safe">
        <Link to="/customer" className="flex flex-col items-center justify-center p-2 w-16 transition-colors hover:text-action-orange text-on-surface-variant">
          <span className="material-symbols-outlined mb-1">home</span>
          <span className="truncate w-full text-center">Home</span>
        </Link>
        <Link to="/customer/categories" className="flex flex-col items-center justify-center text-on-surface-variant p-2 w-16 hover:text-action-orange transition-colors">
          <span className="material-symbols-outlined mb-1">grid_view</span>
          <span className="truncate w-full text-center">Explore</span>
        </Link>
        
        {role === 'admin' && (
          <Link to="/admin" className="flex flex-col items-center justify-center text-action-orange p-2 w-16 hover:text-action-orange transition-colors font-semibold">
            <span className="material-symbols-outlined mb-1 text-action-orange">admin_panel_settings</span>
            <span className="truncate w-full text-center text-action-orange">Admin</span>
          </Link>
        )}

        <Link to="/customer/orders" className="flex flex-col items-center justify-center text-on-surface-variant p-2 w-16 hover:text-action-orange transition-colors">
          <span className="material-symbols-outlined mb-1">receipt_long</span>
          <span className="truncate w-full text-center">Orders</span>
        </Link>
        <Link to="/customer/cart" className="flex flex-col items-center justify-center text-on-surface-variant p-2 w-16 hover:text-action-orange transition-colors relative">
          <span className="material-symbols-outlined mb-1">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 bg-action-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
          <span className="truncate w-full text-center">Cart</span>
        </Link>
      </nav>

      <CustomerFooter />
    </div>
  );
}

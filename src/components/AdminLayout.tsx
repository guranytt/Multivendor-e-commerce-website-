import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background-slate min-h-screen text-on-surface font-body-md antialiased flex flex-col">
      <header className="sticky top-0 w-full z-50 bg-surface-white border-b border-surface-variant h-16 flex items-center justify-between px-margin-desktop">
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-2">
            <img 
              src="https://res.cloudinary.com/dqpjjfsya/image/upload/v1780680415/IMG_20260605_180310_438_ztopwj.png" 
              alt="Naija Online Stores Logo" 
              className="h-8 w-8 object-contain rounded-md"
              referrerPolicy="no-referrer"
            />
            <span className="font-title-lg text-title-lg font-black text-on-surface">
              <span className="text-action-orange">Naija Online Stores</span> Admin
            </span>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <SignOutButton>
            <button className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant hover:text-action-orange transition-colors">
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </header>
      
      <div className="flex-grow flex max-w-max-width mx-auto w-full px-margin-desktop py-lg gap-xl pb-24 lg:pb-0">
        <aside className="w-64 hidden lg:block sticky top-24 self-start bg-surface-white rounded-xl shadow-[0px_20px_25px_rgba(10,10,10,0.05)] p-md">
           <ul className="space-y-sm font-label-md text-label-md">
            <li>
              <a href="#payouts" className="w-full flex items-center gap-sm p-2 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">payments</span> Payouts
              </a>
            </li>
            <li>
              <a href="#categories" className="w-full flex items-center gap-sm p-2 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">category</span> Categories
              </a>
            </li>
            <li>
              <a href="#vendors" className="w-full flex items-center gap-sm p-2 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">storefront</span> Vendors
              </a>
            </li>
            <li className="pt-sm border-t border-surface-variant">
              <Link to="/customer" className="w-full flex items-center gap-sm p-2 rounded-lg text-action-orange hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-action-orange">shopping_bag</span> Storefront
              </Link>
            </li>
           </ul>
        </aside>
        <main className="flex-grow w-full space-y-xl">
          {children}
        </main>
      </div>

      {/* Mobile Admin Bottom Navbar */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-2 bg-surface-white dark:bg-inverse-surface text-primary dark:text-primary-fixed-dim font-label-sm text-label-sm border-t border-surface-variant dark:border-outline-variant shadow-[0_-4px_12px_rgba(0,0,0,0.03)] pb-safe">
        <a href="#payouts" className="flex flex-col items-center justify-center p-2 w-16 transition-colors hover:text-action-orange text-on-surface-variant">
          <span className="material-symbols-outlined mb-1">payments</span>
          <span className="truncate w-full text-center text-[11px]">Payouts</span>
        </a>
        <a href="#categories" className="flex flex-col items-center justify-center p-2 w-16 transition-colors hover:text-action-orange text-on-surface-variant">
          <span className="material-symbols-outlined mb-1">category</span>
          <span className="truncate w-full text-center text-[11px]">Categories</span>
        </a>
        <a href="#vendors" className="flex flex-col items-center justify-center p-2 w-16 transition-colors hover:text-action-orange text-on-surface-variant">
          <span className="material-symbols-outlined mb-1">storefront</span>
          <span className="truncate w-full text-center text-[11px]">Vendors</span>
        </a>
        <Link to="/customer" className="flex flex-col items-center justify-center p-2 w-16 transition-colors text-action-orange font-semibold">
          <span className="material-symbols-outlined mb-1">shopping_bag</span>
          <span className="truncate w-full text-center text-[11px]">Storefront</span>
        </Link>
      </nav>
    </div>
  );
}

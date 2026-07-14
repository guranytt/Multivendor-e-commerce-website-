import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SignOutButton } from '@clerk/clerk-react';

export default function VendorLayout({ children }: { children: ReactNode }) {
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
              <span className="text-action-orange">Naija Online Stores</span> Vendor
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
      
      <div className="flex-grow flex max-w-max-width mx-auto w-full px-margin-desktop py-lg gap-xl">
        <aside className="w-64 hidden lg:block sticky top-24 self-start bg-surface-white rounded-xl shadow-[0px_20px_25px_rgba(10,10,10,0.05)] p-md">
           <ul className="space-y-sm font-label-md text-label-md">
            <li>
              <a href="#orders" className="w-full flex items-center gap-sm p-2 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">receipt_long</span> Orders
              </a>
            </li>
            <li>
              <a href="#products" className="w-full flex items-center gap-sm p-2 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined">inventory_2</span> Products
              </a>
            </li>
           </ul>
        </aside>
        <main className="flex-grow w-full space-y-xl">
          {children}
        </main>
      </div>
    </div>
  );
}

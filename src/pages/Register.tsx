import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { clerkAppearance } from '../lib/clerkTheme';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-slate p-4 flex-col gap-8">
      <Link to="/" className="font-display-lg text-display-lg font-black text-action-orange flex items-center gap-2.5 hover:scale-[1.02] transition-transform">
        <img 
          src="https://res.cloudinary.com/dqpjjfsya/image/upload/v1780680415/IMG_20260605_180310_438_ztopwj.png" 
          alt="Naija Online Stores Logo" 
          className="h-12 w-12 object-contain rounded-lg"
          referrerPolicy="no-referrer"
        />
        <span>Naija Online Stores</span>
      </Link>
      <SignUp routing="path" path="/sign-up" signInUrl="/login" fallbackRedirectUrl="/" appearance={clerkAppearance} />
    </div>
  );
}

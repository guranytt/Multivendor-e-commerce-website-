import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { clerkAppearance } from '../lib/clerkTheme';
import { Link } from 'react-router-dom';

export default function Login() {
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
      <SignIn routing="path" path="/login" signUpUrl="/sign-up" fallbackRedirectUrl="/" appearance={clerkAppearance} />
    </div>
  );
}

import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { clerkAppearance } from '../lib/clerkTheme';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-slate p-4 flex-col gap-8">
      <Link to="/" className="font-display-lg text-display-lg font-black text-action-orange">
        Naija Online Stores
      </Link>
      <SignUp routing="path" path="/sign-up" signInUrl="/login" fallbackRedirectUrl="/" appearance={clerkAppearance} />
    </div>
  );
}

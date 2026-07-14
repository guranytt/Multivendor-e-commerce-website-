import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { clerkAppearance } from '../lib/clerkTheme';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-slate p-4 flex-col gap-8">
      <Link to="/" className="font-display-lg text-display-lg font-black text-action-orange">
        Naija Online Stores
      </Link>
      <SignIn routing="path" path="/login" signUpUrl="/sign-up" fallbackRedirectUrl="/" appearance={clerkAppearance} />
    </div>
  );
}

import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <SignIn routing="path" path="/login" signUpUrl="/sign-up" fallbackRedirectUrl="/" />
    </div>
  );
}

import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <SignUp routing="path" path="/sign-up" signInUrl="/login" fallbackRedirectUrl="/" />
    </div>
  );
}

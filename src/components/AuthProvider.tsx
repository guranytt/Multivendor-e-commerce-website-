import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

export type UserRole = 'admin' | 'vendor' | 'customer' | null;

interface AuthContextType {
  session: any; // Simplified for MVP
  user: any;
  role: UserRole;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useClerkAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        // We will fetch role from our backend users table to keep it synced
        // Or we can use user.publicMetadata.role
        // For MVP, if publicMetadata.role exists, use it, else we can default to 'customer'
        // Let's assume the backend sets publicMetadata.role or we get it via an API call.
        const userRole = (user.publicMetadata?.role as UserRole) || 'customer';
        setRole(userRole);
        
        // Sync user to backend
        getToken().then(token => {
          fetch((import.meta.env.VITE_API_URL || '') + '/api/users/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              role: userRole
            })
          }).catch(console.error);
        });
      } else {
        setRole(null);
      }
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user, getToken]);

  return (
    <AuthContext.Provider value={{ session: true, user, role, loading: !isLoaded || loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

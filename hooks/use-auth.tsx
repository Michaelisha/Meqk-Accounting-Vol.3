'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

const AuthContext = createContext<any>(null);

export const ROLE_MAP: Record<string, string[]> = {
  Admin: ['management', 'finance', 'operations', 'hr', 'fleet'],
  Manager: ['management'],
  Accountant: ['finance'],
  'Operation Officer': ['operations'],
  'HR Officer': ['hr'],
  'Fleet Officer': ['fleet'],
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser) {
          try {
            const { data: userData, error } = await supabase
              .from('users')
              .select('name, roles(role)')
              .eq('uuid', currentUser.id)
              .single();
            
            if (userData) {
              const data = userData as any;
              setUserData(data);
              // roles(role) select returns an array or object depending on relationship
              const role = Array.isArray(data.roles) 
                ? data.roles[0]?.role 
                : data.roles?.role;
              setUserRole(role || null);
            }
          } catch (err) {
            console.error('Error fetching user data:', err);
          }
        } else {
          setUserData(null);
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

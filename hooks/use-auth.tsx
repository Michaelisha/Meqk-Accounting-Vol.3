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

  useEffect(() => {
    let mounted = true;

    async function fetchUserData(currentUser: User | null) {
      if (!currentUser) {
        if (mounted) {
          setUserData(null);
          setUserRole(null);
        }
        return;
      }

      try {
        const { data: userData, error } = await supabase
          .from('users')
          .select('name, roles(role)')
          .eq('uuid', currentUser.id)
          .single();
        
        if (mounted && userData) {
          const data = userData as any;
          setUserData(data);
          const role = Array.isArray(data.roles) 
            ? data.roles[0]?.role 
            : data.roles?.role;
          setUserRole(role || null);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    }

    // GET SESSION ONCE
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        const currentUser = data.session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          fetchUserData(currentUser).finally(() => {
            if (mounted) setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }
    });

    // SINGLE LISTENER
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          fetchUserData(currentUser);
        }
      }
    );

    return () => {
      mounted = false;
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

'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

const AuthContext = createContext<any>(null);

export const ROLE_ACCESS: Record<string, string[]> = {
  Admin: ['Management', 'Finance', 'Operations', 'HR', 'Fleet'],
  Manager: ['Management'],
  Accountant: ['Finance'],
  'Operation Officer': ['Operations'],
  'HR Officer': ['HR'],
  'Fleet Officer': ['Fleet'],
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const fetchUserData = async (userId: string) => {
      const { data } = await supabase
        .from('users')
        .select('name, roles(role)')
        .eq('uuid', userId)
        .single();
      
      if (data) {
        setUserData(data);
        setUserRole((data.roles as any)?.role || null);
      }
    };

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user || null;
      setUser(sessionUser);
      if (sessionUser) {
        await fetchUserData(sessionUser.id);
      }
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user || null;
        setUser(sessionUser);
        if (sessionUser) {
          await fetchUserData(sessionUser.id);
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

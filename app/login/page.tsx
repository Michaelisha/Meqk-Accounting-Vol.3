'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setError(error.message);
      setLocalLoading(false);
      return;
    }

    if (data.session) {
      router.push('/departments');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl border border-yellow-500/20 p-8 rounded-[2.5rem] shadow-2xl shadow-yellow-500/5">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 mb-2">
              MEQK
            </h1>
            <p className="text-yellow-500/60 text-sm tracking-[0.2em] uppercase font-bold">
              Accounting Vol.3
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-yellow-500/80 text-xs font-bold uppercase ml-4">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500/40 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/50 border border-yellow-500/10 rounded-2xl py-4 pl-12 pr-4 text-yellow-100 placeholder:text-yellow-500/20 focus:outline-none focus:border-yellow-500/50 transition-all"
                  placeholder="name@meqk.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-yellow-500/80 text-xs font-bold uppercase ml-4">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-500/40 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-yellow-500/10 rounded-2xl py-4 pl-12 pr-4 text-yellow-100 placeholder:text-yellow-500/20 focus:outline-none focus:border-yellow-500/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center font-bold bg-red-400/10 py-2 rounded-xl border border-red-400/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={localLoading}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 hover:from-yellow-500 hover:to-yellow-300 text-slate-950 font-black py-4 rounded-2xl shadow-lg shadow-yellow-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {localLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'LOGIN TO ERP'}
            </button>
          </form>
        </div>
      </motion.div>

      <div className="mt-12 text-yellow-500/40 text-sm font-medium tracking-widest">
        &quot;Thanks GOD&quot;
      </div>
    </div>
  );
}

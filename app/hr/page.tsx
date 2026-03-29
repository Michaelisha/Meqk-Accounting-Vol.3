'use client';

import DepartmentLayout from '@/components/department-layout';
import { HR_NAVIGATION } from '@/constants/navigation';
import { 
  Users, 
  Calendar, 
  TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth, ROLE_MAP } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function HRDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (!loading && userRole && !ROLE_MAP[userRole]?.includes('hr')) {
      router.push('/departments');
    }
  }, [user, userRole, loading, router]);

  const [stats, setStats] = useState({
    totalStaff: 0,
    totalWages: 0,
    shortageStaff: [] as any[],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [staff, wages, shortage] = await Promise.all([
        supabase.from('staff_list').select('*', { count: 'exact', head: true }),
        supabase.from('trial_balance_summary').select('balance').eq('account', 'Wages'),
        supabase.from('top_3_staff_shortage').select('*')
      ]);

      const totalWages = (wages.data || []).reduce((acc, curr) => acc + (curr.balance || 0), 0);

      setStats({
        totalStaff: staff.count || 0,
        totalWages: totalWages,
        shortageStaff: shortage.data || [],
      });
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">
        Loading...
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <DepartmentLayout theme="hr" title="HR Dashboard" navigation={HR_NAVIGATION}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Staff" value={stats.totalStaff} icon={Users} color="text-orange-600" bg="bg-orange-50" />
        <StatCard title="Total Wages" value={`TZS ${stats.totalWages.toLocaleString()}`} icon={TrendingUp} color="text-green-600" bg="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/70 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <Users className="w-6 h-6 text-red-500" /> Most Shortage Staff
          </h3>
          <div className="space-y-4">
            {stats.shortageStaff.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-bold text-slate-900">{s.staff}</div>
                <div className="font-black text-red-600 italic">TZS {Number(s.shortage || 0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white/70 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 italic">{value}</h4>
    </div>
  );
}

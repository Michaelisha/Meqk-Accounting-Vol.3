'use client';

import DepartmentLayout from '@/components/department-layout';
import { MANAGEMENT_NAVIGATION } from '@/constants/navigation';
import { 
  Bus,
  TrendingUp,
  TrendingDown,
  Users,
  FileText
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth, ROLE_MAP } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export default function ManagementDashboard() {
  const { user, userRole, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
    if (!authLoading && userRole && !ROLE_MAP[userRole]?.includes('management')) {
      router.push('/departments');
    }
  }, [user, userRole, authLoading, router]);

  const [stats, setStats] = useState({
    totalBusesToday: 0,
    pendingAmount: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalStaff: 0,
    totalBuses: 0,
    numberOfSpares: 0,
  });
  const [topShortages, setTopShortages] = useState<any[]>([]);
  const [topPerformingBuses, setTopPerformingBuses] = useState<any[]>([]);
  const [mostDieselUser, setMostDieselUser] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setDataLoading(true);
      
      const [
        { data: metrics },
        { count: staffCount },
        { count: busCount },
        { count: spareCount },
        { data: shortages },
        { data: busIncome },
        { data: dieselUsage }
      ] = await Promise.all([
        supabase.from('management_dashboard_metrics').select('*').single(),
        supabase.from('staff_list').select('*', { count: 'exact', head: true }),
        supabase.from('bus_list').select('*', { count: 'exact', head: true }),
        supabase.from('spare_list').select('*', { count: 'exact', head: true }),
        supabase.from('top_3_staff_shortage').select('*'),
        supabase.from('top_3_bus_income').select('*'),
        supabase.from('top_3_diesel_usage').select('*')
      ]);

      setStats({
        totalBusesToday: metrics?.total_buses_today || 0,
        pendingAmount: metrics?.total_pending_amount || 0,
        totalIncome: metrics?.total_income || 0,
        totalExpenses: metrics?.total_expenses || 0,
        totalStaff: staffCount || 0,
        totalBuses: busCount || 0,
        numberOfSpares: spareCount || 0,
      });

      setTopShortages(shortages || []);
      setTopPerformingBuses(busIncome || []);
      setMostDieselUser(dieselUsage || []);
      setDataLoading(false);
    };

    fetchStats();
  }, []);

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">
        Loading...
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <DepartmentLayout 
      theme="management" 
      title="Management Dashboard" 
      navigation={MANAGEMENT_NAVIGATION}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Buses Travel Today" 
          value={stats.totalBusesToday} 
          icon={Bus} 
          color="text-yellow-600"
          bg="bg-yellow-50"
        />
        <StatCard 
          title="Total Pending" 
          value={`TZS ${stats.pendingAmount.toLocaleString()}`} 
          icon={FileText} 
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard 
          title="Total Income" 
          value={`TZS ${stats.totalIncome.toLocaleString()}`} 
          icon={TrendingUp} 
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard 
          title="Total Expenses" 
          value={`TZS ${stats.totalExpenses.toLocaleString()}`} 
          icon={TrendingDown} 
          color="text-red-600"
          bg="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/70 p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Total Staff</p>
            <h4 className="text-xl font-black text-slate-900">{stats.totalStaff}</h4>
          </div>
        </div>
        <div className="bg-white/70 p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Total Buses</p>
            <h4 className="text-xl font-black text-slate-900">{stats.totalBuses}</h4>
          </div>
        </div>
        <div className="bg-white/70 p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-600 text-xs font-black uppercase tracking-widest">Number of Spares</p>
            <h4 className="text-xl font-black text-slate-900">{stats.numberOfSpares}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Shortages */}
        <div className="bg-white/70 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            Top Shortages
          </h3>
          <div className="space-y-4">
            {topShortages.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-900">{item.staff}</p>
                <p className="text-red-600 font-black italic">TZS {item.shortage.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Buses */}
        <div className="bg-white/70 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Top Performing Buses
          </h3>
          <div className="space-y-4">
            {topPerformingBuses.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-900">{item.bus}</p>
                <p className="text-green-600 font-black italic">TZS {item.total_income.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Most Diesel User */}
        <div className="bg-white/70 p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <Bus className="w-5 h-5 text-blue-500" />
            Most Diesel User
          </h3>
          <div className="space-y-4">
            {mostDieselUser.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-900">{item.bus}</p>
                <p className="text-blue-600 font-black italic">{item.total_diesel_used.toLocaleString()} L</p>
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
    <div className="bg-white/70 p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${bg} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-slate-600 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
    </div>
  );
}

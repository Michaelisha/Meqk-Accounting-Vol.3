'use client';

import DepartmentLayout from '@/components/department-layout';
import { OPERATIONS_NAVIGATION } from '@/constants/navigation';
import { 
  Bus,
  Map,
  TrendingUp,
  Clock,
  Building2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth, ROLE_MAP } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function OperationsDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (!loading && userRole && !ROLE_MAP[userRole]?.includes('operations')) {
      router.push('/departments');
    }
  }, [user, userRole, loading, router]);

  const [stats, setStats] = useState({
    busesToday: 0,
    activeRoutes: 0,
    totalOffices: 0,
    topBuses: [] as any[],
    rentExpiry: [] as any[],
    busUtilization: [] as any[],
  });

  useEffect(() => {
    const fetchStats = async () => {
      // A. BUSES TRAVEL TODAY
      const { data: metrics } = await supabase
        .from('management_dashboard_metrics')
        .select('total_buses_today')
        .single();

      // B. ACTIVE ROUTES
      const { count: routesCount } = await supabase
        .from('routes')
        .select('*', { count: 'exact', head: true });

      // C. TOP 3 BUSES (PASSENGERS)
      const { data: topBuses } = await supabase
        .from('top_3_buses')
        .select('*');

      // D. NEAREST OFFICE RENT EXPIRY
      const { data: rentExpiry } = await supabase
        .from('office_rent_view')
        .select('*')
        .order('remaining_days', { ascending: true })
        .limit(5);

      // E. TOTAL OFFICES
      const { count: officesCount } = await supabase
        .from('office_list')
        .select('*', { count: 'exact', head: true });

      // F. TOP 3 BUS UTILIZATION
      const { data: busUtilization } = await supabase
        .from('top_3_bus_utilization')
        .select('*');

      setStats({
        busesToday: Number(metrics?.total_buses_today || 0),
        activeRoutes: routesCount || 0,
        totalOffices: officesCount || 0,
        topBuses: topBuses || [],
        rentExpiry: rentExpiry || [],
        busUtilization: busUtilization || [],
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
    <DepartmentLayout theme="operations" title="Operations Dashboard" navigation={OPERATIONS_NAVIGATION}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Buses Travel Today" value={stats.busesToday} icon={Bus} color="text-green-600" bg="bg-green-50" />
        <StatCard title="Active Routes" value={stats.activeRoutes} icon={Map} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Total Offices" value={stats.totalOffices} icon={Building2} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="Nearest Rent Expiry" value={stats.rentExpiry[0]?.remaining_days ? `${stats.rentExpiry[0].remaining_days} Days` : '-'} icon={Clock} color="text-orange-600" bg="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <Bus className="w-6 h-6 text-green-500" /> Top 3 Buses (Passengers)
          </h3>
          <div className="space-y-4">
            {stats.topBuses.length > 0 ? stats.topBuses.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-bold text-slate-900">{b.bus}</div>
                <div className="font-black text-green-600 italic">{b.passengers} Passengers</div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-400 italic">No bus data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" /> Top 3 Bus Utilization
          </h3>
          <div className="space-y-4">
            {stats.busUtilization.length > 0 ? stats.busUtilization.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-bold text-slate-900">{b.bus}</div>
                <div className="font-black text-emerald-600 italic">{b.utilization_percent}%</div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-400 italic">No utilization data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-xl font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-500" /> Nearest Office Rent Expiry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.rentExpiry.length > 0 ? stats.rentExpiry.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-bold text-slate-900">{r.office}</div>
                <div className={`font-black italic ${Number(r.remaining_days) < 30 ? 'text-red-600' : 'text-orange-600'}`}>
                  {r.remaining_days} Days Left
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-400 italic col-span-full">No rent schedules found</div>
            )}
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 italic">{value}</h4>
    </div>
  );
}

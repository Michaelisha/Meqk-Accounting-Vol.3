'use client';

import DepartmentLayout from '@/components/department-layout';
import { FLEET_NAVIGATION } from '@/constants/navigation';
import { 
  Bus, 
  ShieldCheck, 
  TrendingUp,
  Clock,
  Wrench
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function FleetDashboard() {
  const { company } = useAuth();
  const [stats, setStats] = useState({
    totalBuses: 0,
    numSpares: 0,
    mostDiesel: null as any,
    nearestLicence: null as any,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [buses, spares, diesel, licence] = await Promise.all([
        supabase.from('bus_list').select('*', { count: 'exact', head: true }),
        supabase.from('spare_list').select('*', { count: 'exact', head: true }),
        supabase.from('top_3_diesel_usage').select('*').order('total_diesel_used', { ascending: false }).limit(1),
        supabase.from('licence_view').select('*').order('remaining_days', { ascending: true }).limit(1)
      ]);

      setStats({
        totalBuses: buses.count || 0,
        numSpares: spares.count || 0,
        mostDiesel: diesel.data?.[0] || null,
        nearestLicence: licence.data?.[0] || null,
      });
    };
    fetchStats();
  }, []);

  return (
    <DepartmentLayout theme="fleet" title="Fleet Dashboard" navigation={FLEET_NAVIGATION}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Buses" value={stats.totalBuses} icon={Bus} color="text-purple-600" bg="bg-purple-50" />
        <StatCard title="Number of Spares" value={stats.numSpares} icon={Wrench} color="text-orange-600" bg="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-500" /> Most Diesel User
          </h3>
          {stats.mostDiesel ? (
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Bus</span>
                <span className="text-sm font-bold text-slate-900">{stats.mostDiesel.bus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Diesel Used</span>
                <span className="text-lg font-black text-blue-600 italic">{stats.mostDiesel.total_diesel_used} L</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 italic text-center py-8">No data available</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-500" /> Nearest Licence Expiry
          </h3>
          {stats.nearestLicence ? (
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Bus</span>
                <span className="text-sm font-bold text-slate-900">{stats.nearestLicence.bus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Remaining Days</span>
                <span className="text-lg font-black text-purple-600 italic">{stats.nearestLicence.remaining_days} Days</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 italic text-center py-8">No data available</p>
          )}
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

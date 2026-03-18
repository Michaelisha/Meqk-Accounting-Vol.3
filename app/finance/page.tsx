'use client';

import DepartmentLayout from '@/components/department-layout';
import { FINANCE_NAVIGATION } from '@/constants/navigation';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  FileText
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FinanceDashboard() {
  const [stats, setStats] = useState({
    pendingAmount: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalShortages: 0,
  });
  const [topStaff, setTopStaff] = useState<any[]>([]);
  const [shortageStaff, setShortageStaff] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Management Metrics (Pending, Income & Expenses)
        const { data: metricsData } = await supabase
          .from('management_dashboard_metrics')
          .select('total_pending_amount, total_income, total_expenses')
          .single();

        // 2. Total Shortages (Sum from staff_dashboard)
        const { data: sdb } = await supabase
          .from('staff_dashboard')
          .select('pending_balance');

        // 3. Top 3 Shortages
        const { data: topShortages } = await supabase
          .from('top_3_staff_shortage')
          .select('*');

        // 4. Top 3 Bus Income
        const { data: topBuses } = await supabase
          .from('top_3_bus_income')
          .select('*');

        console.log("metrics", metricsData);
        console.log("shortages", topShortages);

        setStats({
          pendingAmount: Number(metricsData?.total_pending_amount || 0),
          totalIncome: Number(metricsData?.total_income || 0),
          totalExpenses: Number(metricsData?.total_expenses || 0),
          totalShortages: sdb?.reduce((sum, row) => sum + Number(row.pending_balance || 0), 0) || 0,
        });

        // Top Shortages
        setShortageStaff(topShortages || []);

        // Top Performing Buses
        setTopStaff(topBuses || []);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <DepartmentLayout theme="finance" title="Finance Dashboard" navigation={FINANCE_NAVIGATION}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Pending" value={`TZS ${stats.pendingAmount.toLocaleString()}`} icon={FileText} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Total Income" value={`TZS ${stats.totalIncome.toLocaleString()}`} icon={TrendingUp} color="text-green-600" bg="bg-green-50" />
        <StatCard title="Total Expenses" value={`TZS ${stats.totalExpenses.toLocaleString()}`} icon={TrendingDown} color="text-red-600" bg="bg-red-50" />
        <StatCard title="Total Shortages" value={`TZS ${stats.totalShortages.toLocaleString()}`} icon={TrendingDown} color="text-orange-600" bg="bg-orange-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <Users className="w-6 h-6 text-red-500" /> Top Shortages
          </h3>
          <div className="space-y-4">
            {shortageStaff.length > 0 ? shortageStaff.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-bold text-slate-900">{s.staff}</div>
                <div className="font-black text-red-600 italic">TZS {Number(s.shortage || 0).toLocaleString()}</div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-400 italic">No shortages recorded</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 italic flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" /> Top Performing Buses
          </h3>
          <div className="space-y-4">
            {topStaff.length > 0 ? topStaff.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="font-bold text-slate-900">{s.bus}</div>
                <div className="font-black text-green-600 italic">TZS {Number(s.total_income || 0).toLocaleString()}</div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-400 italic">No performance data available</div>
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

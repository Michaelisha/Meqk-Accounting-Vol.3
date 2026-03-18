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
import { useAuth } from '@/hooks/use-auth';
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
  const { company } = useAuth();
  const [stats, setStats] = useState({
    totalBuses: 0,
    pendingAmount: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [topBuses, setTopBuses] = useState<any[]>([]);
  const [topStaffShortage, setTopStaffShortage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) return;

    const fetchStats = async () => {
      setLoading(true);
      
      // Total buses today
      const { data: dailyBuses } = await supabase
        .from('daily_buses_view')
        .select('*')
        .eq('company', company.uuid);
      
      // Total pending amount
      const { data: invoiceReport } = await supabase
        .from('invoice_report')
        .select('amount')
        .eq('company', company.uuid)
        .eq('status', 'pending');

      // Income & Expenses
      const { data: incomeStatement } = await supabase
        .from('income_statement')
        .select('*')
        .eq('company', company.uuid);

      // Top Staff Shortage
      const { data: staffShortage } = await supabase
        .from('staff_statement')
        .select('*')
        .eq('company', company.uuid)
        .order('shortage', { ascending: false })
        .limit(3);

      setStats({
        totalBuses: dailyBuses?.length || 0,
        pendingAmount: invoiceReport?.reduce((acc, curr) => acc + curr.amount, 0) || 0,
        totalIncome: incomeStatement?.filter(i => i.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) || 0,
        totalExpenses: incomeStatement?.filter(i => i.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0) || 0,
      });

      setTopBuses(dailyBuses?.sort((a, b) => b.passengers - a.passengers).slice(0, 3) || []);
      setTopStaffShortage(staffShortage || []);
      setLoading(false);
    };

    fetchStats();
  }, [company]);

  return (
    <DepartmentLayout 
      theme="management" 
      title="Management Dashboard" 
      navigation={MANAGEMENT_NAVIGATION}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Buses Today" 
          value={stats.totalBuses} 
          icon={Bus} 
          color="text-yellow-600"
          bg="bg-yellow-50"
        />
        <StatCard 
          title="Pending Amount" 
          value={`$${stats.pendingAmount.toLocaleString()}`} 
          icon={FileText} 
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard 
          title="Total Income" 
          value={`$${stats.totalIncome.toLocaleString()}`} 
          icon={TrendingUp} 
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard 
          title="Total Expenses" 
          value={`$${stats.totalExpenses.toLocaleString()}`} 
          icon={TrendingDown} 
          color="text-red-600"
          bg="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Buses Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Bus className="w-5 h-5 text-yellow-500" />
            Top 3 Buses (Passengers)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBuses}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bus_number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="passengers" fill="#eab308" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Staff Shortage */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            Top 3 Staff Shortages
          </h3>
          <div className="space-y-4">
            {topStaffShortage.map((staff, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                    {staff.staff_name?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{staff.staff_name}</p>
                    <p className="text-xs text-slate-500">Employee ID: {staff.staff_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-bold">${staff.shortage.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Shortage Amount</p>
                </div>
              </div>
            ))}
            {topStaffShortage.length === 0 && (
              <div className="text-center py-12 text-slate-400 italic">No shortage data available</div>
            )}
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${bg} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
    </div>
  );
}

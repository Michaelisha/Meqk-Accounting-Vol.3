'use client';

import DepartmentLayout from '@/components/department-layout';
import { OPERATIONS_NAVIGATION } from '@/constants/navigation';
import { 
  Search,
  Download,
  Calendar
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function DailyBusReportPage() {
  const { company } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) return;
    const fetchReport = async () => {
      const { data: report } = await supabase
        .from('daily_buses_view')
        .select('*')
        .eq('company', company.uuid)
        .order('date', { ascending: false });
      setData(report || []);
      setLoading(false);
    };
    fetchReport();
  }, [company]);

  return (
    <DepartmentLayout theme="operations" title="Daily Bus Report" navigation={OPERATIONS_NAVIGATION}>
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search bus or route..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
              />
            </div>
            <button className="bg-slate-900 text-white font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
              <Download className="w-5 h-5" /> EXPORT PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bus</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Passengers</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Fare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{row.date}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-900 italic">{row.bus_number}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{row.route_name}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{row.passengers}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-900 text-right">TZS {row.total_amount.toLocaleString()}</td>
                  </tr>
                ))}
                {data.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">No daily bus records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}

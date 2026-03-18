'use client';

import DepartmentLayout from '@/components/department-layout';
import { HR_NAVIGATION } from '@/constants/navigation';
import { 
  Calendar, 
  Search,
  Download
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function StaffReportPage() {
  const { company } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) return;
    const fetchReport = async () => {
      const { data: report } = await supabase
        .from('staff_statement')
        .select('*')
        .eq('company', company.uuid);
      setData(report || []);
      setLoading(false);
    };
    fetchReport();
  }, [company]);

  return (
    <DepartmentLayout theme="hr" title="Staff Statement Report" navigation={HR_NAVIGATION}>
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search staff name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
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
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Invoices</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total Cash</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Shortage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-black text-slate-900 italic">{row.staff_name}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600 text-right">TZS {row.total_invoices.toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600 text-right">TZS {row.total_cash.toLocaleString()}</td>
                    <td className={`px-8 py-5 text-sm font-black text-right italic ${row.shortage > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      TZS {row.shortage.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">No staff records found.</td>
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

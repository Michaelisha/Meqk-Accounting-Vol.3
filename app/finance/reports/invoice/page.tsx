'use client';

import DepartmentLayout from '@/components/department-layout';
import { FINANCE_NAVIGATION } from '@/constants/navigation';
import { 
  Search, 
  Download,
  Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function InvoiceReportPage() {
  const { company } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!company) return;
    const fetchReport = async () => {
      const { data: report } = await supabase
        .from('invoice_report')
        .select('*')
        .eq('company', company.uuid);
      setData(report || []);
      setLoading(false);
    };
    fetchReport();
  }, [company]);

  return (
    <DepartmentLayout theme="finance" title="Invoice Statement Report" navigation={FINANCE_NAVIGATION}>
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Global search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <button className="bg-slate-900 text-white font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
              <Download className="w-5 h-5" /> EXPORT PDF
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice #</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bus</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{row.date}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-900 italic">{row.invoice_number}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{row.staff_name}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{row.bus_number}</td>
                    <td className="px-8 py-5 text-sm font-bold text-slate-600">{row.route_name}</td>
                    <td className="px-8 py-5 text-sm font-black text-slate-900 text-right">TZS {row.amount.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        row.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic">No records found for this period.</td>
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

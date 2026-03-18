'use client';

import DepartmentLayout from '@/components/department-layout';
import { HR_NAVIGATION } from '@/constants/navigation';
import { 
  Calendar, 
  Save,
  Loader2,
  DollarSign
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function PayrollEntryPage() {
  const { company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    staff_id: '',
    month: new Date().toISOString().slice(0, 7),
    basic_salary: 0,
    allowances: 0,
    deductions: 0
  });

  useEffect(() => {
    if (!company) return;
    const fetchStaff = async () => {
      const { data } = await supabase.from('staffs').select('*').eq('company', company.uuid);
      setStaff(data || []);
    };
    fetchStaff();
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setLoading(true);
    try {
      const net_payable = formData.basic_salary + formData.allowances - formData.deductions;
      const { error } = await supabase.from('payroll_entries').insert({
        company: company.uuid,
        staff_id: formData.staff_id,
        month: formData.month,
        basic_salary: formData.basic_salary,
        allowances: formData.allowances,
        deductions: formData.deductions,
        net_payable: net_payable,
        date: new Date().toISOString().split('T')[0]
      });

      if (error) throw error;

      setFormData({
        staff_id: '',
        month: new Date().toISOString().slice(0, 7),
        basic_salary: 0,
        allowances: 0,
        deductions: 0
      });
      alert('Payroll entry posted successfully!');
    } catch (error: any) {
      console.error('Error posting payroll:', error);
      alert('Error posting payroll: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="hr" title="Payroll Entry" navigation={HR_NAVIGATION}>
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Select Staff</label>
              <select 
                value={formData.staff_id}
                onChange={(e) => setFormData({...formData, staff_id: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              >
                <option value="">Select Employee</option>
                {staff.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Payroll Month</label>
              <input 
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({...formData, month: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Basic Salary (TZS)</label>
              <input 
                type="number"
                value={formData.basic_salary}
                onChange={(e) => setFormData({...formData, basic_salary: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Allowances</label>
              <input 
                type="number"
                value={formData.allowances}
                onChange={(e) => setFormData({...formData, allowances: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Payable</p>
              <h4 className="text-2xl font-black text-orange-700 italic">TZS {(formData.basic_salary + formData.allowances - formData.deductions).toLocaleString()}</h4>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-orange-600 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-700 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> POST PAYROLL</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

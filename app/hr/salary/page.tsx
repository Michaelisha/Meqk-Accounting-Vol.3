'use client';

import DepartmentLayout from '@/components/department-layout';
import { HR_NAVIGATION } from '@/constants/navigation';
import { 
  Calendar, 
  Save,
  Loader2,
  Users,
  CreditCard,
  Tag,
  Hash
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function SalaryEntryPage() {
  const { company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<any[]>([]);
  const [months, setMonths] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    month_of: '',
    staff: '',
    account: '',
    category: '',
    amount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const [st, mn, acc, cat] = await Promise.all([
        supabase.from('staffs').select('uuid, name'),
        supabase.from('months').select('id, month_name'),
        supabase.from('accounts').select('uuid, account'),
        supabase.from('categories').select('uuid, category')
      ]);
      
      setStaff(st.data || []);
      setMonths(mn.data || []);
      setAccounts(acc.data || []);
      setCategories(cat.data || []);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('salary_entry').insert({
        company: company.uuid,
        date: formData.date,
        month_of: formData.month_of,
        staff: formData.staff,
        account: formData.account,
        category: formData.category,
        amount: formData.amount
      });

      if (error) throw error;

      setFormData({
        date: new Date().toISOString().split('T')[0],
        month_of: '',
        staff: '',
        account: '',
        category: '',
        amount: 0
      });
      alert('Salary entry posted successfully!');
    } catch (error: any) {
      console.error('Error posting salary entry:', error);
      alert('Error posting salary entry: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="hr" title="Salary Entry" navigation={HR_NAVIGATION}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Date
              </label>
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Month Of
              </label>
              <select 
                value={formData.month_of}
                onChange={(e) => setFormData({...formData, month_of: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              >
                <option value="">Select Month</option>
                {months.map(m => <option key={m.id} value={m.id}>{m.month_name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Users className="w-3 h-3" /> Staff
              </label>
              <select 
                value={formData.staff}
                onChange={(e) => setFormData({...formData, staff: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              >
                <option value="">Select Staff</option>
                {staff.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> Account
              </label>
              <select 
                value={formData.account}
                onChange={(e) => setFormData({...formData, account: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              >
                <option value="">Select Account</option>
                {accounts.map(a => <option key={a.uuid} value={a.uuid}>{a.account}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Tag className="w-3 h-3" /> Category
              </label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.uuid} value={c.uuid}>{c.category}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Hash className="w-3 h-3" /> Amount (TZS)
              </label>
              <input 
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="bg-orange-600 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-700 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> POST SALARY ENTRY</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

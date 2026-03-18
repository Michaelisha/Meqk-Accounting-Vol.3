'use client';

import DepartmentLayout from '@/components/department-layout';
import { FINANCE_NAVIGATION } from '@/constants/navigation';
import { 
  Trash2,
  Plus,
  Save,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AddCashPage() {
  const [loading, setLoading] = useState(false);
  const [cashTypes, setCashTypes] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [lines, setLines] = useState([
    { 
      date: new Date().toISOString().split('T')[0], 
      cash_type: '', 
      staff: '', 
      bus: '', 
      route: '', 
      account: '', 
      category: '', 
      amount: 0 
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        { data: types },
        { data: stf },
        { data: bs },
        { data: rt },
        { data: acc },
        { data: cat }
      ] = await Promise.all([
        supabase.from('cash_types').select('uuid,cash_type'),
        supabase.from('staffs').select('uuid,name'),
        supabase.from('buses').select('uuid,reg'),
        supabase.from('routes').select('uuid,route'),
        supabase.from('accounts').select('uuid,account'),
        supabase.from('categories').select('uuid,category')
      ]);

      setCashTypes(types || []);
      setStaff(stf || []);
      setBuses(bs || []);
      setRoutes(rt || []);
      setAccounts(acc || []);
      setCategories(cat || []);
    };
    fetchData();
  }, []);

  const addLine = () => {
    setLines([...lines, { 
      date: new Date().toISOString().split('T')[0], 
      cash_type: '', 
      staff: '', 
      bus: '', 
      route: '', 
      account: '', 
      category: '', 
      amount: 0 
    }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    (newLines[index] as any)[field] = value;
    setLines(newLines);
  };

  const totalAmount = lines.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const handleSubmit = async () => {
    if (lines.length === 0) return;
    
    setLoading(true);
    try {
      const entries = lines.map(line => ({
        date: line.date,
        cash_type: line.cash_type || null,
        staff: line.staff || null,
        bus: line.bus || null,
        route: line.route || null,
        account: line.account || null,
        category: line.category || null,
        amount: Number(line.amount)
      }));

      const { error } = await supabase.from('cash_entry').insert(entries);

      if (error) throw error;

      setLines([{ 
        date: new Date().toISOString().split('T')[0], 
        cash_type: '', 
        staff: '', 
        bus: '', 
        route: '', 
        account: '', 
        category: '', 
        amount: 0 
      }]);
      alert('Cash entries saved successfully!');
    } catch (error: any) {
      console.error('Error saving cash entry:', error);
      alert('Error saving cash entry: ' + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="finance" title="Add Cash Entry" navigation={FINANCE_NAVIGATION}>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 italic">Cash Lines</h3>
              <button 
                type="button"
                onClick={addLine}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" /> Add Line
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cash Type</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bus</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {lines.map((line, index) => (
                    <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-2 py-4">
                        <input 
                          type="date"
                          value={line.date}
                          onChange={(e) => updateLine(index, 'date', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          required
                        />
                      </td>
                      <td className="px-2 py-4">
                        <select 
                          value={line.cash_type}
                          onChange={(e) => updateLine(index, 'cash_type', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          required
                        >
                          <option value="">Select Type</option>
                          {cashTypes.map(t => <option key={t.uuid} value={t.uuid}>{t.cash_type}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4">
                        <select 
                          value={line.staff}
                          onChange={(e) => updateLine(index, 'staff', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                        >
                          <option value="">Select Staff</option>
                          {staff.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4">
                        <select 
                          value={line.bus}
                          onChange={(e) => updateLine(index, 'bus', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                        >
                          <option value="">Select Bus</option>
                          {buses.map(b => <option key={b.uuid} value={b.uuid}>{b.reg}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4">
                        <select 
                          value={line.route}
                          onChange={(e) => updateLine(index, 'route', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                        >
                          <option value="">Select Route</option>
                          {routes.map(r => <option key={r.uuid} value={r.uuid}>{r.route}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4">
                        <select 
                          value={line.account}
                          onChange={(e) => updateLine(index, 'account', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          required
                        >
                          <option value="">Select Account</option>
                          {accounts.map(a => <option key={a.uuid} value={a.uuid}>{a.account}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4">
                        <select 
                          value={line.category}
                          onChange={(e) => updateLine(index, 'category', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(c => <option key={c.uuid} value={c.uuid}>{c.category}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4">
                        <input 
                          type="number"
                          value={line.amount}
                          onChange={(e) => updateLine(index, 'amount', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          placeholder="0"
                          required
                        />
                      </td>
                      <td className="px-2 py-4">
                        <button 
                          type="button"
                          onClick={() => removeLine(index)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-28">
            <h3 className="text-xl font-black text-slate-900 italic mb-6">Summary</h3>
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center mb-8">
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">Total Cash Amount</p>
              <h4 className="text-2xl font-black text-blue-900 italic">
                TZS {totalAmount.toLocaleString()}
              </h4>
            </div>

            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading || lines.length === 0}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> SAVE TRANSACTION</>}
            </button>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}

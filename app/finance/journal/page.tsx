'use client';

import DepartmentLayout from '@/components/department-layout';
import { FINANCE_NAVIGATION } from '@/constants/navigation';
import { 
  Save,
  Loader2,
  Calendar,
  Plus,
  Trash2,
  Users,
  Bus,
  Route,
  ArrowRightLeft
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface JournalLine {
  id: string;
  date: string;
  journal_type: string;
  staff: string;
  bus: string;
  route: string;
  reference: string;
  account: string;
  debit: number;
  credit: number;
  isDebit: boolean;
}

export default function JournalPage() {
  const [loading, setLoading] = useState(false);
  
  // Dropdown data
  const [journalTypes, setJournalTypes] = useState<any[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  const createLinePair = () => {
    const common = {
      date: new Date().toISOString().split('T')[0],
      journal_type: '',
      staff: '',
      bus: '',
      route: '',
      reference: '',
    };
    return [
      { ...common, id: Math.random().toString(36).substr(2, 9), account: '', debit: 0, credit: 0, isDebit: true },
      { ...common, id: Math.random().toString(36).substr(2, 9), account: '', debit: 0, credit: 0, isDebit: false }
    ];
  };

  const [lines, setLines] = useState<JournalLine[]>(createLinePair());

  useEffect(() => {
    const fetchData = async () => {
      const [jt, st, bs, rt, acc] = await Promise.all([
        supabase.from('journal_types').select('uuid,journal_type'),
        supabase.from('staffs').select('uuid,name'),
        supabase.from('buses').select('uuid,reg'),
        supabase.from('routes').select('uuid,route'),
        supabase.from('accounts_categories').select('uuid,name')
      ]);

      setJournalTypes(jt.data || []);
      setStaffs(st.data || []);
      setBuses(bs.data || []);
      setRoutes(rt.data || []);
      setAccounts(acc.data || []);
    };
    fetchData();
  }, []);

  const addLinePair = () => {
    setLines([...lines, ...createLinePair()]);
  };

  const removeLinePair = (index: number) => {
    // Ensure we remove the pair (even or odd index)
    const pairStart = Math.floor(index / 2) * 2;
    if (lines.length > 2) {
      const newLines = [...lines];
      newLines.splice(pairStart, 2);
      setLines(newLines);
    }
  };

  const updateLine = (index: number, field: keyof JournalLine, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    
    // If it's a common field, update the pair? 
    // Usually journal entries share date/type/staff/bus/route/description for the same transaction
    const pairIndex = index % 2 === 0 ? index + 1 : index - 1;
    const commonFields: (keyof JournalLine)[] = ['date', 'journal_type', 'staff', 'bus', 'route', 'reference'];
    
    if (commonFields.includes(field)) {
      newLines[pairIndex] = { ...newLines[pairIndex], [field]: value };
    }

    setLines(newLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate balance
    for (let i = 0; i < lines.length; i += 2) {
      const debit = lines[i].debit;
      const credit = lines[i+1].credit;
      if (debit !== credit || debit <= 0) {
        alert(`Transaction pair ${Math.floor(i/2) + 1} is not balanced or amount is zero.`);
        return;
      }
    }

    setLoading(true);
    try {
      const entries = lines.map(line => ({
        date: line.date,
        journal_type: line.journal_type || null,
        staff: line.staff || null,
        bus: line.bus || null,
        route: line.route || null,
        reference: line.reference || null,
        account: line.account || null,
        debit_amount: Number(line.debit) || 0,
        credit_amount: Number(line.credit) || 0
      }));

      const { error } = await supabase.from('journal_entries').insert(entries);
      if (error) throw error;

      setLines(createLinePair());
      alert('Journal entries posted successfully!');
    } catch (error: any) {
      console.error('Error posting journal:', error);
      alert('Error: ' + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  const totalDebit = lines.reduce((acc, curr) => acc + (curr.debit || 0), 0);
  const totalCredit = lines.reduce((acc, curr) => acc + (curr.credit || 0), 0);

  return (
    <DepartmentLayout theme="finance" title="Journal Entries" navigation={FINANCE_NAVIGATION}>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-bottom border-slate-200">
                      <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Journal Type</th>
                      <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff</th>
                      <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bus</th>
                      <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                      <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                      <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</th>
                      <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Debit</th>
                      <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Credit</th>
                      <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {lines.map((line, index) => (
                      <tr key={line.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                        <td className="p-2">
                          <input 
                            type="date"
                            value={line.date}
                            onChange={(e) => updateLine(index, 'date', e.target.value)}
                            className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-xs font-bold focus:ring-0"
                            required
                          />
                        </td>
                        <td className="p-2">
                          <select 
                            value={line.journal_type}
                            onChange={(e) => updateLine(index, 'journal_type', e.target.value)}
                            className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-xs font-bold focus:ring-0 italic"
                            required
                          >
                            <option value="">Type</option>
                            {journalTypes.map(t => <option key={t.uuid} value={t.uuid}>{t.journal_type}</option>)}
                          </select>
                        </td>
                        <td className="p-2">
                          <select 
                            value={line.staff}
                            onChange={(e) => updateLine(index, 'staff', e.target.value)}
                            className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-xs font-bold focus:ring-0 italic"
                          >
                            <option value="">Staff</option>
                            {staffs.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
                          </select>
                        </td>
                        <td className="p-2">
                          <select 
                            value={line.bus}
                            onChange={(e) => updateLine(index, 'bus', e.target.value)}
                            className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-xs font-bold focus:ring-0 italic"
                          >
                            <option value="">Bus</option>
                            {buses.map(b => <option key={b.uuid} value={b.uuid}>{b.reg}</option>)}
                          </select>
                        </td>
                        <td className="p-2">
                          <select 
                            value={line.route}
                            onChange={(e) => updateLine(index, 'route', e.target.value)}
                            className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-xs font-bold focus:ring-0 italic"
                          >
                            <option value="">Route</option>
                            {routes.map(r => <option key={r.uuid} value={r.uuid}>{r.route}</option>)}
                          </select>
                        </td>
                        <td className="p-2">
                          <input 
                            type="text"
                            value={line.reference}
                            onChange={(e) => updateLine(index, 'reference', e.target.value)}
                            className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-xs font-bold focus:ring-0 italic"
                            placeholder="Ref..."
                          />
                        </td>
                        <td className="p-2">
                          <select 
                            value={line.account}
                            onChange={(e) => updateLine(index, 'account', e.target.value)}
                            className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-xs font-bold focus:ring-0 italic"
                            required
                          >
                            <option value="">Account</option>
                            {accounts.map(a => <option key={a.uuid} value={a.uuid}>{a.name}</option>)}
                          </select>
                        </td>
                        <td className="p-2">
                          <input 
                            type="number"
                            value={line.debit}
                            onChange={(e) => updateLine(index, 'debit', Number(e.target.value))}
                            className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-xs font-bold focus:ring-0 text-right"
                            disabled={!line.isDebit}
                          />
                        </td>
                        <td className="p-2">
                          <input 
                            type="number"
                            value={line.credit}
                            onChange={(e) => updateLine(index, 'credit', Number(e.target.value))}
                            className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-xs font-bold focus:ring-0 text-right"
                            disabled={line.isDebit}
                          />
                        </td>
                        <td className="p-2">
                          {index % 2 === 0 && (
                            <button 
                              type="button"
                              onClick={() => removeLinePair(index)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <button 
                  type="button"
                  onClick={addLinePair}
                  className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add Transaction Pair
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="bg-slate-900 text-white font-black px-12 py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> POST JOURNAL</>}
              </button>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Summary</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Journal Totals</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Debit</span>
                <span className="text-sm font-black text-slate-900">TZS {totalDebit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Credit</span>
                <span className="text-sm font-black text-slate-900">TZS {totalCredit.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between items-center pt-4 border-t ${totalDebit === totalCredit ? 'text-green-600' : 'text-red-600'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest">Balance</span>
                <span className="text-lg font-black italic">
                  {totalDebit === totalCredit ? 'Balanced' : `Diff: TZS ${Math.abs(totalDebit - totalCredit).toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}

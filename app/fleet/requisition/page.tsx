'use client';

import DepartmentLayout from '@/components/department-layout';
import { FLEET_NAVIGATION } from '@/constants/navigation';
import { 
  Save,
  Loader2,
  ClipboardList,
  Calendar
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function SpareRequisitionPage() {
  const [loading, setLoading] = useState(false);
  const [spares, setSpares] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    date: '',
    spare: '',
    quantity: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: s } = await supabase.from('spares').select('*');
      setSpares(s || []);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { error } = await supabase.from('spare_requisition').insert({
        date: formData.date,
        spare: formData.spare,
        quantity: formData.quantity
      });

      if (error) throw error;

      setFormData({
        date: '',
        spare: '',
        quantity: 0
      });
      alert('Requisition submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting requisition:', error);
      alert('Error submitting requisition: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="fleet" title="Spare Requisition" navigation={FLEET_NAVIGATION}>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Spare Part</label>
              <select 
                value={formData.spare}
                onChange={(e) => setFormData({...formData, spare: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
                required
              >
                <option value="">Select Part</option>
                {spares.map(s => <option key={s.uuid} value={s.uuid}>{s.spare} ({s.quantity} in stock)</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Quantity Required</label>
              <input 
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-purple-500/20 hover:bg-purple-700 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ClipboardList className="w-5 h-5" /> SUBMIT REQUISITION</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

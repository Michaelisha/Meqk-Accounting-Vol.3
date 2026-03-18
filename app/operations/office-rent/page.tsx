'use client';

import DepartmentLayout from '@/components/department-layout';
import { OPERATIONS_NAVIGATION } from '@/constants/navigation';
import { 
  Save,
  Loader2,
  Calendar,
  Building2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function OfficeRentPage() {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    office: '',
    rent_paid: 0,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: off } = await supabase.from('offices').select('*');
      setOffices(off || []);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { error } = await supabase.from('office_rent').insert({
        office: formData.office || null,
        rent_paid: Number(formData.rent_paid || 0),
        start_date: formData.start_date,
        end_date: formData.end_date
      });

      if (error) throw error;

      setFormData({
        office: '',
        rent_paid: 0,
        start_date: '',
        end_date: ''
      });
      alert('Office rent entry saved successfully!');
    } catch (error: any) {
      console.error('Error saving office rent:', error);
      alert('Error saving office rent: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="operations" title="Office Rent Entry" navigation={OPERATIONS_NAVIGATION}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Building2 className="w-3 h-3" /> Select Office
              </label>
              <select 
                value={formData.office}
                onChange={(e) => setFormData({...formData, office: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              >
                <option value="">Select Office</option>
                {offices.map(o => <option key={o.uuid} value={o.uuid}>{o.office}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Rent Paid (TZS)</label>
              <input 
                type="number"
                value={formData.rent_paid}
                onChange={(e) => setFormData({...formData, rent_paid: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Start Date
              </label>
              <input 
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> End Date
              </label>
              <input 
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-green-500/20 hover:bg-green-700 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> SAVE RENT ENTRY</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

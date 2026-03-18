'use client';

import DepartmentLayout from '@/components/department-layout';
import { FLEET_NAVIGATION } from '@/constants/navigation';
import { 
  Save,
  Loader2,
  Calendar
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function AddLicencePage() {
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    bus: '',
    licence_paid: 0,
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    const fetchBuses = async () => {
      const { data } = await supabase.from('buses').select('*');
      setBuses(data || []);
    };
    fetchBuses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { error } = await supabase.from('licence').insert({
        bus: formData.bus,
        licence_paid: formData.licence_paid,
        start_date: formData.start_date,
        end_date: formData.end_date
      });

      if (error) throw error;

      setFormData({
        bus: '',
        licence_paid: 0,
        start_date: '',
        end_date: ''
      });
      alert('Licence saved successfully!');
    } catch (error: any) {
      console.error('Error saving licence:', error);
      alert('Error saving licence: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="fleet" title="Add Licence" navigation={FLEET_NAVIGATION}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Select Bus</label>
              <select 
                value={formData.bus}
                onChange={(e) => setFormData({...formData, bus: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
                required
              >
                <option value="">Select Vehicle</option>
                {buses.map(b => <option key={b.uuid} value={b.uuid}>{b.reg}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Licence Paid</label>
              <input 
                type="number"
                value={formData.licence_paid}
                onChange={(e) => setFormData({...formData, licence_paid: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> SAVE LICENCE</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

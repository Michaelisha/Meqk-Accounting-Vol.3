'use client';

import DepartmentLayout from '@/components/department-layout';
import { FLEET_NAVIGATION } from '@/constants/navigation';
import { 
  Bus, 
  Save,
  Loader2,
  Users,
  Calendar
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function AddBusPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reg: '',
    seats: 0,
    purchase_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { error } = await supabase.from('buses').insert({
        reg: formData.reg,
        seats: formData.seats,
        purchase_date: formData.purchase_date
      });

      if (error) throw error;

      setFormData({
        reg: '',
        seats: 0,
        purchase_date: ''
      });
      alert('Bus registered successfully!');
    } catch (error: any) {
      console.error('Error registering bus:', error);
      alert('Error registering bus: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="fleet" title="Add New Bus" navigation={FLEET_NAVIGATION}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Bus className="w-3 h-3" /> Registration Number
              </label>
              <input 
                type="text"
                value={formData.reg}
                onChange={(e) => setFormData({...formData, reg: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
                placeholder="T 123 ABC"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Users className="w-3 h-3" /> Seats
              </label>
              <input 
                type="number"
                value={formData.seats}
                onChange={(e) => setFormData({...formData, seats: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Purchase Date
              </label>
              <input 
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({...formData, purchase_date: e.target.value})}
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> REGISTER BUS</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

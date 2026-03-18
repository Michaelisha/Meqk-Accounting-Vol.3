'use client';

import DepartmentLayout from '@/components/department-layout';
import { FLEET_NAVIGATION } from '@/constants/navigation';
import { 
  Save,
  Loader2,
  Calendar,
  User,
  Bus,
  MapPin,
  Fuel
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DieselUsagePage() {
  const [loading, setLoading] = useState(false);
  const [staffs, setStaffs] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    date: '',
    driver: '',
    bus: '',
    route: '',
    diesel_used: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const [s, b, r] = await Promise.all([
        supabase.from('staffs').select('*'),
        supabase.from('buses').select('*'),
        supabase.from('routes').select('*')
      ]);
      setStaffs(s.data || []);
      setBuses(b.data || []);
      setRoutes(r.data || []);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { error } = await supabase.from('diesel_usage').insert({
        date: formData.date,
        driver: formData.driver,
        bus: formData.bus,
        route: formData.route,
        diesel_used: formData.diesel_used
      });

      if (error) throw error;

      setFormData({
        date: '',
        driver: '',
        bus: '',
        route: '',
        diesel_used: 0
      });
      alert('Diesel usage recorded successfully!');
    } catch (error: any) {
      console.error('Error recording diesel usage:', error);
      alert('Error recording diesel usage: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="fleet" title="Diesel Usage" navigation={FLEET_NAVIGATION}>
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <User className="w-3 h-3" /> Driver
              </label>
              <select 
                value={formData.driver}
                onChange={(e) => setFormData({...formData, driver: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
                required
              >
                <option value="">Select Driver</option>
                {staffs.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Bus className="w-3 h-3" /> Bus
              </label>
              <select 
                value={formData.bus}
                onChange={(e) => setFormData({...formData, bus: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
                required
              >
                <option value="">Select Bus</option>
                {buses.map(b => <option key={b.uuid} value={b.uuid}>{b.reg}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Route
              </label>
              <select 
                value={formData.route}
                onChange={(e) => setFormData({...formData, route: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
                required
              >
                <option value="">Select Route</option>
                {routes.map(r => <option key={r.uuid} value={r.uuid}>{r.route}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Fuel className="w-3 h-3" /> Diesel Used (Liters)
              </label>
              <input 
                type="number"
                value={formData.diesel_used}
                onChange={(e) => setFormData({...formData, diesel_used: Number(e.target.value)})}
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> RECORD DIESEL</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

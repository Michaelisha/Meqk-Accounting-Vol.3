'use client';

import DepartmentLayout from '@/components/department-layout';
import { OPERATIONS_NAVIGATION } from '@/constants/navigation';
import { 
  Save,
  Loader2,
  Calendar,
  Route as RouteIcon,
  Users,
  Bus as BusIcon,
  TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function AddDailyBusPage() {
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [operations, setOperations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    operation: '',
    bus: '',
    route: '',
    driver: '',
    conductor: '',
    enroute: 0,
    oneway: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: b } = await supabase.from('buses').select('*');
      const { data: r } = await supabase.from('routes').select('*');
      const { data: s } = await supabase.from('staffs').select('*');
      const { data: o } = await supabase.from('operations').select('*');
      setBuses(b || []);
      setRoutes(r || []);
      setStaff(s || []);
      setOperations(o || []);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { error } = await supabase.from('daily_buses').insert({
        date: formData.date,
        operation: formData.operation || null,
        bus: formData.bus || null,
        route: formData.route || null,
        driver: formData.driver || null,
        conductor: formData.conductor || null,
        enroute: Number(formData.enroute || 0),
        oneway: Number(formData.oneway || 0)
      });

      if (error) throw error;

      setFormData({
        date: new Date().toISOString().split('T')[0],
        operation: '',
        bus: '',
        route: '',
        driver: '',
        conductor: '',
        enroute: 0,
        oneway: 0
      });
      alert('Daily bus entry saved successfully!');
    } catch (error: any) {
      console.error('Error saving daily bus entry:', error);
      alert('Error saving daily bus entry: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="operations" title="Daily Bus Entry" navigation={OPERATIONS_NAVIGATION}>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Operation
              </label>
              <select 
                value={formData.operation}
                onChange={(e) => setFormData({...formData, operation: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              >
                <option value="">Select Operation</option>
                {operations.map(o => <option key={o.uuid} value={o.uuid}>{o.operation}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <BusIcon className="w-3 h-3" /> Bus Number
              </label>
              <select 
                value={formData.bus}
                onChange={(e) => setFormData({...formData, bus: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              >
                <option value="">Select Bus</option>
                {buses.map(b => <option key={b.uuid} value={b.uuid}>{b.reg}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <RouteIcon className="w-3 h-3" /> Route
              </label>
              <select 
                value={formData.route}
                onChange={(e) => setFormData({...formData, route: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              >
                <option value="">Select Route</option>
                {routes.map(r => <option key={r.uuid} value={r.uuid}>{r.route}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Users className="w-3 h-3" /> Driver
              </label>
              <select 
                value={formData.driver}
                onChange={(e) => setFormData({...formData, driver: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              >
                <option value="">Select Driver</option>
                {staff.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Users className="w-3 h-3" /> Conductor
              </label>
              <select 
                value={formData.conductor}
                onChange={(e) => setFormData({...formData, conductor: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              >
                <option value="">Select Conductor</option>
                {staff.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Enroute Passengers</label>
              <input 
                type="number"
                value={formData.enroute}
                onChange={(e) => setFormData({...formData, enroute: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Oneway Passengers</label>
              <input 
                type="number"
                value={formData.oneway}
                onChange={(e) => setFormData({...formData, oneway: Number(e.target.value)})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Passengers</p>
              <h4 className="text-2xl font-black text-green-700 italic">{(Number(formData.enroute) + Number(formData.oneway)).toLocaleString()}</h4>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-green-500/20 hover:bg-green-700 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> SAVE ENTRY</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

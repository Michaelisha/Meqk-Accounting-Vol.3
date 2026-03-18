'use client';

import DepartmentLayout from '@/components/department-layout';
import { FLEET_NAVIGATION } from '@/constants/navigation';
import { 
  Package, 
  Save,
  Loader2,
  Calendar
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function AddSparePage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    spare: '',
    spare_number: '',
    quantity: 0,
    purchase_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { error } = await supabase.from('spares').insert({
        spare: formData.spare,
        spare_number: formData.spare_number,
        quantity: formData.quantity,
        purchase_date: formData.purchase_date
      });

      if (error) throw error;

      setFormData({
        spare: '',
        spare_number: '',
        quantity: 0,
        purchase_date: ''
      });
      alert('Spare part added to inventory!');
    } catch (error: any) {
      console.error('Error adding spare part:', error);
      alert('Error adding spare part: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="fleet" title="Add Spare Part" navigation={FLEET_NAVIGATION}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Package className="w-3 h-3" /> Spare Name
              </label>
              <input 
                type="text"
                value={formData.spare}
                onChange={(e) => setFormData({...formData, spare: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
                placeholder="Brake Pads"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Spare Number</label>
              <input 
                type="text"
                value={formData.spare_number}
                onChange={(e) => setFormData({...formData, spare_number: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-purple-500 transition-all"
                placeholder="BP-12345"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Quantity</label>
              <input 
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> ADD TO INVENTORY</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

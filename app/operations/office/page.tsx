'use client';

import DepartmentLayout from '@/components/department-layout';
import { OPERATIONS_NAVIGATION } from '@/constants/navigation';
import { 
  Save,
  Loader2,
  Building2,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function AddOfficePage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    office: '',
    region: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { error } = await supabase.from('offices').insert({
        office: formData.office,
        region: formData.region
      });

      if (error) throw error;

      setFormData({
        office: '',
        region: ''
      });
      alert('Office registered successfully!');
    } catch (error: any) {
      console.error('Error registering office:', error);
      alert('Error registering office: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="operations" title="Add Office" navigation={OPERATIONS_NAVIGATION}>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Building2 className="w-3 h-3" /> Office Name
              </label>
              <input 
                type="text"
                value={formData.office}
                onChange={(e) => setFormData({...formData, office: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                placeholder="Main Branch"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Region
              </label>
              <input 
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-green-500 transition-all"
                placeholder="Dar es Salaam"
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> REGISTER OFFICE</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

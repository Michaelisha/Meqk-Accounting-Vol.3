'use client';

import DepartmentLayout from '@/components/department-layout';
import { HR_NAVIGATION } from '@/constants/navigation';
import { 
  Users, 
  Save,
  Loader2,
  Briefcase,
  Building2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';

export default function AddStaffPage() {
  const { company } = useAuth();
  const [loading, setLoading] = useState(false);
  const [occupations, setOccupations] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    occupation: '',
    office: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const [occ, off] = await Promise.all([
        supabase.from('occupations').select('uuid, occupation'),
        supabase.from('offices').select('uuid, office')
      ]);
      setOccupations(occ.data || []);
      setOffices(off.data || []);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('staffs').insert({
        company: company.uuid,
        name: formData.name,
        occupation: formData.occupation,
        office: formData.office
      });

      if (error) throw error;

      setFormData({
        name: '',
        occupation: '',
        office: ''
      });
      alert('Staff member registered successfully!');
    } catch (error: any) {
      console.error('Error registering staff:', error);
      alert('Error registering staff: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="hr" title="Add Staff Member" navigation={HR_NAVIGATION}>
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Users className="w-3 h-3" /> Full Name
              </label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Occupation
              </label>
              <select 
                value={formData.occupation}
                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              >
                <option value="">Select Occupation</option>
                {occupations.map(o => <option key={o.uuid} value={o.uuid}>{o.occupation}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                <Building2 className="w-3 h-3" /> Office
              </label>
              <select 
                value={formData.office}
                onChange={(e) => setFormData({...formData, office: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-orange-500 transition-all"
                required
              >
                <option value="">Select Office</option>
                {offices.map(o => <option key={o.uuid} value={o.uuid}>{o.office}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="bg-orange-600 text-white font-black px-12 py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-700 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> REGISTER STAFF</>}
            </button>
          </div>
        </form>
      </div>
    </DepartmentLayout>
  );
}

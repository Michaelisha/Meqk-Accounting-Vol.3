'use client';

import { useState, useEffect, useCallback } from 'react';
import DepartmentLayout from '@/components/department-layout';
import GenericReports from '@/components/generic-reports';
import { FLEET_NAVIGATION } from '@/constants/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const TABS = [
  { id: 'daily', label: 'Daily Buses', view: 'daily_buses_view' },
  { id: 'buses', label: 'Bus List', view: 'bus_list' },
  { id: 'spares', label: 'Spare List', view: 'spare_list' },
  { id: 'licence', label: 'Licence Report', view: 'licence_view' },
];

export default function FleetReports() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: reportData, error } = await supabase
        .from(activeTab.view)
        .select('*');
      
      if (error) throw error;
      setData(reportData || []);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return (
    <DepartmentLayout theme="fleet" title="Fleet Reports" navigation={FLEET_NAVIGATION}>
      <div className="space-y-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-sm font-black transition-all italic ${
                activeTab.id === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <GenericReports title={activeTab.label}>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center text-slate-400 italic">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                Loading {activeTab.label}...
              </div>
            ) : data.length === 0 ? (
              <div className="p-20 text-center text-slate-400 italic">No records found</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {Object.keys(data[0]).map((header) => (
                      <th key={header} className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        {header.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="px-6 py-4 text-sm font-bold text-slate-600 italic whitespace-nowrap">
                          {typeof val === 'number' && !String(val).includes('-') && val > 1000 ? val.toLocaleString() : String(val || '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </GenericReports>
      </div>
    </DepartmentLayout>
  );
}

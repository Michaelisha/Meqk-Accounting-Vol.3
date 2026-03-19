'use client';

import { useState } from 'react';
import DepartmentLayout from '@/components/department-layout';
import GenericReports from '@/components/generic-reports';
import { OPERATIONS_NAVIGATION } from '@/constants/navigation';

const TABS = [
  { id: 'daily', label: 'Daily Buses', view: 'daily_buses_view' },
  { id: 'offices', label: 'Office List', view: 'office_list' },
  { id: 'utilization', label: 'Bus Utilization', view: 'bus_utilization_full' },
  { id: 'rent', label: 'Office Rent Expiry', view: 'office_rent_view' },
  { id: 'office_perf', label: 'Office Performance', view: 'office_performance' },
];

export default function OperationsReports() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <DepartmentLayout theme="operations" title="Operations Reports" navigation={OPERATIONS_NAVIGATION}>
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

        <GenericReports 
          viewName={activeTab.view} 
          title={activeTab.label}
        />
      </div>
    </DepartmentLayout>
  );
}

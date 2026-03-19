'use client';

import { useState } from 'react';
import DepartmentLayout from '@/components/department-layout';
import GenericReports from '@/components/generic-reports';
import { FLEET_NAVIGATION } from '@/constants/navigation';

const TABS = [
  { id: 'daily', label: 'Daily Buses', view: 'daily_buses_view' },
  { id: 'buses', label: 'Bus List', view: 'bus_list' },
  { id: 'spares', label: 'Spare List', view: 'spare_list' },
  { id: 'licence', label: 'Licence Report', view: 'licence_view' },
  { id: 'diesel', label: 'Diesel Usage', view: 'diesel_usage_view' },
];

export default function FleetReports() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

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

        <GenericReports 
          viewName={activeTab.view} 
          title={activeTab.label}
        />
      </div>
    </DepartmentLayout>
  );
}

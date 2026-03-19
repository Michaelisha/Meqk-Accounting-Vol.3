'use client';

import { useState } from 'react';
import DepartmentLayout from '@/components/department-layout';
import GenericReports from '@/components/generic-reports';
import { HR_NAVIGATION } from '@/constants/navigation';

const TABS = [
  { id: 'staff', label: 'Staff List', view: 'staff_list' },
  { id: 'salary', label: 'Salary Report', view: 'salary_report' },
  { id: 'payroll', label: 'Payroll Report', view: 'payroll_report' },
];

export default function HRReports() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <DepartmentLayout theme="hr" title="HR Reports" navigation={HR_NAVIGATION}>
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

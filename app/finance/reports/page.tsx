'use client';

import DepartmentLayout from '@/components/department-layout';
import { FINANCE_NAVIGATION } from '@/constants/navigation';
import GenericReports from '@/components/generic-reports';
import { useState } from 'react';

const TABS = [
  { id: 'invoice', label: 'Invoice Report', view: 'invoice_report' },
  { id: 'trial', label: 'Trial Balance', view: 'trial_balance' },
  { id: 'staff', label: 'Staff Statement', view: 'staff_statement' },
  { id: 'balances', label: 'Staff Balances', view: 'staff_dashboard' },
  { id: 'account', label: 'Account Statement', view: 'account_statement' },
  { id: 'income', label: 'Income Statement', view: 'income_statement' },
  { id: 'bus_income', label: 'Buses Income', view: 'bus_total_income' },
  { id: 'bus_perf', label: 'Bus Performance', view: 'bus_performance' },
  { id: 'acc_summary', label: 'Accounts Summary', view: 'trial_balance_summary' },
  { id: 'collection', label: 'Collection Report', view: 'collection_report' },
];

export default function FinanceReports() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <DepartmentLayout theme="finance" title="Finance Reports" navigation={FINANCE_NAVIGATION}>
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

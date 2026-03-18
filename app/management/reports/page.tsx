'use client';

import { useState, useEffect, useCallback } from 'react';
import DepartmentLayout from '@/components/department-layout';
import GenericReports from '@/components/generic-reports';
import { MANAGEMENT_NAVIGATION } from '@/constants/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, ChevronDown } from 'lucide-react';

const MODULES = [
  {
    name: 'Finance',
    reports: [
      { id: 'invoice', label: 'Invoice Report', view: 'invoice_report' },
      { id: 'trial', label: 'Trial Balance', view: 'trial_balance' },
      { id: 'staff_stmt', label: 'Staff Statement', view: 'staff_statement' },
      { id: 'acc_stmt', label: 'Account Statement', view: 'account_statement' },
      { id: 'income_stmt', label: 'Income Statement', view: 'income_statement' },
    ]
  },
  {
    name: 'Operations',
    reports: [
      { id: 'daily', label: 'Daily Buses', view: 'daily_buses_view' },
      { id: 'offices', label: 'Office List', view: 'office_list' },
      { id: 'utilization', label: 'Bus Utilization', view: 'bus_utilization' },
      { id: 'rent_expiry', label: 'Office Rent Expiry', view: 'office_rent_expiry' },
    ]
  },
  {
    name: 'HR',
    reports: [
      { id: 'staff_list', label: 'Staff List', view: 'staff_list' },
      { id: 'salary', label: 'Salary Report', view: 'salary_report' },
      { id: 'payroll', label: 'Payroll Report', view: 'payroll_report' },
    ]
  },
  {
    name: 'Fleet',
    reports: [
      { id: 'bus_list', label: 'Bus List', view: 'bus_list' },
      { id: 'spare_list', label: 'Spare List', view: 'spare_list' },
      { id: 'licence', label: 'Licence Report', view: 'licence_view' },
    ]
  }
];

export default function ManagementReports() {
  const [activeReport, setActiveReport] = useState(MODULES[0].reports[0]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: reportData, error } = await supabase
        .from(activeReport.view)
        .select('*');
      
      if (error) throw error;
      setData(reportData || []);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  }, [activeReport]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return (
    <DepartmentLayout theme="management" title="Management Reports" navigation={MANAGEMENT_NAVIGATION}>
      <div className="space-y-8">
        {/* Module Selection */}
        <div className="flex flex-wrap gap-4">
          {MODULES.map((module) => (
            <div key={module.name} className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{module.name}</p>
              <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl">
                {module.reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setActiveReport(report)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all italic ${
                      activeReport.id === report.id 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {report.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <GenericReports title={activeReport.label}>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center text-slate-400 italic">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                Loading {activeReport.label}...
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

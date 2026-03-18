'use client';

import DepartmentLayout from '@/components/department-layout';
import { HR_NAVIGATION } from '@/constants/navigation';

import Link from 'next/link';

export default function HRForms() {
  return (
    <DepartmentLayout theme="hr" title="HR Forms" navigation={HR_NAVIGATION}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/hr/staff">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Add Staff</h4>
            <p className="text-slate-500 text-sm">Register a new employee</p>
          </div>
        </Link>
        <Link href="/hr/payroll">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Post Payroll</h4>
            <p className="text-slate-500 text-sm">Record monthly staff salaries</p>
          </div>
        </Link>
      </div>
    </DepartmentLayout>
  );
}

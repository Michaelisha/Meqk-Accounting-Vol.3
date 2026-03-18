'use client';

import DepartmentLayout from '@/components/department-layout';
import { OPERATIONS_NAVIGATION } from '@/constants/navigation';

import Link from 'next/link';

export default function OperationsForms() {
  return (
    <DepartmentLayout theme="operations" title="Operations Forms" navigation={OPERATIONS_NAVIGATION}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/operations/daily-bus">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Add Daily Bus</h4>
            <p className="text-slate-500 text-sm">Record daily bus operations</p>
          </div>
        </Link>
        <Link href="/operations/office">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Add Office</h4>
            <p className="text-slate-500 text-sm">Register a new office branch</p>
          </div>
        </Link>
        <Link href="/operations/office-rent">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Office Rent</h4>
            <p className="text-slate-500 text-sm">Record office rent payments</p>
          </div>
        </Link>
      </div>
    </DepartmentLayout>
  );
}

'use client';

import DepartmentLayout from '@/components/department-layout';
import { FINANCE_NAVIGATION } from '@/constants/navigation';

import Link from 'next/link';

export default function FinanceForms() {
  return (
    <DepartmentLayout theme="finance" title="Finance Forms" navigation={FINANCE_NAVIGATION}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/finance/invoice">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Add Invoice</h4>
            <p className="text-slate-500 text-sm">Create a new invoice entry</p>
          </div>
        </Link>
        <Link href="/finance/cash">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Add Cash</h4>
            <p className="text-slate-500 text-sm">Record cash transactions</p>
          </div>
        </Link>
      </div>
    </DepartmentLayout>
  );
}

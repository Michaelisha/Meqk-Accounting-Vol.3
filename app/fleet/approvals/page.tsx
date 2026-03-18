'use client';

import DepartmentLayout from '@/components/department-layout';
import { FLEET_NAVIGATION } from '@/constants/navigation';
import { CheckCircle2 } from 'lucide-react';

export default function FleetApprovalsPage() {
  return (
    <DepartmentLayout theme="fleet" title="Pending Approvals" navigation={FLEET_NAVIGATION}>
      <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm text-center">
        <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 italic mb-2">No Pending Approvals</h3>
        <p className="text-slate-500 font-bold">All fleet maintenance requests have been processed.</p>
      </div>
    </DepartmentLayout>
  );
}

'use client';

import DepartmentLayout from '@/components/department-layout';
import { MANAGEMENT_NAVIGATION } from '@/constants/navigation';

export default function ManagementApprovals() {
  return (
    <DepartmentLayout theme="management" title="Pending Approvals" navigation={MANAGEMENT_NAVIGATION}>
      <div className="text-center py-20 italic text-slate-400">No pending approvals found.</div>
    </DepartmentLayout>
  );
}

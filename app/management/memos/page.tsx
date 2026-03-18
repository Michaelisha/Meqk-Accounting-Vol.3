'use client';

import DepartmentLayout from '@/components/department-layout';
import { MANAGEMENT_NAVIGATION } from '@/constants/navigation';

export default function ManagementMemos() {
  return (
    <DepartmentLayout theme="management" title="Management Memos" navigation={MANAGEMENT_NAVIGATION}>
      <div className="text-center py-20 italic text-slate-400">No active memos.</div>
    </DepartmentLayout>
  );
}

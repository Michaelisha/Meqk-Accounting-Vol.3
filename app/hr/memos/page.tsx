'use client';

import DepartmentLayout from '@/components/department-layout';
import { HR_NAVIGATION } from '@/constants/navigation';

export default function HRMemos() {
  return (
    <DepartmentLayout theme="hr" title="HR Memos" navigation={HR_NAVIGATION}>
      <div className="text-center py-20 italic text-slate-400">No active memos.</div>
    </DepartmentLayout>
  );
}

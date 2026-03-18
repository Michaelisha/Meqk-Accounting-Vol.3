'use client';

import DepartmentLayout from '@/components/department-layout';
import { OPERATIONS_NAVIGATION } from '@/constants/navigation';

export default function OperationsMemos() {
  return (
    <DepartmentLayout theme="operations" title="Operations Memos" navigation={OPERATIONS_NAVIGATION}>
      <div className="text-center py-20 italic text-slate-400">No active memos.</div>
    </DepartmentLayout>
  );
}

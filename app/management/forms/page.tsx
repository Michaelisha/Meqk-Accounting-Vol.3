'use client';

import DepartmentLayout from '@/components/department-layout';
import { MANAGEMENT_NAVIGATION } from '@/constants/navigation';

export default function ManagementForms() {
  return (
    <DepartmentLayout theme="management" title="Management Forms" navigation={MANAGEMENT_NAVIGATION}>
      <div className="text-center py-20 italic text-slate-400">
        Select a form to begin entry.
      </div>
    </DepartmentLayout>
  );
}

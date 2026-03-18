'use client';

import DepartmentLayout from '@/components/department-layout';
import { FLEET_NAVIGATION } from '@/constants/navigation';

export default function FleetMemos() {
  return (
    <DepartmentLayout theme="fleet" title="Fleet Memos" navigation={FLEET_NAVIGATION}>
      <div className="text-center py-20 italic text-slate-400">No active memos.</div>
    </DepartmentLayout>
  );
}

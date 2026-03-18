'use client';

import DepartmentLayout from '@/components/department-layout';
import GenericReports from '@/components/generic-reports';
import { MANAGEMENT_NAVIGATION } from '@/constants/navigation';

export default function ManagementReports() {
  return (
    <DepartmentLayout theme="management" title="Overview Reports" navigation={MANAGEMENT_NAVIGATION}>
      <GenericReports title="Management Reports" />
    </DepartmentLayout>
  );
}

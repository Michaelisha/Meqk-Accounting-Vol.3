'use client';

import DepartmentLayout from '@/components/department-layout';
import { FLEET_NAVIGATION } from '@/constants/navigation';

import Link from 'next/link';

export default function FleetForms() {
  return (
    <DepartmentLayout theme="fleet" title="Fleet Forms" navigation={FLEET_NAVIGATION}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/fleet/bus">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Add Bus</h4>
            <p className="text-slate-500 text-sm">Register a new vehicle</p>
          </div>
        </Link>
        <Link href="/fleet/spare">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Add Spare</h4>
            <p className="text-slate-500 text-sm">Add parts to inventory</p>
          </div>
        </Link>
        <Link href="/fleet/requisition">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Spare Requisition</h4>
            <p className="text-slate-500 text-sm">Request parts for maintenance</p>
          </div>
        </Link>
        <Link href="/fleet/licence">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
            <h4 className="font-black text-slate-900 italic mb-2">Add Licence</h4>
            <p className="text-slate-500 text-sm">Update vehicle documentation</p>
          </div>
        </Link>
      </div>
    </DepartmentLayout>
  );
}

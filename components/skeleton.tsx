'use client';

import { motion } from 'motion/react';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white h-32 rounded-[2.5rem] border border-slate-200 shadow-sm" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white h-80 rounded-[2.5rem] border border-slate-200 shadow-sm" />
        <div className="bg-white h-80 rounded-[2.5rem] border border-slate-200 shadow-sm" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="bg-slate-100 h-12 w-full rounded-xl" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-slate-50 h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

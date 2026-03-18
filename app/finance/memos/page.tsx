'use client';

import DepartmentLayout from '@/components/department-layout';
import { FINANCE_NAVIGATION } from '@/constants/navigation';
import { 
  Plus,
  FileText
} from 'lucide-react';

export default function FinanceMemosPage() {
  return (
    <DepartmentLayout theme="finance" title="Department Memos" navigation={FINANCE_NAVIGATION}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 italic">Recent Memos</h3>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
            <Plus className="w-5 h-5" /> NEW MEMO
          </button>
        </div>
        
        <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <p className="text-slate-400 font-bold italic">No active memos for the Finance department.</p>
        </div>
      </div>
    </DepartmentLayout>
  );
}

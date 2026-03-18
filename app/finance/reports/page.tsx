'use client';

import DepartmentLayout from '@/components/department-layout';
import { FINANCE_NAVIGATION } from '@/constants/navigation';
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  Users,
  Bus,
  CreditCard,
  Loader2,
  FileSpreadsheet,
  File as FilePdf
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const TABS = [
  { id: 'invoice', label: 'Invoice Report', view: 'invoice_report' },
  { id: 'trial', label: 'Trial Balance', view: 'trial_balance' },
  { id: 'staff', label: 'Staff Statement', view: 'staff_statement' },
  { id: 'balances', label: 'Staff Balances', view: 'staff_dashboard' },
  { id: 'account', label: 'Account Statement', view: 'account_statement' },
  { id: 'income', label: 'Income Statement', view: 'income_statement' },
  { id: 'bus_income', label: 'Buses Income', view: 'bus_total_income' },
];

export default function FinanceReports() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  
  // Filter data
  const [staffs, setStaffs] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Filter states
  const [filters, setFilters] = useState({
    staff: '',
    bus: '',
    account: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    const fetchFilters = async () => {
      const [st, bs, acc] = await Promise.all([
        supabase.from('staffs').select('uuid,name'),
        supabase.from('buses').select('uuid,reg'),
        supabase.from('accounts').select('uuid,account')
      ]);
      setStaffs(st.data || []);
      setBuses(bs.data || []);
      setAccounts(acc.data || []);
    };
    fetchFilters();
  }, []);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase.from(activeTab.view).select('*');

      if (activeTab.id === 'balances') {
        query = query.order('pending_balance', { ascending: false });
      }

      // Apply filters based on view columns (assuming standard naming)
      if (filters.staff) {
        // Some views might use staff_uuid or staff
        query = query.or(`staff.eq.${filters.staff},staff_uuid.eq.${filters.staff}`);
      }
      if (filters.bus) {
        query = query.or(`bus.eq.${filters.bus},bus_uuid.eq.${filters.bus}`);
      }
      if (filters.account) {
        query = query.or(`account.eq.${filters.account},account_uuid.eq.${filters.account},debit_account.eq.${filters.account},credit_account.eq.${filters.account}`);
      }
      if (filters.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('date', filters.endDate);
      }

      const { data: reportData, error } = await query;
      if (error) throw error;

      // Client-side search filtering
      let filtered = reportData || [];
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(row => 
          Object.values(row).some(val => 
            String(val).toLowerCase().includes(searchLower)
          )
        );
      }

      setData(filtered);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab.label);
    XLSX.writeFile(workbook, `${activeTab.label.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.text(activeTab.label, 14, 15);
    
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows = data.map(row => headers.map(header => String(row[header] || '')));
      
      autoTable(doc, {
        head: [headers.map(h => h.replace(/_/g, ' ').toUpperCase())],
        body: rows,
        startY: 25,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [223, 223, 223], textColor: 0 }
      });
    }
    
    doc.save(`${activeTab.label.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <DepartmentLayout theme="finance" title="Finance Reports" navigation={FINANCE_NAVIGATION}>
      <div className="space-y-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-sm font-black transition-all italic ${
                activeTab.id === tab.id 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Filter className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-black text-slate-900 italic uppercase tracking-tight">Report Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-3 h-3" /> Staff
              </label>
              <select 
                value={filters.staff}
                onChange={(e) => setFilters({...filters, staff: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 italic px-4 py-3"
              >
                <option value="">All Staff</option>
                {staffs.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Bus className="w-3 h-3" /> Bus
              </label>
              <select 
                value={filters.bus}
                onChange={(e) => setFilters({...filters, bus: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 italic px-4 py-3"
              >
                <option value="">All Buses</option>
                {buses.map(b => <option key={b.uuid} value={b.uuid}>{b.reg}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3 h-3" /> Account
              </label>
              <select 
                value={filters.account}
                onChange={(e) => setFilters({...filters, account: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 italic px-4 py-3"
              >
                <option value="">All Accounts</option>
                {accounts.map(a => <option key={a.uuid} value={a.uuid}>{a.account}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Start Date
              </label>
              <input 
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 italic px-4 py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> End Date
              </label>
              <input 
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 italic px-4 py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Search className="w-3 h-3" /> Search
              </label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 italic pl-10 pr-4 py-3"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
            <button 
              onClick={exportToPdf}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all italic"
            >
              <FilePdf className="w-4 h-4" /> Export PDF
            </button>
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-green-50 text-green-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-100 transition-all italic"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Excel
            </button>
            <button 
              onClick={fetchReportData}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all italic"
            >
              <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="font-black italic uppercase tracking-widest text-xs">Loading {activeTab.label}...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-slate-400 gap-4">
              <FileText className="w-12 h-12 opacity-20" />
              <p className="font-black italic uppercase tracking-widest text-xs">No records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {Object.keys(data[0]).map((header) => (
                      <th key={header} className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        {header.replace(/_/g, ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="px-6 py-4 text-sm font-bold text-slate-600 italic whitespace-nowrap">
                          {typeof val === 'number' && !String(val).includes('-') && val > 1000 ? val.toLocaleString() : String(val || '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DepartmentLayout>
  );
}

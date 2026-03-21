'use client';

import { 
  Search, 
  Filter, 
  Download,
  Calendar,
  Bus,
  User,
  Tag,
  FileSpreadsheet,
  FileText,
  Loader2
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface GenericReportsProps {
  title: string;
  viewName: string;
  onDataChange?: (data: any[]) => void;
}

export default function GenericReports({ title, viewName, onDataChange }: GenericReportsProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [busFilter, setBusFilter] = useState('');
  const [staffFilter, setStaffFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // First, get one row to determine available columns
      const { data: sampleData, error: sampleError } = await supabase.from(viewName).select('*').limit(1);
      if (sampleError) throw sampleError;
      
      const availableColumns = sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : [];
      let query = supabase.from(viewName).select('*');

      // Apply filters only if columns exist
      if (searchTerm && availableColumns.length > 0) {
        // Specific columns requested by user + general text columns
        const targetCols = [
          'staff', 'bus', 'route', 'account', 'category', 
          'office', 'driver', 'reference', 'conductor', 'name', 
          'reg', 'bus_reg', 'account_name'
        ];
        
        const textCols = availableColumns.filter(col => {
          const isTarget = targetCols.includes(col.toLowerCase());
          const isText = !col.toLowerCase().includes('uuid') && !col.toLowerCase().includes('_id');
          return isTarget || isText;
        });
        
        if (textCols.length > 0) {
          const orFilter = textCols.map(col => `${col}.ilike.%${searchTerm}%`).join(',');
          query = query.or(orFilter);
        }
      }

      if (busFilter && (availableColumns.includes('bus') || availableColumns.includes('bus_reg'))) {
        const col = availableColumns.includes('bus') ? 'bus' : 'bus_reg';
        query = query.ilike(col, `%${busFilter}%`);
      }

      if (staffFilter) {
        const staffCols = ['staff', 'driver', 'conductor', 'name'].filter(c => availableColumns.includes(c));
        if (staffCols.length > 0) {
          const orFilter = staffCols.map(col => `${col}.ilike.%${staffFilter}%`).join(',');
          query = query.or(orFilter);
        }
      }

      if (accountFilter && (availableColumns.includes('account') || availableColumns.includes('account_name'))) {
        const col = availableColumns.includes('account') ? 'account' : 'account_name';
        query = query.ilike(col, `%${accountFilter}%`);
      }

      if (startDate && availableColumns.includes('date')) {
        query = query.gte('date', startDate);
      }
      if (endDate && availableColumns.includes('date')) {
        query = query.lte('date', endDate);
      }

      // Default limit 100 if no filters/search
      const hasFilters = searchTerm || busFilter || staffFilter || accountFilter || startDate || endDate;
      if (!hasFilters) {
        query = query.limit(100);
      }

      const { data: reportData, error } = await query;
      if (error) throw error;

      setData(reportData || []);
      if (onDataChange) onDataChange(reportData || []);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  }, [viewName, searchTerm, busFilter, staffFilter, accountFilter, startDate, endDate, onDataChange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateTotals = () => {
    if (data.length === 0) return {};
    const numericCols = Object.keys(data[0]).filter(key => typeof data[0][key] === 'number');
    const totals: any = {};
    numericCols.forEach(col => {
      totals[col] = data.reduce((sum, row) => sum + (row[col] || 0), 0);
    });
    return totals;
  };

  const exportExcel = () => {
    const totals = calculateTotals();
    const exportData = [...data];
    if (Object.keys(totals).length > 0) {
      const totalsRow: any = { [Object.keys(data[0])[0]]: 'TOTALS' };
      Object.keys(totals).forEach(key => totalsRow[key] = totals[key]);
      exportData.push(totalsRow);
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const totals = calculateTotals();
    
    doc.text(title, 14, 15);
    
    const headers = Object.keys(data[0]).map(h => h.replace(/_/g, ' ').toUpperCase());
    const rows = data.map(row => Object.values(row).map(v => String(v || '-')));
    
    if (Object.keys(totals).length > 0) {
      const totalsRow = Object.keys(data[0]).map(key => {
        if (totals[key] !== undefined) return String(totals[key].toLocaleString());
        if (key === Object.keys(data[0])[0]) return 'TOTALS';
        return '';
      });
      rows.push(totalsRow);
    }

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
      footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' }
    });

    doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search text columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="relative">
              <Bus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Bus Reg..."
                value={busFilter}
                onChange={(e) => setBusFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Staff Name..."
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Account..."
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={exportExcel}
                className="flex-1 bg-emerald-600 text-white font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
              >
                <FileSpreadsheet className="w-5 h-5" /> EXCEL
              </button>
              <button 
                onClick={exportPDF}
                className="flex-1 bg-rose-600 text-white font-black rounded-2xl py-3.5 flex items-center justify-center gap-2 hover:bg-rose-700 transition-all"
              >
                <FileText className="w-5 h-5" /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-slate-400 italic">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              Loading {title}...
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center text-slate-400 italic">No records found</div>
          ) : (
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
                {/* Totals Row */}
                {Object.keys(totals).length > 0 && (
                  <tr className="bg-slate-50 font-black border-t-2 border-slate-200">
                    {Object.keys(data[0]).map((key, i) => (
                      <td key={i} className="px-6 py-5 text-sm text-slate-900 italic whitespace-nowrap">
                        {i === 0 ? 'TOTALS' : (totals[key] !== undefined ? totals[key].toLocaleString() : '')}
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

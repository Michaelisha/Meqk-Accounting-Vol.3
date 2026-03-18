'use client';

import DepartmentLayout from '@/components/department-layout';
import { FINANCE_NAVIGATION } from '@/constants/navigation';
import { 
  Save,
  Loader2,
  Plus,
  Trash2,
  Upload,
  FileSpreadsheet
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';

export default function AddInvoicePage() {
  const [loading, setLoading] = useState(false);
  const [invoiceTypes, setInvoiceTypes] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [lines, setLines] = useState([
    { date: new Date().toISOString().split('T')[0], invoice_type: '', staff: '', bus: '', route: '', amount: 0 }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        { data: types },
        { data: stf },
        { data: bs },
        { data: rt }
      ] = await Promise.all([
        supabase.from('invoice_types').select('uuid,invoice_type'),
        supabase.from('staffs').select('uuid,name'),
        supabase.from('buses').select('uuid,reg'),
        supabase.from('routes').select('uuid,route')
      ]);

      setInvoiceTypes(types || []);
      setStaff(stf || []);
      setBuses(bs || []);
      setRoutes(rt || []);
    };
    fetchData();
  }, []);

  const excelDateToJSDate = (serial: any) => {
    if (!serial) return null;
    if (typeof serial === "string") return serial;
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date = new Date(utc_value * 1000);
    return date.toISOString().split("T")[0];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setLoading(true);
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelRows = XLSX.utils.sheet_to_json(worksheet);

        console.log("RAW:", excelRows);

        const [staffsRes, busesRes, routesRes, invoiceTypesRes] = await Promise.all([
          supabase.from("staffs").select("uuid,name"),
          supabase.from("buses").select("uuid,reg"),
          supabase.from("routes").select("uuid,route"),
          supabase.from("invoice_types").select("uuid,invoice_type"),
        ]);

        const staffs = staffsRes.data || [];
        const buses = busesRes.data || [];
        const routes = routesRes.data || [];
        const invoiceTypes = invoiceTypesRes.data || [];

        let mappedData = [];
        try {
          mappedData = excelRows.map((row: any) => ({
            date: excelDateToJSDate(row.date),
            invoice_type: invoiceTypes.find(i => i.invoice_type === row.invoice_type)?.uuid || null,
            staff: staffs.find(s => s.name === row.staff)?.uuid || null,
            bus: buses.find(b => b.reg === row.bus)?.uuid || null,
            route: routes.find(r => r.route === row.route)?.uuid || null,
            amount: Number(row.amount || 0),
          }));
        } catch (err) {
          console.error("Mapping error:", err);
          alert("Error processing Excel file.");
          return;
        }

        console.log("MAPPED:", mappedData);

        const cleanData = mappedData.filter((row: any) =>
          row.date &&
          row.invoice_type &&
          row.staff &&
          row.bus &&
          row.route &&
          row.amount > 0
        );

        console.log("CLEAN:", cleanData);

        if (cleanData.length === 0) {
          alert("No valid data found. Check Excel names and format.");
          return;
        }

        const { error } = await supabase.from("invoice_entry").insert(cleanData);

        if (error) {
          console.error(error);
          alert("Error saving data.");
          return;
        }

        alert("Excel uploaded successfully!");
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        console.error(err);
        alert("Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const addLine = () => {
    setLines([...lines, { 
      date: new Date().toISOString().split('T')[0], 
      invoice_type: '', 
      staff: '', 
      bus: '', 
      route: '', 
      amount: 0 
    }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    (newLines[index] as any)[field] = value;
    setLines(newLines);
  };

  const totalAmount = lines.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const entries = lines.map(line => ({
        date: line.date,
        invoice_type: line.invoice_type || null,
        staff: line.staff || null,
        bus: line.bus || null,
        route: line.route || null,
        amount: Number(line.amount)
      }));

      const { error } = await supabase.from('invoice_entry').insert(entries);

      if (error) throw error;

      setLines([{ 
        date: new Date().toISOString().split('T')[0], 
        invoice_type: '', 
        staff: '', 
        bus: '', 
        route: '', 
        amount: 0 
      }]);
      alert('Invoices saved successfully!');
    } catch (error: any) {
      console.error('Error saving invoices:', error);
      alert('Error saving invoices: ' + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DepartmentLayout theme="finance" title="Add Invoice Entry" navigation={FINANCE_NAVIGATION}>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 italic">Invoice Lines</h3>
              <div className="flex items-center gap-3">
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-all text-xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" /> Upload Excel
                </button>
                <button 
                  type="button"
                  onClick={addLine}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" /> Add Line
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Type</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Staff</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bus</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {lines.map((line, index) => (
                    <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-2 py-4">
                        <input 
                          type="date"
                          value={line.date}
                          onChange={(e) => updateLine(index, 'date', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          required
                        />
                      </td>
                      <td className="px-2 py-4">
                        <select 
                          value={line.invoice_type}
                          onChange={(e) => updateLine(index, 'invoice_type', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          required
                        >
                          <option value="">Select Type</option>
                          {invoiceTypes.map(t => <option key={t.uuid} value={t.uuid}>{t.invoice_type}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4">
                        <select 
                          value={line.staff}
                          onChange={(e) => updateLine(index, 'staff', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          required
                        >
                          <option value="">Select Staff</option>
                          {staff.map(s => <option key={s.uuid} value={s.uuid}>{s.name}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4">
                        <select 
                          value={line.bus}
                          onChange={(e) => updateLine(index, 'bus', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          required
                        >
                          <option value="">Select Bus</option>
                          {buses.map(b => <option key={b.uuid} value={b.uuid}>{b.reg}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4">
                        <select 
                          value={line.route}
                          onChange={(e) => updateLine(index, 'route', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          required
                        >
                          <option value="">Select Route</option>
                          {routes.map(r => <option key={r.uuid} value={r.uuid}>{r.route}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-4">
                        <input 
                          type="number"
                          value={line.amount}
                          onChange={(e) => updateLine(index, 'amount', e.target.value)}
                          className="w-[140px] max-w-[160px] px-2 py-1 bg-transparent border-none text-sm font-bold focus:ring-0 italic"
                          placeholder="0"
                          required
                        />
                      </td>
                      <td className="px-2 py-4">
                        <button 
                          type="button"
                          onClick={() => removeLine(index)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm sticky top-28">
            <h3 className="text-xl font-black text-slate-900 italic mb-6">Summary</h3>
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center mb-8">
              <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">Total Amount</p>
              <h4 className="text-2xl font-black text-blue-900 italic">
                TZS {totalAmount.toLocaleString()}
              </h4>
            </div>

            <button 
              type="button"
              onClick={handleSubmit}
              disabled={loading || lines.length === 0}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> SAVE INVOICES</>}
            </button>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}

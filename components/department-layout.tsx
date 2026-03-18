'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LogOut, 
  ChevronLeft,
  LayoutDashboard,
  Building2
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DepartmentLayoutProps {
  children: React.ReactNode;
  theme: 'management' | 'finance' | 'operations' | 'hr' | 'fleet';
  title: string;
  navigation: { name: string; path: string; icon: any }[];
}

const themeStyles = {
  management: 'bg-yellow-500 text-slate-950 border-yellow-600/20',
  finance: 'bg-blue-500 text-white border-blue-600/20',
  operations: 'bg-green-600 text-white border-green-700/20',
  hr: 'bg-orange-600 text-white border-orange-700/20',
  fleet: 'bg-purple-600 text-white border-purple-700/20',
};

const themeColors = {
  management: 'text-yellow-600 bg-yellow-50',
  finance: 'text-blue-600 bg-blue-50',
  operations: 'text-green-600 bg-green-50',
  hr: 'text-orange-600 bg-orange-50',
  fleet: 'text-purple-600 bg-purple-50',
};

export default function DepartmentLayout({ children, theme, title, navigation }: DepartmentLayoutProps) {
  const { company, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100">
          <Link href="/departments" className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Modules</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", themeColors[theme])}>
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-slate-900 italic leading-tight">MEQK ERP</h1>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Accounting Vol.3</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all group",
                  isActive 
                    ? cn(themeColors[theme], "shadow-sm")
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive ? themeColors[theme] : "text-slate-400 group-hover:text-slate-900")} />
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${themeStyles[theme]} shadow-sm`}>
              {navigation[0] && (() => {
                const Icon = navigation[0].icon;
                return <Icon className="w-5 h-5" />;
              })()}
            </div>
            <div>
              <h2 className="font-bold text-slate-900">{title}</h2>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                <Building2 className="w-3 h-3" />
                {company?.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 italic">Administrator</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Session</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
              A
            </div>
          </div>
        </header>

        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

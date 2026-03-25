'use client';

import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  LogOut, 
  ChevronLeft,
  LayoutDashboard,
  Building2,
  Menu,
  X
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

const moduleThemes = {
  management: 'bg-[#FFF8E1]',
  finance: 'bg-[#E3F2FD]',
  operations: 'bg-[#E8F5E9]',
  hr: 'bg-[#FFF3E0]',
  fleet: 'bg-[#F3E5F5]',
};

export default function DepartmentLayout({ children, theme, title, navigation }: DepartmentLayoutProps) {
  const { user, userData, userRole } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen transition-all duration-300 z-50",
        collapsed ? "w-20" : "w-72"
      )}>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <Link href="/departments" className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Back</span>
              </Link>
            )}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
            >
              {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", themeColors[theme])}>
              <LayoutDashboard className="w-6 h-6" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-black text-slate-900 italic leading-tight truncate">MEQK ERP</h1>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter truncate">Accounting Vol.3</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all group",
                  isActive 
                    ? cn(themeColors[theme], "shadow-sm")
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  collapsed && "justify-center px-0"
                )}>
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? themeColors[theme] : "text-slate-400 group-hover:text-slate-900")} />
                  {!collapsed && <span className="text-sm truncate">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
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
                Meqk ERP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <h3 className="text-xs font-bold text-slate-900 italic">{userData?.name || 'User'}</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">{userRole || 'Active Session'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold uppercase">
              {userData?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        <div className={cn("min-h-screen p-6", moduleThemes[theme])}>
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

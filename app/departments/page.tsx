'use client';

import { useAuth, ROLE_MAP } from '@/hooks/use-auth';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  Bus, 
  Users, 
  Truck,
  ChevronRight
} from 'lucide-react';

const departments = [
  {
    id: 'management',
    name: 'Management',
    icon: ShieldCheck,
    color: 'from-yellow-500 to-yellow-700',
    description: 'Executive oversight and strategic planning',
    path: '/management'
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: Wallet,
    color: 'from-blue-400 to-blue-600',
    description: 'Accounting, invoices and cash flow',
    path: '/finance'
  },
  {
    id: 'operations',
    name: 'Operations',
    icon: Bus,
    color: 'from-green-500 to-green-700',
    description: 'Daily bus routes and scheduling',
    path: '/operations'
  },
  {
    id: 'hr',
    name: 'HR',
    icon: Users,
    color: 'from-orange-500 to-orange-700',
    description: 'Staff management and payroll',
    path: '/hr'
  },
  {
    id: 'fleet',
    name: 'Fleet',
    icon: Truck,
    color: 'from-purple-500 to-purple-700',
    description: 'Vehicle maintenance and spares',
    path: '/fleet'
  }
];

export default function DepartmentSelector() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">
        Loading...
      </div>
    </div>
  );

  if (!user) return null;

  const allowedModuleIds = userRole ? ROLE_MAP[userRole] || [] : [];
  const visibleDepartments = departments.filter(dept => allowedModuleIds.includes(dept.id));

  // Debug logs
  console.log("USER ROLE:", userRole);
  console.log("VISIBLE MODULES:", visibleDepartments);

  if (visibleDepartments.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-2 italic">No Modules Found</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
            Contact administrator for access
          </p>
        </div>
      </div>
    );
  }

  if (visibleDepartments.length === 1) {
    const dept = visibleDepartments[0];
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-8">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Link href={dept.path}>
              <div className="group bg-white p-12 rounded-[3rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-all flex flex-col items-center text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${dept.color}`} />
                
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
                  <dept.icon className="w-12 h-12" />
                </div>

                <h3 className="text-3xl font-black text-slate-900 mb-4 italic">
                  {dept.name}
                </h3>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  {dept.description}
                </p>

                <div className="mt-10 flex items-center gap-3 text-slate-400 group-hover:text-slate-900 transition-colors font-black text-sm uppercase tracking-widest">
                  Enter Module <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-2 italic">
            Meqk ERP
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
            Select Department Module
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {visibleDepartments.map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={dept.path}>
                <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-transparent transition-all h-full flex flex-col items-center text-center relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${dept.color}`} />
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <dept.icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2 italic">
                    {dept.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-slate-400 group-hover:text-slate-900 transition-colors font-black text-xs uppercase tracking-widest">
                    Enter Module <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

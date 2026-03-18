import { 
  LayoutDashboard, 
  PlusCircle, 
  Coins, 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  PieChart,
  Building2,
  MapPin,
  CalendarDays,
  Users,
  Bus,
  FileCheck,
  Wrench,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  UserPlus,
  Fuel
} from 'lucide-react';

export const MANAGEMENT_NAVIGATION = [
  { name: 'Dashboard', path: '/management', icon: LayoutDashboard },
  { name: 'Reports', path: '/management/reports', icon: PieChart },
];

export const FINANCE_NAVIGATION = [
  { name: 'Dashboard', path: '/finance', icon: LayoutDashboard },
  { name: 'Add Invoice', path: '/finance/invoice', icon: PlusCircle },
  { name: 'Add Cash', path: '/finance/cash', icon: Coins },
  { name: 'Journal Entries', path: '/finance/journal', icon: BookOpen },
  { name: 'Reports', path: '/finance/reports', icon: PieChart },
];

export const OPERATIONS_NAVIGATION = [
  { name: 'Dashboard', path: '/operations', icon: LayoutDashboard },
  { name: 'Add Office', path: '/operations/office', icon: Building2 },
  { name: 'Office Rent', path: '/operations/office-rent', icon: MapPin },
  { name: 'Daily Bus', path: '/operations/daily-bus', icon: CalendarDays },
  { name: 'Reports', path: '/operations/reports', icon: PieChart },
];

export const HR_NAVIGATION = [
  { name: 'Dashboard', path: '/hr', icon: LayoutDashboard },
  { name: 'Add Staff', path: '/hr/staff', icon: UserPlus },
  { name: 'Salary Entry', path: '/hr/salary', icon: CreditCard },
  { name: 'Reports', path: '/hr/reports', icon: PieChart },
];

export const FLEET_NAVIGATION = [
  { name: 'Dashboard', path: '/fleet', icon: LayoutDashboard },
  { name: 'Add Bus', path: '/fleet/bus', icon: Bus },
  { name: 'Add Licence', path: '/fleet/licence', icon: FileCheck },
  { name: 'Add Spare', path: '/fleet/spare', icon: Wrench },
  { name: 'Spare Requisition', path: '/fleet/requisition', icon: ClipboardList },
  { name: 'Diesel', path: '/fleet/diesel', icon: Fuel },
  { name: 'Reports', path: '/fleet/reports', icon: PieChart },
];

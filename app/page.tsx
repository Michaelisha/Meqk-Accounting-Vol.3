import { redirect } from 'next/navigation';

export default function RootPage() {
  // Simple redirect to login or departments
  // In a real app we'd check session here
  redirect('/login');
}

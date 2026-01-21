'use client';

import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }) {
  const { user } = useAuth();

  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/');

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6">
        <nav className="space-y-4">
          <a href="/dashboard" className="block">Dashboard</a>
          <a href="/dashboard/users" className="block">Users</a>
          <a href="/dashboard/articles" className="block">Articles</a>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}

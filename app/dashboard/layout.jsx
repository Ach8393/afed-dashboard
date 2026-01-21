'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // If token does NOT exist → redirect to login
    if (!token) {
      router.push('/login');
    } else {
      setIsAuth(true);
    }
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem('token'); // remove JWT
    router.push('/login');            // redirect
  };

  if (!isAuth) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="space-y-4">
            <a href="/dashboard" className="block hover:text-gray-300">Dashboard</a>
            <a href="/dashboard/users" className="block hover:text-gray-300">Users</a>
            <a href="/dashboard/articles" className="block hover:text-gray-300">Expérience professionnelle</a>
            <a href="/dashboard/reviews" className="block hover:text-gray-300">Reviews</a>

            {/* ✅ NEW PROJECTS LINK ADDED */}
            <a href="/dashboard/projects" className="block hover:text-gray-300">Projects</a>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}

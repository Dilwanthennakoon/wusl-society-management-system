'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [adminName, setAdminName] = useState<string>('Admin');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Get admin name from localStorage
    const name = localStorage.getItem('adminName');
    if (name) {
      setAdminName(name);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');

    // Redirect to login
    router.push('/login');
  };

  const getInitial = () => {
    return adminName.charAt(0).toUpperCase();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          Society Management System
        </h2>
        <p className="text-sm text-gray-500">
          University Society Administration Dashboard
        </p>
      </div>

      <div className="flex items-center gap-3 relative">
        <span className="text-sm text-gray-600">{adminName}</span>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 transition cursor-pointer"
        >
          {getInitial()}
        </button>

        {showMenu && (
          <div className="absolute right-0 top-12 bg-white rounded-lg shadow-md border border-gray-200 min-w-[150px] z-10">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

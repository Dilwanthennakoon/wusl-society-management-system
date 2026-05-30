'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('[LOGIN PAGE] Submitting login form with email:', email);
      
      // Create an AbortController with 20 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('[LOGIN PAGE] API Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('[LOGIN PAGE] Failed to parse response JSON:', parseError);
        setError('Server returned an invalid response');
        setIsLoading(false);
        return;
      }
      
      console.log('[LOGIN PAGE] API Response data:', data);

      if (!response.ok) {
        const errorMsg = data.message || `Login failed (${response.status}). Please try again.`;
        console.log('[LOGIN PAGE] Login error response:', errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      console.log('[LOGIN PAGE] Login successful, storing credentials');
      // Store token and admin info in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('adminId', String(data.adminId));
      localStorage.setItem('adminName', data.adminName);
      localStorage.setItem('adminRole', data.adminRole);

      console.log('[LOGIN PAGE] Redirecting to dashboard');
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('[LOGIN PAGE] Catch error:', err);
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(`An error occurred: ${err.message || 'Unknown error'}. Please try again.`);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SMS</h1>
          </div>
          <p className="text-gray-500">Society Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Admin Login</h2>

          {/* Error Message Area */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@university.edu"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-slate-900 hover:text-slate-700 font-medium transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <div className="text-center text-sm text-gray-500">
          <p>Secure admin access for university society management</p>
        </div>
      </div>
    </div>
  );
}

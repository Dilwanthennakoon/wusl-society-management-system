'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset</h1>
          <p className="text-gray-500">We'll help you reset your password</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Please contact your administrator to reset your password or use the login credentials provided during setup.
            </p>
            <Link
              href="/login"
              className="inline-block bg-slate-900 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-800 transition"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, isAuthenticated, loading, error, clearError, isAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    // Redirect if already authenticated as admin
    if (isAuthenticated && isAdmin()) {
      navigate('/admin');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!email || !password) {
      setLocalError('Please enter your email and password');
      return;
    }
    
    const result = await adminLogin({ email, password });
    if (result?.success) {
      navigate('/admin');
    }
  };

  const handleFieldChange = (setter) => (e) => {
    if (error) clearError();
    setLocalError('');
    setter(e.target.value);
  };

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 py-12 w-full">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Access</h1>
          <p className="mt-2 text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        {(localError || error) && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {localError || error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleFieldChange(setEmail)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none ring-red-500/20 focus:border-red-500 focus:ring-4 transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={handleFieldChange(setPassword)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none ring-red-500/20 focus:border-red-500 focus:ring-4 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-80 transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign in to Admin Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to="/login" 
            className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4 transition-colors"
          >
            ← Back to user login
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-4 transition-colors"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin; 
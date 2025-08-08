import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin, isAuthenticated, loading, error, clearError, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin');
    }
  }, [isAuthenticated, user, navigate]);

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
    <section className="relative min-h-[80svh] w-full">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Sign in</h1>
          <p className="mt-2 text-gray-600">Access the admin dashboard</p>
        </div>

        {(localError || error) && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-6 shadow-soft">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleFieldChange(setEmail)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="admin@wanderlust.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={handleFieldChange(setPassword)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white shadow hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/30 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-700">
          Not an admin?{' '}
          <Link to="/login" className="font-medium text-primary-700 hover:text-primary-800">
            Go to user login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin; 
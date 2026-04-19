import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && user?.is_superuser) {
      navigate('/admin');
    } else if (isAuthenticated && !user?.is_superuser) {
      setError('You must be an admin to access this page');
    }
  }, [isAuthenticated, user, navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      // Check if user is admin
      const user = result.user;
      if (user.is_superuser) {
        navigate('/admin');
      } else {
        setError('You must be an admin to access this page');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-900 flex flex-col items-center justify-center px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-white hover:text-gray-200 transition"
      >
        ← Back to Home
      </button>

      {/* Logo */}
      <div className="mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <Logo clickable={true} />
      </div>

      {/* Admin Login Heading */}
      <h1 className="text-5xl font-bold text-white mb-3 text-center">ADMIN LOGIN</h1>
      <p className="text-lg text-gray-100 mb-10 text-center">
        Staff only access
      </p>

      {/* Login Form */}
      <form onSubmit={handleAdminLogin} className="w-full max-w-sm bg-white bg-opacity-10 backdrop-blur rounded-lg p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Email Input */}
        <div className="mb-6">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="Enter your admin email"
          />
        </div>

        {/* Password Input */}
        <div className="mb-8">
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Enter your password"
          />
        </div>

        {/* Login Button */}
        <div className="flex justify-center">
          <Button type="submit" variant="secondary" disabled={isLoading}>
            {isLoading ? 'LOGGING IN...' : 'LOGIN AS ADMIN'}
          </Button>
        </div>
      </form>

      {/* Footer */}
      <p className="mt-12 text-gray-200 text-sm text-center">
        © 2026 White Hat Coffee. All rights reserved.
      </p>
    </div>
  );
}

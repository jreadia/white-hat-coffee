import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/menu');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // TODO: Replace with actual API call once backend is ready
    // const result = await login(email, password);
    // if (result.success) {
    //   navigate('/menu');
    // } else {
    //   setError(result.error);
    // }

    // For now, simulate login for testing
    console.log('Login attempt:', { email, password });
    alert('Backend API not connected yet. For testing, navigate to /menu');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-900 flex flex-col items-center justify-center px-4">
      {/* Back to Home Button */}
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

      {/* Welcome Section */}
      <h1 className="text-5xl font-bold text-white mb-3 text-center">WELCOME</h1>
      <p className="text-lg text-gray-100 mb-10 text-center">
        start your day right with <span className="font-semibold">White Hat.</span>
      </p>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white bg-opacity-10 backdrop-blur rounded-lg p-8">
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
            placeholder="Enter your email"
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

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Button type="submit" variant="secondary" disabled={isLoading}>
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleSignUp} disabled={isLoading}>
            SIGN UP
          </Button>
        </div>
      </form>

      {/* Backend Note */}
      <div className="mt-8 max-w-sm p-3 bg-blue-300 bg-opacity-20 border border-blue-200 rounded text-blue-100 text-xs text-center">
        <strong>🔐 Note:</strong> Login API integration pending. Use backend credentials once API is ready.
      </div>

      {/* Footer */}
      <p className="mt-12 text-gray-200 text-sm text-center">
        © 2026 White Hat Coffee. All rights reserved.
      </p>
    </div>
  );
}
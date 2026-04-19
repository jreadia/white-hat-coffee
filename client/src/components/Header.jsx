import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center flex-1">
          <div onClick={() => navigate('/')} className="cursor-pointer mb-2">
            <Logo white={true} />
          </div>
          <p className="text-gray-700 text-sm text-center">
            start your day right with <span className="font-semibold">White Hat.</span>
          </p>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/login')}
            className="px-6 py-2"
          >
            Login
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate('/signup')}
            className="px-6 py-2"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
}

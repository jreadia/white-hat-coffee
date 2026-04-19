import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  disabled = false,
  className = ''
}) {
  const baseStyles = 'px-6 py-2 font-semibold rounded transition duration-300';
  
  const variants = {
    primary: 'bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-50',
    secondary: 'border-2 border-white text-white hover:bg-white hover:text-teal-700',
    outline: 'border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-yellow-100',
    dark: 'bg-amber-900 text-white border-2 border-white hover:bg-white hover:text-amber-900',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

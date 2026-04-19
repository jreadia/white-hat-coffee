import React from 'react';

export default function FormInput({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  error,
  required = false
}) {
  return (
    <div>
      {label && (
        <label className="block text-white font-semibold mb-2">
          {label} {required && <span className="text-red-300">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-md bg-gray-300 bg-opacity-80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
      />
      {error && <p className="text-red-300 text-sm mt-1">{error}</p>}
    </div>
  );
}

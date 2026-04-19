import React from 'react';

export default function FormTextarea({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder,
  error,
  rows = 6,
  required = false
}) {
  return (
    <div>
      {label && (
        <label className="block text-gray-800 font-semibold mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-md border-2 border-gray-400 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-700"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

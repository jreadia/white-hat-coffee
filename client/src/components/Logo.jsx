import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logo({ clickable = false, white = false }) {
  const navigate = useNavigate();
  const bgColor = white ? 'bg-white' : 'bg-teal-700';

  const handleClick = () => {
    if (clickable) navigate('/');
  };

  return (
    <div 
      className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center shadow-lg ${clickable ? 'cursor-pointer hover:scale-110 transition' : ''}`}
      onClick={handleClick}
    >
      <img
        src="/assets/logos/white-hat-logo.png"
        alt="White Hat Coffee"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
}

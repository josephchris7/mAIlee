
import React from "react";

interface AiviaLogoProps {
  className?: string;
}

const AiviaLogo: React.FC<AiviaLogoProps> = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M50 5.77356L5.77356 50L50 94.2264L94.2264 50L50 5.77356Z" 
          fill="#9B7AFF" 
          stroke="#845EF7" 
          strokeWidth="2"
        />
        <path 
          d="M50 25.7736L25.7736 50L50 74.2264L74.2264 50L50 25.7736Z" 
          fill="#6741D9" 
          stroke="#845EF7" 
          strokeWidth="2"
        />
        <path 
          d="M50 40.7736L40.7736 50L50 59.2264L59.2264 50L50 40.7736Z" 
          fill="#F3F0FF" 
          stroke="#845EF7" 
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default AiviaLogo;

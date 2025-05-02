
import React from "react";

interface AiviaLogoProps {
  className?: string;
}

const AiviaLogo: React.FC<AiviaLogoProps> = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <img 
        src="/lovable-uploads/c79b5477-9051-4506-b382-fec1d0438594.png" 
        alt="AIVIA Logo" 
        className="h-full w-auto object-contain"
      />
    </div>
  );
};

export default AiviaLogo;


import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <img 
      src="/lovable-uploads/6da7481a-e08c-407a-b625-de541596b2dc.png" 
      alt="書籤管理套件" 
      className={className}
    />
  );
};

export default Logo;

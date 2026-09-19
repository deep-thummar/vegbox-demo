import React from "react";
import logoImage from "../../assets/images/vegbox-logo.jpeg";

interface LogoProps {
  className?: string;
  alt?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  alt = "VegBox",
}) => (
  <img src={logoImage} alt={alt} className={`object-contain ${className}`} />
);

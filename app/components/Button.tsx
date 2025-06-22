"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  rounded?: "default" | "full";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  fullWidth = false,
  disabled = false,
  variant = "primary",
  size = "md",
  rounded = "default",
  className = "",
}) => {
  const baseStyles = "font-medium transition-all duration-250 transform hover:scale-[1.02] active:scale-[0.98] shadow-button focus:outline-none";
  
  const sizeStyles = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-5",
    lg: "py-4 px-6 text-lg",
  };
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-youapp-gradient-purple-from to-youapp-gradient-purple-to text-youapp-text-primary hover:opacity-90 hover:shadow-hover",
    secondary: "bg-gradient-to-r from-youapp-gradient-blue-from to-youapp-gradient-blue-to text-youapp-text-primary hover:opacity-90 hover:shadow-hover",
    outline: "bg-transparent border-2 border-youapp-primary text-youapp-primary hover:bg-youapp-primary/10",
  };
  
  const roundedStyles = {
    default: "rounded-3xl",
    full: "rounded-full",
  };
  
  const widthStyle = fullWidth ? "w-full" : "";
  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${roundedStyles[rounded]} ${widthStyle} ${disabledStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

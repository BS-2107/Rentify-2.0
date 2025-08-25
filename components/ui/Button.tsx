import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-1';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-accent to-dark text-white hover:shadow-2xl focus:ring-accent/50 shadow-lg hover:shadow-accent/25',
    secondary: 'bg-white/90 border-2 border-accent text-accent hover:bg-accent hover:text-white hover:shadow-xl focus:ring-accent/50 shadow-lg backdrop-blur-sm',
    ghost: 'text-dark hover:bg-white/50 focus:ring-gray-200 backdrop-blur-sm'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
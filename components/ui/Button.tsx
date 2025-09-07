import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  icon,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-1 relative overflow-hidden group active:scale-95';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-accent via-accent-light to-accent-bright text-white hover:shadow-2xl focus:ring-accent/50 shadow-lg hover:shadow-accent/25 border border-accent/20',
    secondary: 'bg-gray-50/90 border-2 border-accent text-accent hover:bg-accent hover:text-white hover:shadow-xl focus:ring-accent/50 shadow-lg backdrop-blur-sm',
    ghost: 'text-dark hover:bg-gray-100/50 focus:ring-gray-200 backdrop-blur-sm border border-transparent hover:border-accent/20',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-2xl focus:ring-green-500/50 shadow-lg hover:shadow-green-500/25',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-2xl focus:ring-yellow-500/50 shadow-lg hover:shadow-yellow-500/25',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-2xl focus:ring-red-500/50 shadow-lg hover:shadow-red-500/25'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
    xl: 'px-10 py-5 text-xl gap-3'
  };

  const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex items-center justify-center gap-inherit">
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
        )}
        {!loading && icon && icon}
        <span className={loading ? 'opacity-70' : ''}>{children}</span>
      </div>
    </button>
  );
};
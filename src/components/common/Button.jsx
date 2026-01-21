import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ...props 
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/30',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-8 py-5 text-base',
    lg: 'px-10 py-6 text-xl'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${className}
        rounded-3xl font-black uppercase tracking-widest
        transition-all active:scale-95
        disabled:opacity-30 disabled:cursor-not-allowed
        flex items-center justify-center space-x-3
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
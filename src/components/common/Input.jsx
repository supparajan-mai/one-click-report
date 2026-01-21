import React from 'react';

/**
 * Input Component
 * Text input field พร้อม label
 */
export const Input = ({ 
  label, 
  type = 'text',
  value, 
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  icon: Icon,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon 
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" 
            size={20} 
          />
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full p-6 bg-slate-50 border-none rounded-3xl font-black shadow-inner outline-none 
            focus:ring-4 focus:ring-blue-100 transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-14' : ''}
            text-lg
          `}
        />
      </div>
    </div>
  );
};

/**
 * Textarea Component
 */
export const Textarea = ({ 
  label, 
  value, 
  onChange,
  placeholder = '',
  rows = 4,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full p-8 bg-slate-50 border-none rounded-[2.5rem] font-black shadow-inner outline-none focus:ring-4 focus:ring-blue-100 transition-all resize-none"
      />
    </div>
  );
};

/**
 * Select Component
 */
export const Select = ({ 
  label, 
  value, 
  onChange,
  options = [],
  placeholder = 'เลือก...',
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-6 bg-slate-50 border-none rounded-3xl font-black shadow-inner outline-none focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer appearance-none text-lg"
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option 
            key={typeof option === 'string' ? option : option.value} 
            value={typeof option === 'string' ? option : option.value}
          >
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * Checkbox Component
 */
export const Checkbox = ({ 
  label, 
  checked, 
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <label className={`flex items-center space-x-4 cursor-pointer group ${className}`}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        disabled={disabled}
        className="w-6 h-6 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
      />
      <span className="font-black text-lg text-slate-700 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </label>
  );
};

/**
 * Radio Group Component
 */
export const RadioGroup = ({ 
  label,
  options = [],
  value,
  onChange,
  name,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">
          {label}
        </label>
      )}
      
      <div className="flex gap-6 px-4">
        {options.map(option => (
          <label 
            key={typeof option === 'string' ? option : option.value}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <input 
              type="radio" 
              name={name}
              value={typeof option === 'string' ? option : option.value}
              checked={value === (typeof option === 'string' ? option : option.value)}
              onChange={onChange}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer" 
            />
            <span className="font-black text-base text-slate-700 group-hover:text-slate-900 transition-colors">
              {typeof option === 'string' ? option : option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Input;
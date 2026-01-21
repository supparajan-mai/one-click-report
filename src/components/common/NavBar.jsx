import React from 'react';
import { ArrowLeft, BarChart3, Search } from 'lucide-react';

/**
 * Navbar Component
 * Navigation bar ด้านบนสำหรับทุกหน้า
 * 
 * @param {string} title - ชื่อหน้า
 * @param {string} subtitle - คำอธิบายเพิ่มเติม
 * @param {function} onBack - callback เมื่อกดปุ่มย้อนกลับ
 * @param {string} badge - ข้อความ badge (D/P/SURAT)
 * @param {string} badgeColor - สี badge
 * @param {array} actions - ปุ่ม actions เพิ่มเติม
 */
const Navbar = ({ 
  title, 
  subtitle,
  onBack, 
  badge,
  badgeColor = 'blue',
  actions = []
}) => {
  const badgeColors = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-600',
    purple: 'bg-purple-600',
    slate: 'bg-slate-900',
    indigo: 'bg-indigo-600'
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-8 h-20 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors"
            aria-label="ย้อนกลับ"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        
        <div>
          <h2 className="font-black text-xl tracking-tight text-slate-800">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1 italic text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Actions */}
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-2 rounded-xl transition-all ${action.className || 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
            title={action.title}
          >
            {action.icon}
          </button>
        ))}

        {/* Badge */}
        {badge && (
          <div className={`w-10 h-10 ${badgeColors[badgeColor] || badgeColors.blue} rounded-2xl flex items-center justify-center text-white font-black shadow-lg uppercase text-xs`}>
            {badge}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
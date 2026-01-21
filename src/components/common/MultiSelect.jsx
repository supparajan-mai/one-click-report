import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * MultiSelect Component
 * Dropdown ที่เลือกได้หลายตัว พร้อม checkbox
 * 
 * @param {string} label - ข้อความ label
 * @param {array} options - รายการตัวเลือก
 * @param {array} selected - รายการที่เลือกแล้ว
 * @param {function} onChange - callback เมื่อเปลี่ยนการเลือก
 * @param {string} placeholder - ข้อความเมื่อไม่มีการเลือก
 */
const MultiSelect = ({ 
  label, 
  options, 
  selected, 
  onChange,
  placeholder = "ทั้งหมด"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className="relative space-y-1">
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center cursor-pointer hover:border-blue-400 transition-all text-xs font-bold shadow-sm"
      >
        <span className="truncate">
          {selected.length === 0 
            ? placeholder 
            : `เลือกแล้ว ${selected.length} รายการ`
          }
        </span>
        <div className="flex items-center space-x-2">
          {selected.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-slate-400 hover:text-rose-500 text-[10px] font-black uppercase"
            >
              ล้าง
            </button>
          )}
          <ChevronDown 
            size={14} 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-xl p-2 z-50 space-y-1 max-h-64 overflow-y-auto">
            {options.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">
                ไม่มีตัวเลือก
              </div>
            ) : (
              options.map(option => (
                <label 
                  key={option} 
                  className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input 
                    type="checkbox" 
                    checked={selected.includes(option)} 
                    onChange={() => toggle(option)} 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer" 
                  />
                  <span className="text-xs font-bold text-slate-700 truncate flex-1">
                    {option}
                  </span>
                </label>
              ))
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default MultiSelect;
import React from 'react';
import { CheckCircle2, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';

/**
 * TaskCard Component
 * การ์ดแสดงรายการงาน พร้อมสถานะและกำหนดส่ง
 * 
 * @param {object} task - ข้อมูล task
 * @param {function} onClick - callback เมื่อคลิก
 * @param {string} variant - รูปแบบการ์ด ('district' | 'province')
 */
const TaskCard = ({ task, onClick, variant = 'district' }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'ส่งแล้ว': {
        color: 'emerald',
        icon: CheckCircle2,
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-500'
      },
      'รอดำเนินการ': {
        color: 'amber',
        icon: Clock,
        bgColor: 'bg-slate-50',
        textColor: 'text-slate-300'
      },
      'เลยกำหนด': {
        color: 'rose',
        icon: AlertCircle,
        bgColor: 'bg-rose-50',
        textColor: 'text-rose-500'
      },
      'ส่งบางส่วน': {
        color: 'amber',
        icon: Clock,
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-500'
      }
    };
    
    return configs[status] || configs['รอดำเนินการ'];
  };

  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;
  const accentColor = variant === 'district' ? 'blue' : 'emerald';

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white p-8 rounded-[3.5rem] border border-slate-50 shadow-sm 
        flex items-center justify-between group 
        hover:border-${accentColor}-500 hover:shadow-2xl 
        transition-all cursor-pointer
      `}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-8 flex-1">
        {/* Status Icon */}
        <div 
          className={`
            w-16 h-16 rounded-3xl flex items-center justify-center transition-all
            ${task.status === 'ส่งแล้ว' 
              ? `${statusConfig.bgColor} ${statusConfig.textColor} shadow-${statusConfig.color}-500/10` 
              : `${statusConfig.bgColor} ${statusConfig.textColor} group-hover:bg-${accentColor}-50`
            }
          `}
        >
          <StatusIcon size={32} />
        </div>

        {/* Task Info */}
        <div className="space-y-2 flex-1">
          {/* Status Badge + Due Date */}
          <div className="flex items-center space-x-3">
            <Badge color={statusConfig.color}>
              {task.status}
            </Badge>
            
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              กำหนดส่ง: {task.due}
            </span>
          </div>

          {/* Task Title */}
          <h4 className={`
            font-black text-slate-800 text-2xl tracking-tight 
            group-hover:text-${accentColor}-600 transition-colors leading-tight
          `}>
            {task.title}
          </h4>

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>{task.group}</span>
            <span>•</span>
            <span>{task.type}</span>
            {task.responsibleName && (
              <>
                <span>•</span>
                <span>PIC: {task.responsibleName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Arrow */}
      <div className={`
        p-4 bg-slate-50 text-slate-200 rounded-3xl 
        group-hover:bg-${accentColor}-600 group-hover:text-white 
        transition-all
      `}>
        <ChevronRight size={28} />
      </div>
    </div>
  );
};

/**
 * TaskCardCompact - เวอร์ชันขนาดเล็ก
 */
export const TaskCardCompact = ({ task, onClick }) => {
  const statusConfig = {
    'ส่งแล้ว': { color: 'emerald', icon: '✓' },
    'รอดำเนินการ': { color: 'amber', icon: '⏱' },
    'เลยกำหนด': { color: 'rose', icon: '!' }
  };

  const config = statusConfig[task.status] || statusConfig['รอดำเนินการ'];

  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <span className="text-2xl">{config.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm text-slate-800 truncate group-hover:text-blue-600 transition-colors">
              {task.title}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
              {task.due}
            </p>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
      </div>
    </div>
  );
};

export default TaskCard;
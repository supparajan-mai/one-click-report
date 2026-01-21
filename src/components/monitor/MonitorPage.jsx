import React, { useState } from 'react';
import { CalendarIcon, Plus, BarChart3, FileText, ChevronRight } from 'lucide-react';
import Navbar from '../common/Navbar';
import Card from '../common/Card';

/**
 * Monitor Page Component
 * หน้าติดตามการส่งงานรายหัวข้อ (Province only + PIN required)
 * 
 * @param {object} tasks - tasks object
 * @param {function} onNavigate - callback สำหรับ navigation
 * @param {function} onTaskClick - callback เมื่อคลิกงาน (เปิด drilldown)
 * @param {function} onAddReport - callback สร้างรายงานใหม่
 */
const MonitorPage = ({ tasks, onNavigate, onTaskClick, onAddReport }) => {
  const allTasks = tasks.tasks || [];

  // Calculate progress for each task
  const getTaskProgress = (task) => {
    const totalDistricts = task.targetDistricts?.length || 19;
    const sentCount = task.sentCount || 0;
    return {
      sent: sentCount,
      total: totalDistricts,
      percent: totalDistricts > 0 ? Math.round((sentCount / totalDistricts) * 100) : 0
    };
  };

  const getProgressColor = (percent) => {
    if (percent >= 80) return 'emerald';
    if (percent >= 50) return 'amber';
    return 'rose';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Navbar */}
      <Navbar
        title="ติดตามการส่งงาน"
        onBack={() => onNavigate('landing')}
        badge="P"
        badgeColor="slate"
        actions={[
          {
            icon: <BarChart3 size={20} />,
            onClick: () => onNavigate('provincial_dashboard'),
            title: 'ไปหน้าภาพรวม',
            className: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
          }
        ]}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">
              รายการงานทั้งหมด
            </h1>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase flex items-center">
              <CalendarIcon size={14} className="mr-2" /> 
              มกราคม 2569
            </p>
          </div>

          <button
            onClick={onAddReport}
            className="flex items-center space-x-3 px-8 py-5 bg-blue-600 text-white rounded-[2rem] font-black shadow-2xl hover:bg-blue-700 active:scale-95 group transition-all"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="uppercase tracking-widest">สร้างรายการรายงาน</span>
          </button>
        </div>

        {/* Tasks Table */}
        <Card variant="elevated" className="!p-0 overflow-hidden">
          {allTasks.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">
                ยังไม่มีรายการงาน
              </h3>
              <p className="text-slate-400 font-medium mb-8">
                เริ่มต้นด้วยการสร้างรายการรายงานใหม่
              </p>
              <button
                onClick={onAddReport}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all"
              >
                สร้างรายการแรก
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6 text-xs">
                      ชื่อรายงาน (คลิกดูสถานะรายตัว)
                    </th>
                    <th className="px-10 py-6 text-center">
                      ประเภท
                    </th>
                    <th className="px-10 py-6 text-center">
                      ความคืบหน้า
                    </th>
                    <th className="px-10 py-6 text-center">
                      กำหนดส่ง
                    </th>
                    <th className="px-10 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {allTasks.map(task => {
                    const progress = getTaskProgress(task);
                    const colorScheme = getProgressColor(progress.percent);
                    const typeColor = task.type === 'อำเภอส่งจังหวัด' ? 'blue' : 'purple';

                    return (
                      <tr 
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className="hover:bg-blue-50/50 transition-all group cursor-pointer"
                      >
                        {/* Task Name */}
                        <td className="px-10 py-8">
                          <div className="flex items-center space-x-4">
                            <div className={`p-4 rounded-2xl ${
                              task.type === 'อำเภอส่งจังหวัด' 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'bg-purple-50 text-purple-600'
                            }`}>
                              <FileText size={24} />
                            </div>
                            <div>
                              <p className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors leading-tight">
                                {task.title}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                                {task.group} | {task.type}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="px-10 py-8 text-center">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            typeColor === 'blue'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-purple-100 text-purple-600'
                          }`}>
                            {task.type}
                          </span>
                        </td>

                        {/* Progress */}
                        <td className="px-10 py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all ${
                                  colorScheme === 'emerald' ? 'bg-emerald-500' :
                                  colorScheme === 'amber' ? 'bg-amber-500' :
                                  'bg-rose-500'
                                }`}
                                style={{ width: `${progress.percent}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase">
                              ส่งแล้ว {progress.sent} / {progress.total}
                            </span>
                          </div>
                        </td>

                        {/* Due Date */}
                        <td className="px-10 py-8 text-center text-xs font-black text-slate-400">
                          {task.due}
                        </td>

                        {/* Action */}
                        <td className="px-10 py-8 text-right">
                          <ChevronRight 
                            size={24} 
                            className="text-slate-200 group-hover:text-blue-500 transition-colors" 
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Help Text */}
        <div className="text-center text-slate-400 text-sm italic">
          <p>💡 คลิกที่รายการเพื่อดูสถานะการส่งรายอำเภอแบบละเอียด</p>
        </div>
      </main>
    </div>
  );
};

export default MonitorPage;
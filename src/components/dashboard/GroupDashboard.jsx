// GroupDashboard.jsx - Standalone Component
// วางไฟล์นี้ใน src/components/dashboard/GroupDashboard.jsx

import React from 'react';
import { Plus, Send, Search, Home, Lock, ArrowLeft } from 'lucide-react';

/**
 * Group Dashboard Component (Simplified Menu)
 * หน้าเมนูหลักสำหรับกลุ่มงานจังหวัด - 4 ฟังก์ชันหลัก
 * 
 * Features:
 * 1. เพิ่มรายงาน (Add Report)
 * 2. ส่งรายงาน (Submit Report to Department)
 * 3. ติดตามรายงาน (Track Reports)
 * 4. กลับหน้าแรก (Back to Landing)
 * 
 * @param {object} auth - auth object with PIN verification status
 * @param {function} onNavigate - callback for navigation
 * @param {function} onLogout - callback to return to landing
 */
const GroupDashboard = ({ 
  auth, 
  onNavigate, 
  onLogout 
}) => {
  // Menu items configuration
  const menuItems = [
    {
      id: 'add-report',
      title: 'สร้างรายงาน',
      description: 'สร้างรายการใหม่',
      icon: Plus,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      hoverBorder: 'hover:border-emerald-500',
      hoverText: 'group-hover:text-emerald-600',
      onClick: () => onNavigate('add_report')
    },
    {
      id: 'submit-report',
      title: 'ส่งรายงาน',
      description: 'ส่งรายงานจังหวัดไปยังกรม',
      icon: Send,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      hoverBorder: 'hover:border-blue-500',
      hoverText: 'group-hover:text-blue-600',
      onClick: () => onNavigate('submit_report')
    },
    {
      id: 'track-report',
      title: 'ติดตามรายงาน',
      description: 'ดูสถานะการส่งรายงานของทุกอำเภอ',
      icon: Search,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      hoverBorder: 'hover:border-purple-500',
      hoverText: 'group-hover:text-purple-600',
      onClick: () => onNavigate('monitor')
    },
    {
      id: 'back-home',
      title: 'กลับหน้าแรก',
      description: 'กลับไปหน้า Landing Page',
      icon: Home,
      iconBg: 'bg-slate-50',
      iconColor: 'text-slate-600',
      hoverBorder: 'hover:border-slate-500',
      hoverText: 'group-hover:text-slate-600',
      onClick: onLogout
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Back button + Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-slate-700"
                title="กลับหน้าแรก"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">
                  {auth.selectedName || 'กลุ่มงานจังหวัด'}
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  เลือกฟังก์ชันการทำงาน
                </p>
              </div>
            </div>

            {/* Right: Badge */}
            <div className="flex items-center space-x-3">
              <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                P
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-10 animate-in slide-in-from-bottom-6 duration-500">
        {/* Header Card with PIN Status */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 relative overflow-hidden">
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            {/* Lock Icon */}
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
              <Lock size={40} className="text-emerald-600" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="font-black text-4xl text-slate-800 tracking-tighter uppercase leading-none">
                Group Dashboard
              </h1>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-slate-500 font-medium">PIN Verified:</span>
                <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                  ✓ Authenticated
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-slate-500 font-medium max-w-md">
              สำหรับ: <strong className="text-slate-700">{auth.selectedName}</strong>
            </p>
          </div>

          {/* Background Decoration */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-50 rounded-full opacity-30 blur-3xl" />
        </div>

        {/* Menu Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight ml-4">
            เลือกฟังก์ชัน
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`
                    p-8 bg-white border-2 border-slate-100 rounded-2xl 
                    ${item.hoverBorder} hover:shadow-xl
                    transition-all duration-300 text-left group
                    transform hover:scale-105 active:scale-95
                  `}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className={`
                      w-16 h-16 ${item.iconBg} ${item.iconColor} rounded-2xl 
                      flex items-center justify-center 
                      group-hover:scale-110 transition-transform duration-300
                      shadow-sm
                    `}>
                      <Icon size={32} strokeWidth={2.5} />
                    </div>

                    {/* Text */}
                    <div className="space-y-2">
                      <h3 className={`
                        font-black text-xl text-slate-800 
                        ${item.hoverText} transition-colors duration-300
                      `}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-blue-900">คำแนะนำการใช้งาน</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>สร้างรายงาน</strong> - สร้างรายการใหม่</li>
                <li>• <strong>ส่งรายงาน</strong> - ส่งรายงานสรุปจากจังหวัดไปยังกรม</li>
                <li>• <strong>ติดตามรายงาน</strong> - ตรวจสอบความคืบหน้าการส่งของทุกอำเภอ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-slate-400 text-sm space-y-1 italic">
          <p>🔒 คุณเข้าสู่ระบบในฐานะกลุ่มงานจังหวัด</p>
          <p className="text-xs">คลิกเมนูด้านบนเพื่อเริ่มต้นใช้งาน</p>
        </div>
      </main>
    </div>
  );
};

export default GroupDashboard;
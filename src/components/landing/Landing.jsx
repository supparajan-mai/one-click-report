import React from 'react';
import { Building2, CheckCircle2, ChevronRight, BarChart3, PieChart, BookOpen, Shield, Lock } from 'lucide-react';

/**
 * Landing Page Component
 * หน้าแรกของระบบ - เลือกเข้าใช้งาน 3 ทาง
 * 
 * @param {function} onNavigate - callback สำหรับ navigation
 * @param {function} onSelectRole - callback เมื่อเลือก role
 * @param {boolean} apiConnected - สถานะการเชื่อมต่อ API
 */
const Landing = ({ onNavigate, onSelectRole, apiConnected = false }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-blue-100">
      <div className="max-w-5xl w-full space-y-12 text-center animate-in fade-in duration-700">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-block p-5 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95 delay-100">
            <CheckCircle2 size={56} className="text-blue-600" />
          </div>
          
          <h1 className="text-6xl font-black text-slate-800 tracking-tighter leading-tight uppercase animate-in slide-in-from-bottom-4 delay-200">
            1-Click Report
          </h1>
          
          <p className="text-slate-400 font-bold text-xl tracking-tight uppercase animate-in slide-in-from-bottom-4 delay-300">
            ช่องทางการรายงานของ สพจ.สุราษฎร์ธานี
          </p>

          {/* API Status */}
          {apiConnected ? (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-full text-sm font-black uppercase tracking-wider shadow-lg animate-in slide-in-from-bottom-4 delay-400">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span>API เชื่อมต่อสำเร็จ</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-50 border-2 border-amber-200 text-amber-700 rounded-full text-sm font-black uppercase tracking-wider shadow-lg animate-in slide-in-from-bottom-4 delay-400">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span>โหมด Demo (API ไม่พร้อม)</span>
            </div>
          )}

          {/* Manual Link */}
          <div className="animate-in fade-in delay-500">
            <a 
              href="https://docs.google.com/document/d/YOUR_MANUAL_LINK" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors group"
            >
              <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
              <span className="group-hover:underline">คู่มือการใช้งาน</span>
              <ChevronRight size={14} />
            </a>
          </div>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
          {/* Provincial Dashboard - ทุกคนดูได้ */}
          <button 
            onClick={() => onNavigate('provincial_dashboard')}
            className="group w-full p-10 bg-slate-900 border-2 border-slate-800 rounded-[3rem] hover:border-indigo-500 transition-all text-left shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-4 delay-400"
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center space-x-6 flex-1">
                <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 size={32} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-black text-3xl text-white uppercase tracking-tighter">
                      ภาพรวมระดับจังหวัด
                    </h3>
                    {/* Badge: ดูได้ทุกบทบาท */}
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1.5">
                      <Shield size={12} />
                      ดูได้ทุกบทบาท
                    </span>
                  </div>
                  <p className="text-slate-400 text-base font-medium italic">
                    ภาพรวมระดับจังหวัดเพื่อติดตามสถานะรายงานของอำเภอและจังหวัด
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-indigo-400 font-black text-xs uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                ดูรายงานสรุป <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
            
            <PieChart size={200} className="absolute -right-20 -bottom-20 text-white/5 opacity-20 -rotate-12" />
          </button>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* District Card */}
            <button 
              onClick={() => {
                onSelectRole('district', '');
                onNavigate('entry');
              }}
              className="group p-10 bg-white border-2 border-slate-100 rounded-[3rem] hover:border-blue-500 transition-all text-left shadow-sm animate-in slide-in-from-bottom-4 delay-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 size={28} />
                </div>
                {/* Badge: ปกติ */}
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  ปกติ
                </span>
              </div>
              
              <h3 className="font-black text-2xl text-slate-800 tracking-tight mb-2">
                หน่วยอำเภอ
              </h3>
              
              <p className="text-slate-400 text-sm font-medium italic leading-relaxed">
                ส่งรายงานผลการดำเนินงานระดับพื้นที่และข้อมูลหนังสือ
              </p>
            </button>

            {/* Province Card */}
            <button 
              onClick={() => {
                onSelectRole('province', '');
                onNavigate('entry');
              }}
              className="group p-10 bg-white border-2 border-slate-100 rounded-[3rem] hover:border-emerald-500 transition-all text-left shadow-sm animate-in slide-in-from-bottom-4 delay-600"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform font-black">
                  P
                </div>
                {/* Badge: ต้องใช้ PIN */}
                <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Lock size={10} />
                  ต้อง PIN
                </span>
              </div>
              
              <h3 className="font-black text-2xl text-slate-800 tracking-tight mb-2">
                กลุ่มงานจังหวัด
              </h3>
              
              <p className="text-slate-400 text-sm font-medium italic leading-relaxed">
                จัดทำรายการงานและติดตามผลการส่งรายงานกรม
              </p>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-slate-300 text-xs animate-in fade-in delay-700 space-y-2">
          <p>💡 เลือกบทบาทที่ตรงกับหน้าที่ของคุณเพื่อเข้าสู่ระบบ</p>
          {!apiConnected && (
            <p className="text-amber-400">
              ⚠️ ขณะนี้ API ไม่พร้อม - กำลังใช้งานในโหมด Demo
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
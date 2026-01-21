// App.jsx - Updated to use GroupDashboard Component
// แทนที่ไฟล์ src/App.jsx ของคุณด้วยไฟล์นี้

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Building2, Users, LayoutDashboard, Search, Filter, 
  Plus, Send, ArrowLeft, CheckCircle2, Clock, 
  AlertCircle, Globe2, FileText, X, Save, 
  ChevronRight, MoreVertical, PieChart, Trash2, PlusCircle, Link2, 
  Check, Info, Calendar as CalendarIcon, ListFilter, MapPin, ExternalLink,
  BarChart3, Activity, Layers, Trophy, ArrowUpRight, ClipboardCheck, AlertTriangle,
  SearchX, CalendarX, Copy, RefreshCcw, ChevronDown, Lock, Wifi, WifiOff
} from 'lucide-react';
import { api } from './config/api';

// 🎯 IMPORT COMPONENTS
import ProvincialDashboard from './components/dashboard/ProvincialDashboard';
import GroupDashboard from './components/dashboard/GroupDashboard';
import AddReportPage from './components/report/AddReportPage';
import SubmitReportPage from './components/report/SubmitReportPage';

// ==================== CONSTANTS ====================

const DISTRICTS = [
  "เมืองสุราษฎร์ธานี", "กาญจนดิษฐ์", "ดอนสัก", "เกาะสมุย", "เกาะพะงัน", 
  "ไชยา", "ท่าชนะ", "คีรีรัฐนิคม", "บ้านตาขุน", "พนม", 
  "ท่าฉาง", "บ้านนาสาร", "บ้านนาเดิม", "เคียนซา", "เวียงสระ", 
  "พระแสง", "พุนพิน", "ชัยบุรี", "วิภาวดี"
];

const GROUPS = [
  "กลุ่มงานประสานฯ", "กลุ่มงานยุทธศาสตร์ฯ", "กลุ่มงานส่งเสริมฯ", "กลุ่มงานสารสนเทศฯ"
];

const MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const YEARS = ["2569", "2570", "2571"];

const INITIAL_TASKS = [];

// ==================== ACCESS CONTROL ====================

const PROVINCE_PIN = '1234';

const PERMISSIONS = {
  PUBLIC: ['landing', 'entry', 'provincial_dashboard'],
  DISTRICT: ['dashboard', 'task_detail'],
  PROVINCE: ['group_dashboard', 'monitor', 'task_detail_p2d', 'add_report', 'submit_report', 'track_report']
};

const canAccessView = (role, view, isPINVerified) => {
  if (PERMISSIONS.PUBLIC.includes(view)) return true;
  if (PERMISSIONS.DISTRICT.includes(view)) return role === 'district';
  if (PERMISSIONS.PROVINCE.includes(view)) return role === 'province' && isPINVerified;
  return false;
};

const requiresPIN = (view) => PERMISSIONS.PROVINCE.includes(view);

// ==================== HELPERS ====================

const getProgressColor = (percent) => {
  if (percent >= 80) return 'text-emerald-500';
  if (percent >= 50) return 'text-amber-500';
  return 'text-rose-500';
};

const getProgressBg = (percent) => {
  if (percent >= 80) return 'bg-emerald-500';
  if (percent >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};

const copyToClipboard = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

// ==================== COMPONENTS ====================

const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
    slate: 'bg-slate-100 text-slate-700'
  };
  return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colors[color]}`}>{children}</span>;
};

const PINGate = ({ isOpen, onVerify, onCancel, error }) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const success = onVerify(pin);
    if (success) setPin('');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-lg animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl animate-in zoom-in-95">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-lg"><Lock size={24} /></div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">ยืนยันตัวตน</h2>
          </div>
          <button onClick={() => { setPin(''); onCancel(); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">รหัส PIN</label>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-2xl tracking-widest text-center focus:border-amber-500 outline-none" placeholder="••••" maxLength={4} autoFocus />
            {error && <p className="text-red-500 text-xs font-bold ml-3 mt-2">{error}</p>}
          </div>
          <button type="submit" disabled={isLoading || pin.length < 4} className="w-full py-5 bg-amber-500 text-white rounded-3xl font-black text-lg shadow-xl disabled:opacity-30 transition-all active:scale-95 uppercase">{isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}</button>
        </form>
      </div>
    </div>
  );
};

// ==================== API STATUS INDICATOR ====================

const APIStatusBadge = ({ isConnected }) => (
  <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
    isConnected ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
  }`}>
    {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
    <span className="text-xs font-bold">
      {isConnected ? 'API Connected' : 'API Disconnected'}
    </span>
  </div>
);

// ==================== MAIN APP ====================

const App = () => {
  const [view, setView] = useState('landing');
  const [role, setRole] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isPINVerified, setIsPINVerified] = useState(false);
  const [showPINGate, setShowPINGate] = useState(false);
  const [pendingView, setPendingView] = useState(null);
  const [pinError, setPinError] = useState('');
  
  // API State
  const [apiConnected, setApiConnected] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [orgsFromAPI, setOrgsFromAPI] = useState([]);
  const [groupsFromAPI, setGroupsFromAPI] = useState([]);
  
  // Reports State (for both D2P and P2D)
  const [reports, setReports] = useState([]);

  // Test API connection on mount
  useEffect(() => {
    console.log('🚀 Testing API connection...');
    api.test()
      .then(result => {
        if (result.status === 'success') {
          setApiConnected(true);
          console.log('✅ API Connected:', result.message);
        } else {
          setApiConnected(false);
          console.error('❌ API Error:', result.message);
        }
      })
      .catch(err => {
        console.error('❌ API Connection Failed:', err);
        setApiConnected(false);
      });
  }, []);

  // Load data from API
  const loadDataFromAPI = useCallback(async () => {
    if (!apiConnected) {
      console.log('⚠️ API not connected, using mock data');
      return;
    }

    setApiLoading(true);
    try {
      // Load reports
      const reportsResult = await api.getReports();
      if (reportsResult.status === 'success' && reportsResult.data.length > 0) {
        console.log('📋 Loaded reports from API:', reportsResult.data);
      }

      // Load orgs
      const orgsResult = await api.getOrgs();
      if (orgsResult.status === 'success' && orgsResult.data.length > 0) {
        console.log('🏛️ Loaded orgs from API:', orgsResult.data);
        setOrgsFromAPI(orgsResult.data);
      }

      // Load groups
      const groupsResult = await api.getGroups();
      if (groupsResult.status === 'success' && groupsResult.data.length > 0) {
        console.log('👥 Loaded groups from API:', groupsResult.data);
        setGroupsFromAPI(groupsResult.data);
      }

    } catch (error) {
      console.error('Error loading data from API:', error);
    } finally {
      setApiLoading(false);
    }
  }, [apiConnected]);

  useEffect(() => {
    if (apiConnected) {
      loadDataFromAPI();
    }
  }, [apiConnected, loadDataFromAPI]);

  const navigateTo = (targetView) => {
    if (!canAccessView(role, targetView, isPINVerified)) {
      if (requiresPIN(targetView) && !isPINVerified) {
        setPendingView(targetView);
        setShowPINGate(true);
        return;
      }
      alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
      return;
    }
    setView(targetView);
  };

  const handlePINVerified = (pin) => {
    if (pin === PROVINCE_PIN) {
      setIsPINVerified(true);
      setPinError('');
      setShowPINGate(false);
      if (pendingView) {
        setView(pendingView);
        setPendingView(null);
      }
      return true;
    } else {
      setPinError('รหัส PIN ไม่ถูกต้อง');
      return false;
    }
  };

  const handleLogout = () => {
    setRole(null);
    setSelectedName('');
    setIsPINVerified(false);
    setView('landing');
  };

  const handleCopy = (text) => copyToClipboard(text);

  const getSubmissionStatus = (taskId) => {
    return DISTRICTS.map((name, index) => ({
      name,
      status: index % 4 === 0 ? 'รอดำเนินการ' : 'ส่งแล้ว',
      time: index % 4 === 0 ? '-' : '10:20 น.',
      docNumber: index % 4 === 0 ? '-' : `สฎ 0019.${index + 2}/ว ${240 + index}`,
      docDate: '10 ม.ค. 2569',
      sentToProvinceDate: '11 ม.ค. 2569',
      needsDoc: tasks.find(t => t.id === taskId)?.channels?.includes("DOC")
    }));
  };

  const Landing = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-blue-100">
      <APIStatusBadge isConnected={apiConnected} />
      <div className="max-w-5xl w-full space-y-12 text-center">
        <div className="space-y-4">
          <div className="inline-block p-5 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
            <CheckCircle2 size={56} className="text-blue-600" />
          </div>
          <h1 className="text-6xl font-black text-slate-800 tracking-tighter leading-tight uppercase">1-Click Report</h1>
          <p className="text-slate-400 font-bold text-xl tracking-tight uppercase">ช่องทางการรายงานของ สพจ.สุราษฎร์ธานี</p>
          {apiConnected && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold">
              <Wifi size={16} />
              <span>API เชื่อมต่อสำเร็จ</span>
            </div>
          )}
        </div>
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
          <button onClick={() => navigateTo('provincial_dashboard')} className="group w-full p-10 bg-slate-900 border-2 border-slate-800 rounded-[3rem] hover:border-indigo-500 transition-all text-left shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform"><BarChart3 size={32} /></div>
                <div>
                  <h3 className="font-black text-3xl text-white uppercase tracking-tighter">ภาพรวมระดับจังหวัด</h3>
                  <p className="text-slate-400 text-base mt-1 font-medium italic">ดูภาพรวมสถานะรายงานทั้งหมด</p>
                </div>
              </div>
              <div className="flex items-center text-indigo-400 font-black text-xs uppercase tracking-widest bg-white/5 px-6 py-3 rounded-2xl">ดูรายงาน <ChevronRight size={14} className="ml-1" /></div>
            </div>
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => { setRole('district'); setView('entry'); }} className="group p-10 bg-white border-2 border-slate-100 rounded-[3rem] hover:border-blue-500 transition-all text-left shadow-sm">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><Building2 size={28} /></div>
              <h3 className="font-black text-2xl text-slate-800 tracking-tight">หน่วยอำเภอ</h3>
              <p className="text-slate-400 text-sm mt-2 font-medium italic leading-relaxed">ส่งรายงานระดับพื้นที่</p>
            </button>
            <button onClick={() => { setRole('province'); setView('entry'); }} className="group p-10 bg-white border-2 border-slate-100 rounded-[3rem] hover:border-emerald-500 transition-all text-left shadow-sm">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform font-black">P</div>
              <h3 className="font-black text-2xl text-slate-800 tracking-tight">กลุ่มงานจังหวัด</h3>
              <p className="text-slate-400 text-sm mt-2 font-medium italic leading-relaxed">จัดการและติดตามงาน</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Entry = () => {
    const districtOptions = orgsFromAPI.length > 0 
      ? orgsFromAPI.filter(org => org.orgType === 'DISTRICT').map(org => org.orgName)
      : DISTRICTS;
    
    const groupOptions = groupsFromAPI.length > 0
      ? groupsFromAPI.map(group => group.groupName)
      : GROUPS;

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <APIStatusBadge isConnected={apiConnected} />
        <div className="max-w-md w-full bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">เลือกหน่วยงาน</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">ระบุต้นสังกัดเพื่อเข้าใช้งาน</p>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">สังกัดหน่วยงาน</label>
            <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-slate-700 focus:border-blue-500 outline-none cursor-pointer text-lg" value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
              <option value="">เลือกจากรายการ...</option>
              {role === 'district' 
                ? districtOptions.map(d => <option key={d} value={d}>{d}</option>)
                : groupOptions.map(g => <option key={g} value={g}>{g}</option>)
              }
            </select>
            {apiConnected && (
              <p className="text-xs text-emerald-600 font-bold ml-3">
                ✓ กำลังใช้ข้อมูลจาก API
              </p>
            )}
          </div>
          <button disabled={!selectedName} onClick={() => navigateTo(role === 'district' ? 'dashboard' : 'group_dashboard')} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl disabled:opacity-30 transition-all active:scale-95 uppercase">เริ่มใช้งาน</button>
          <button onClick={handleLogout} className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors text-center">ยกเลิก</button>
        </div>
      </div>
    );
  };

  return (
    <div className="selection:bg-blue-100 font-sans">
      <PINGate isOpen={showPINGate} onVerify={handlePINVerified} onCancel={() => { setShowPINGate(false); setPendingView(null); }} error={pinError} />
      
      {view === 'landing' && <Landing />}
      {view === 'entry' && <Entry />}
      
      {/* ✅ Provincial Dashboard */}
      {view === 'provincial_dashboard' && (
        <ProvincialDashboard 
          onBackToHome={() => setView('landing')}
        />
      )}
      
      {/* ✅ District Dashboard */}
      {view === 'dashboard' && (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <APIStatusBadge isConnected={apiConnected} />
          <div className="text-center p-8">
            <h1 className="text-4xl font-black mb-4 text-slate-800">District Dashboard</h1>
            <p className="text-slate-500 mb-4">สำหรับ: {selectedName}</p>
            {apiLoading && <p className="text-blue-600 mb-4">กำลังโหลดข้อมูลจาก API...</p>}
            <button onClick={handleLogout} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">ออกจากระบบ</button>
          </div>
        </div>
      )}
      
      {/* 🎯 ✅ Group Dashboard - ใช้ Component ใหม่ */}
      {view === 'group_dashboard' && (
        <GroupDashboard 
          auth={{ 
            role, 
            selectedName, 
            isPINVerified 
          }}
          onNavigate={navigateTo}
          onLogout={handleLogout}
        />
      )}
      
      {/* ✅ Monitor Page */}
      {view === 'monitor' && (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <APIStatusBadge isConnected={apiConnected} />
          <div className="text-center p-8">
            <h1 className="text-4xl font-black mb-4 text-slate-800">Monitor Page 🔍</h1>
            <p className="text-slate-500 mb-2">ติดตามสถานะการส่งรายงาน</p>
            <p className="text-emerald-600 text-sm">Protected by PIN ✓</p>
            <button onClick={() => setView('group_dashboard')} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">กลับ Group Dashboard</button>
          </div>
        </div>
      )}
      
      {/* ✅ Add Report Page */}
      {view === 'add_report' && (
        <AddReportPage
          auth={{ role, selectedName, isPINVerified }}
          onBack={() => setView('group_dashboard')}
          onSave={(reportData) => {
            console.log('💾 New report saved:', reportData);
            
            // Add new report to state
            setReports(prev => [...prev, reportData]);
            
            // TODO: Save to API
            // api.createReport(reportData);
          }}
        />
      )}
      
      {/* ✅ Submit Report Page */}
      {view === 'submit_report' && (
        <SubmitReportPage
          auth={{ role, selectedName, isPINVerified }}
          reports={reports}
          onBack={() => setView('group_dashboard')}
          onSubmit={(submissionData) => {
            console.log('📤 Report submitted:', submissionData);
            
            // Update report with submission timestamp
            setReports(prev => prev.map(report => 
              report.reportId === submissionData.reportId
                ? {
                    ...report,
                    lastSubmittedAt: submissionData.submittedAt,
                    lastSubmittedBy: submissionData.submittedBy,
                    status: submissionData.status
                  }
                : report
            ));
            
            // TODO: Send to API
            // api.submitReport(submissionData);
          }}
        />
      )}
      
      {/* ✅ Track Report Page (alias for monitor) */}
      {view === 'track_report' && (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <APIStatusBadge isConnected={apiConnected} />
          <div className="text-center p-8">
            <h1 className="text-4xl font-black mb-4 text-slate-800">ติดตามรายงาน 📊</h1>
            <p className="text-slate-500 mb-2">ดูสถานะการส่งของทุกอำเภอ</p>
            <p className="text-emerald-600 text-sm">Protected by PIN ✓</p>
            <button onClick={() => setView('group_dashboard')} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">กลับ Group Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
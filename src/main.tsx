import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, ClipboardList, PlusCircle, Monitor, UserCircle, 
  ChevronRight, CheckCircle2, AlertCircle, BarChart3, Calendar, 
  Building2, Users, ExternalLink, ArrowLeft, Save, Send, Loader2, RefreshCw
} from 'lucide-react';

// --- CONFIGURATION ---
const API_BASE = "/.netlify/functions";

// --- SERVICES ---
const storage = {
  save: (key, value) => localStorage.setItem(`ocr_${key}`, JSON.stringify(value)),
  get: (key) => {
    const item = localStorage.getItem(`ocr_${key}`);
    return item ? JSON.parse(item) : null;
  }
};

const apiService = async (endpoint, method = 'GET', payload = null, retries = 5, backoff = 1000) => {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (payload) options.body = JSON.stringify(payload);

    const response = await fetch(`${API_BASE}/${endpoint}`, options);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const result = await response.json();
    if (result.success === false) throw new Error(result.error || "Unknown API Error");
    
    return result.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return apiService(endpoint, method, payload, retries - 1, backoff * 2);
    }
    throw error;
  }
};

const App = () => {
  const [view, setView] = useState('landing');
  const [role, setRole] = useState(storage.get('role'));
  const [currentOrg, setCurrentOrg] = useState(storage.get('org'));
  const [currentGroup, setCurrentGroup] = useState(storage.get('group'));
  const [selectedPeriod, setSelectedPeriod] = useState(storage.get('period') || '');
  
  const [meta, setMeta] = useState({ orgs: [], groups: [], periods: [] });
  const [taskList, setTaskList] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { storage.save('role', role); }, [role]);
  useEffect(() => { storage.save('org', currentOrg); }, [currentOrg]);
  useEffect(() => { storage.save('group', currentGroup); }, [currentGroup]);
  useEffect(() => { storage.save('period', selectedPeriod); }, [selectedPeriod]);

  const init = async () => {
    setLoading(true);
    try {
      const data = await apiService('meta');
      setMeta(data);
      if (!selectedPeriod && data.periods.length > 0) {
        setSelectedPeriod(data.periods[0].periodId);
      }
      if (role && (currentOrg || currentGroup)) setView('home');
    } catch (err) {
      setError("เชื่อมต่อ API ไม่สำเร็จ กรุณาตรวจสอบการตั้งค่า Netlify Functions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { init(); }, []);

  const fetchTasks = useCallback(async () => {
    if (!role || !selectedPeriod) return;
    setLoading(true);
    try {
      let data;
      if (role === 'DISTRICT' && currentOrg) {
        data = await apiService(`districtTasks?orgId=${currentOrg.orgId}&periodId=${selectedPeriod}`);
      } else if (role === 'GROUP' && currentGroup) {
        data = await apiService(`groupTasks?groupId=${currentGroup.groupId}&periodId=${selectedPeriod}`);
      }
      setTaskList(data || []);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);
    } finally {
      setLoading(false);
    }
  }, [role, currentOrg, currentGroup, selectedPeriod]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">1-Click Report</h1>
        <p className="text-slate-500">กรุณาเลือกบทบาทผู้ใช้งานเพื่อเริ่มต้น</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
        <button onClick={() => { setRole('DISTRICT'); setView('choose-district'); }} className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-blue-500 transition-all flex flex-col items-center shadow-sm">
          <Building2 size={40} className="text-blue-500 mb-3" />
          <span className="font-bold text-lg text-slate-700">หน่วยอำเภอ (District)</span>
        </button>
        <button onClick={() => { setRole('GROUP'); setView('choose-group'); }} className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-emerald-500 transition-all flex flex-col items-center shadow-sm">
          <Users size={40} className="text-emerald-500 mb-3" />
          <span className="font-bold text-lg text-slate-700">นักวิชาการ (Group)</span>
        </button>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-black mb-2 text-slate-800">เกิดข้อผิดพลาดของระบบ</h1>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">ลองใหม่อีกครั้ง</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-10 font-sans">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] z-[100] flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      )}

      {view !== 'landing' && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 h-16 flex items-center justify-between">
          <button onClick={() => { setView('landing'); setRole(null); }} className="flex items-center text-slate-800 font-black">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-2 text-lg">1</div>
            1-CLICK
          </button>
          <div className="flex items-center space-x-3 text-right">
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">{role}</p>
              <p className="text-xs font-bold text-slate-700 leading-none">{currentOrg?.name || currentGroup?.name}</p>
            </div>
            <button onClick={() => setView('landing')} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
              <UserCircle size={20} className="text-slate-600" />
            </button>
          </div>
        </nav>
      )}

      <main className="max-w-4xl mx-auto p-4">
        {view === 'landing' && renderLanding()}
        
        {view === 'choose-district' && (
          <div className="space-y-6">
            <button onClick={() => setView('landing')} className="flex items-center text-slate-500 font-bold hover:text-slate-800 transition-colors">
              <ArrowLeft size={18} className="mr-1" /> กลับ
            </button>
            <h2 className="text-3xl font-black text-slate-800">เลือกอำเภอของท่าน</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {meta.orgs.map(org => (
                <button key={org.orgId} onClick={() => { setCurrentOrg(org); setView('home'); }} className="p-4 bg-white border rounded-2xl font-bold text-slate-700 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
                  {org.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'home' && (
          <div className="space-y-6">
            <header className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">รายการงานเดือนนี้</h2>
              <select 
                className="bg-white border rounded-xl px-4 py-2 font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                {meta.periods.map(p => <option key={p.periodId} value={p.periodId}>{p.name}</option>)}
              </select>
            </header>

            {role === 'GROUP' && (
              <button onClick={() => setView('create')} className="w-full p-4 bg-emerald-600 text-white rounded-2xl font-black flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-colors">
                <PlusCircle size={20} />
                <span>สร้างรายงานใหม่ (Monthly Repeat)</span>
              </button>
            )}

            <div className="grid gap-3">
              {taskList.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-dashed text-slate-400">
                  <ClipboardList className="mx-auto mb-2 opacity-20" size={48} />
                  ไม่มีรายการงานในเดือนนี้
                </div>
              ) : taskList.map(task => (
                <div 
                  key={task.taskId} 
                  onClick={() => { setSelectedTask(task); setView('detail'); }} 
                  className="p-5 bg-white border rounded-3xl flex items-center justify-between hover:border-blue-500 cursor-pointer transition-all shadow-sm group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black tracking-wider ${task.status === 'SUBMITTED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {task.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">DUE: {task.dueDate}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
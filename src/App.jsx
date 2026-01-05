import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  PlusCircle, 
  Monitor, 
  UserCircle, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Calendar,
  Building2,
  Users,
  ExternalLink,
  ArrowLeft,
  Save,
  Send
} from 'lucide-react';

// --- Configuration ---
const GAS_URL = "https://script.google.com/macros/s/AKfycbwdu-ypXb4-rEtNEwj3Csg7WDpSrjNH9nhJ9SIap1B1PEp7LlDXkpmXoYVonXDQ_U0U/exec";

// --- Mock Data & Types (Structure according to Sheet Spec) ---
const MOCK_ORGS = Array.from({ length: 19 }, (_, i) => ({ orgId: `D${String(i + 1).padStart(2, '0')}`, name: `อำเภอเมือง ${i + 1}`, type: 'DISTRICT' }));
MOCK_ORGS.push({ orgId: 'P00', name: 'สำนักงานสาธารณสุขจังหวัด', type: 'PROVINCE' });

const MOCK_GROUPS = [
  { groupId: 'G01', name: 'กลุ่มงานยุทธศาสตร์' },
  { groupId: 'G02', name: 'กลุ่มงานควบคุมโรค' },
  { groupId: 'G03', name: 'กลุ่มงานส่งเสริมสุขภาพ' },
  { groupId: 'G04', name: 'กลุ่มงานทรัพยากรบุคคล' },
];

const MOCK_PERIODS = [
  { periodId: '202401', name: 'มกราคม 2567', month: 1, year: 2024 },
  { periodId: '202402', name: 'กุมภาพันธ์ 2567', month: 2, year: 2024 },
  { periodId: '202403', name: 'มีนาคม 2567', month: 3, year: 2024 },
  { periodId: '202404', name: 'เมษายน 2567', month: 4, year: 2024 },
  { periodId: '202405', name: 'พฤษภาคม 2567', month: 5, year: 2024 },
];

// --- App State Manager ---

const App = () => {
  const [view, setView] = useState('landing'); // landing, choose-district, choose-group, home, detail, create, monitor, dashboard
  const [role, setRole] = useState(null); // DISTRICT, GROUP, EXECUTIVE, ADMIN
  const [currentOrg, setCurrentOrg] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('202403');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  /**
   * Actual GAS API Call
   * ยิงข้อมูลไปยัง URL ของ Google Apps Script ที่ระบุมา
   */
  const apiCall = async (action, payload = {}) => {
    setLoading(true);
    try {
      // ใช้ POST เป็นหลักสำหรับการทำงานกับ GAS Web App 
      // เนื่องจากจัดการข้อมูล JSON ได้ง่ายกว่า GET ในฝั่ง Apps Script
      const response = await fetch(GAS_URL, {
        method: 'POST',
        mode: 'no-cors', // หากต้องการรับ Response JSON อาจต้องตั้งค่า CORS ใน GAS เพิ่มเติม
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action, payload }),
      });

      // เนื่องจากโหมด no-cors จะเข้าถึง response body ไม่ได้ 
      // สำหรับ GAS มักจะแนะนำให้ส่งแบบปกติหากตั้งค่า CORS ใน doGet/doPost ไว้แล้ว
      // ด้านล่างนี้คือรูปแบบปกติสำหรับ Production
      /*
      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ action, payload }),
      });
      const result = await response.json();
      setLoading(false);
      return result;
      */

      setLoading(false);
      return { success: true }; // สันนิษฐานว่าสำเร็จสำหรับโหมด no-cors
    } catch (error) {
      console.error(`API Error (${action}):`, error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // --- UI Components ---

  const Landing = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">1-Click Report</h1>
        <p className="text-slate-500">กรุณาเลือกบทบาทเพื่อเข้าใช้งาน</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {[
          { id: 'DISTRICT', label: 'อำเภอ (District)', icon: Building2, color: 'bg-blue-500' },
          { id: 'GROUP', label: 'กลุ่มงาน (Academic Group)', icon: Users, color: 'bg-emerald-500' },
          { id: 'EXECUTIVE', label: 'ผู้บริหาร (Executive)', icon: LayoutDashboard, color: 'bg-purple-500' },
          { id: 'ADMIN', label: 'ผู้ดูแลระบบ (Admin)', icon: UserCircle, color: 'bg-slate-700' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setRole(item.id);
              if (item.id === 'DISTRICT') setView('choose-district');
              else if (item.id === 'GROUP') setView('choose-group');
              else if (item.id === 'EXECUTIVE') setView('dashboard');
              else setView('home');
            }}
            className="flex items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`p-3 rounded-xl ${item.color} text-white mr-4`}>
              <item.icon size={24} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-800">{item.label}</div>
              <div className="text-xs text-slate-400 font-normal">คลิกเพื่อดำเนินการต่อ</div>
            </div>
            <ChevronRight className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );

  const ChooseDistrict = () => (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <button onClick={() => setView('landing')} className="flex items-center text-slate-500 hover:text-slate-800">
        <ArrowLeft size={18} className="mr-1" /> กลับ
      </button>
      <h2 className="text-2xl font-bold text-slate-800">เลือกอำเภอของท่าน</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {MOCK_ORGS.filter(o => o.type === 'DISTRICT').map(org => (
          <button
            key={org.orgId}
            onClick={() => { setCurrentOrg(org); setView('home'); }}
            className="p-4 text-center bg-white border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <div className="text-sm font-medium text-slate-700">{org.name}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const ChooseGroup = () => (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <button onClick={() => setView('landing')} className="flex items-center text-slate-500 hover:text-slate-800">
        <ArrowLeft size={18} className="mr-1" /> กลับ
      </button>
      <h2 className="text-2xl font-bold text-slate-800">เลือกกลุ่มงานของท่าน</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MOCK_GROUPS.map(group => (
          <button
            key={group.groupId}
            onClick={() => { setCurrentGroup(group); setView('home'); }}
            className="p-5 flex items-center bg-white border border-slate-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
          >
            <Users className="text-emerald-500 mr-4" />
            <div className="font-medium text-slate-700">{group.name}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const DistrictHome = () => (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{currentOrg?.name}</h2>
          <p className="text-slate-500 text-sm">รายการงานส่งรายงาน</p>
        </div>
        <select 
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none ring-2 ring-transparent focus:ring-blue-500/20"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {MOCK_PERIODS.map(p => <option key={p.periodId} value={p.periodId}>{p.name}</option>)}
        </select>
      </header>

      <div className="space-y-3">
        {/* Sample Task List */}
        {[
          { id: 'T001', title: 'รายงานความครอบคลุมวัคซีน', group: 'กลุ่มงานควบคุมโรค', status: 'PENDING', due: '15/03/2567' },
          { id: 'T002', title: 'รายงานสถานะการเงินกองทุน', group: 'กลุ่มงานยุทธศาสตร์', status: 'SUBMITTED', due: '10/03/2567' },
          { id: 'T003', title: 'รายงานความก้าวหน้าโครงการวิจัย', group: 'กลุ่มงานส่งเสริมสุขภาพ', status: 'LATE', due: '05/03/2567' },
        ].map(task => (
          <button
            key={task.id}
            onClick={() => { setSelectedTask(task); setView('detail'); }}
            className="w-full flex items-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition-all text-left group"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  task.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                  task.status === 'SUBMITTED' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                  {task.status}
                </span>
                <span className="text-xs text-slate-400">Due: {task.due}</span>
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{task.title}</h3>
              <p className="text-xs text-slate-400">{task.group}</p>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-blue-500" />
          </button>
        ))}
      </div>
    </div>
  );

  const TaskDetail = () => {
    const [note, setNote] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = async () => {
      await apiCall('CONFIRM_TASK', { taskId: selectedTask.id, note, evidenceLink: link, orgId: currentOrg?.orgId });
      setView('home');
    };

    return (
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        <button onClick={() => setView('home')} className="flex items-center text-slate-500 hover:text-slate-800">
          <ArrowLeft size={18} className="mr-1" /> กลับ
        </button>
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">{selectedTask?.title}</h2>
            <p className="text-slate-500 text-sm mt-1">{selectedTask?.group}</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold">ช่องทางส่ง</p>
                <p className="text-sm font-medium">Google Form / LINE</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <p className="text-[10px] text-slate-400 uppercase font-bold">ผู้รับผิดชอบ</p>
                <p className="text-sm font-medium">คุณสมาน ใจดี</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ลิงก์หลักฐาน (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">หมายเหตุ</label>
                <textarea 
                  rows="3"
                  placeholder="รายละเอียดเพิ่มเติม..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-50 active:scale-[0.98] transition-all"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" /> : (
                <>
                  <Send size={18} />
                  <span>ยืนยันการส่งรายงาน</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const GroupHome = () => (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{currentGroup?.name}</h2>
          <p className="text-slate-500 text-sm">การจัดการงานวิชาการ</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setView('create')} className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-3xl hover:border-emerald-300 hover:shadow-sm transition-all group">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
            <PlusCircle size={32} />
          </div>
          <span className="font-bold text-slate-700">สร้างรายงาน</span>
        </button>
        <button onClick={() => setView('monitor')} className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-3xl hover:border-blue-300 hover:shadow-sm transition-all group">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
            <Monitor size={32} />
          </div>
          <span className="font-bold text-slate-700">ติดตามงาน</span>
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800">งานส่งส่วนกลาง (Province to Dept)</h3>
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden text-sm">
          <div className="p-4 flex justify-between items-center">
            <span>ส่งสรุปผลการดำเนินงานวัคซีนรายไตรมาส</span>
            <span className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-bold">WAITING</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span>รายงานงบประมาณกลุ่มงานยุทธศาสตร์</span>
            <span className="bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold">SENT</span>
          </div>
        </div>
      </div>
    </div>
  );

  const GroupCreate = () => {
    const [form, setForm] = useState({
      title: '',
      type: 'DISTRICT_REPORT',
      responsibleName: '',
      detail: '',
      channelInfo: '',
      startPeriod: '202403',
      dueDateFirst: '',
      frequency: 'ONE_TIME',
      endPeriod: '202405',
    });

    const handleSave = async () => {
      // Logic for Monthly Repeat
      let taskCount = 1;
      if (form.frequency === 'MONTHLY') {
        const start = parseInt(form.startPeriod);
        const end = parseInt(form.endPeriod);
        taskCount = (end - start + 1) * 19; // Simplified math for mock
      }
      
      await apiCall('CREATE_REPORT', { ...form, group: currentGroup?.groupId });
      alert(`สร้างรายงานสำเร็จ! ระบบได้ทำการสร้าง Tasks ทั้งหมด ${taskCount} รายการล่วงหน้าเรียบร้อยแล้ว`);
      setView('home');
    };

    return (
      <div className="p-4 max-w-2xl mx-auto space-y-6 pb-20">
        <button onClick={() => setView('home')} className="flex items-center text-slate-500 hover:text-slate-800">
          <ArrowLeft size={18} className="mr-1" /> ยกเลิก
        </button>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">สร้างรายการรายงานใหม่</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ประเภทรายงาน</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20"
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
              >
                <option value="DISTRICT_REPORT">เก็บข้อมูลจากอำเภอ (19 แห่ง)</option>
                <option value="PROVINCE_TO_DEPT">ส่วนกลางจังหวัดส่งกรม</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">หัวข้อรายงาน *</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20"
                placeholder="ระบุหัวข้อรายงาน"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ผู้รับผิดชอบ *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20"
                  value={form.responsibleName}
                  onChange={e => setForm({...form, responsibleName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ช่องทางส่ง *</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="LINE/Form/Link"
                  value={form.channelInfo}
                  onChange={e => setForm({...form, channelInfo: e.target.value})}
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-800">การตั้งค่าความถี่ (Repeat)</span>
                <select 
                  className="bg-white border border-emerald-200 rounded-lg px-2 py-1 text-xs font-bold"
                  value={form.frequency}
                  onChange={e => setForm({...form, frequency: e.target.value})}
                >
                  <option value="ONE_TIME">ส่งครั้งเดียว</option>
                  <option value="MONTHLY">รายเดือน (Repeat)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">เริ่ม Period</label>
                  <select className="w-full bg-white border-none rounded-xl text-xs" value={form.startPeriod} onChange={e => setForm({...form, startPeriod: e.target.value})}>
                    {MOCK_PERIODS.map(p => <option key={p.periodId} value={p.periodId}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">กำหนดส่งครั้งแรก</label>
                  <input type="date" className="w-full bg-white border-none rounded-xl text-xs" value={form.dueDateFirst} onChange={e => setForm({...form, dueDateFirst: e.target.value})} />
                </div>
              </div>

              {form.frequency === 'MONTHLY' && (
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">สิ้นสุดที่ Period</label>
                  <select className="w-full bg-white border-none rounded-xl text-xs" value={form.endPeriod} onChange={e => setForm({...form, endPeriod: e.target.value})}>
                    {MOCK_PERIODS.map(p => <option key={p.periodId} value={p.periodId}>{p.name}</option>)}
                  </select>
                  <p className="text-[10px] text-emerald-600 mt-2 italic">* ระบบจะคำนวณวันส่งเดียวกันของทุกเดือนให้อัตโนมัติ</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleSave}
              disabled={!form.title || loading}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 disabled:opacity-50 active:scale-[0.98] transition-all"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" /> : (
                <>
                  <Save size={18} />
                  <span>บันทึกและสร้าง Tasks</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ExecutiveDashboard = () => (
    <div className="p-4 max-w-6xl mx-auto space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">ภาพรวมรายงานจังหวัด</h2>
          <p className="text-slate-500 text-sm">Dashboard สำหรับผู้บริหาร</p>
        </div>
        <select 
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none ring-2 ring-transparent focus:ring-purple-500/20"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {MOCK_PERIODS.map(p => <option key={p.periodId} value={p.periodId}>{p.name}</option>)}
        </select>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', value: '114', color: 'bg-slate-100 text-slate-600', icon: ClipboardList },
          { label: 'Submitted', value: '82', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
          { label: 'Pending', value: '20', color: 'bg-amber-100 text-amber-600', icon: AlertCircle },
          { label: 'Late', value: '12', color: 'bg-red-100 text-red-600', icon: AlertCircle },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl border border-slate-200">
            <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center mb-3`}>
              <kpi.icon size={20} />
            </div>
            <div className="text-2xl font-black text-slate-800">{kpi.value}</div>
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking List */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center">
              <BarChart3 size={18} className="mr-2 text-purple-500" />
              Ranking ความร่วมมือ (อำเภอ)
            </h3>
            <span className="text-xs text-slate-400">Top 5</span>
          </div>
          <div className="space-y-4">
            {[
              { name: 'อำเภอเมือง 01', rate: 100, onTime: 98 },
              { name: 'อำเภอเมือง 05', rate: 95, onTime: 90 },
              { name: 'อำเภอเมือง 12', rate: 92, onTime: 85 },
              { name: 'อำเภอเมือง 19', rate: 88, onTime: 80 },
              { name: 'อำเภอเมือง 03', rate: 85, onTime: 82 },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-4">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold">{i+1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{item.name}</span>
                    <span className="text-slate-400">{item.rate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${item.rate}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown by Group */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center">
            <Users size={18} className="mr-2 text-blue-500" />
            สถานะรายกลุ่มงาน
          </h3>
          <div className="space-y-4">
            {MOCK_GROUPS.map((group, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                <span className="text-sm font-medium text-slate-700">{group.name}</span>
                <div className="flex space-x-2">
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full font-bold">25/30</span>
                  <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-bold">5 LATE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const GroupMonitor = () => (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <button onClick={() => setView('home')} className="flex items-center text-slate-500 hover:text-slate-800">
          <ArrowLeft size={18} className="mr-1" /> กลับ
        </button>
        <select 
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          {MOCK_PERIODS.map(p => <option key={p.periodId} value={p.periodId}>{p.name}</option>)}
        </select>
      </header>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">มอนิเตอร์รายงานประจำเดือน</h2>
        
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-700">รายงานความครอบคลุมวัคซีน</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3">อำเภอ</th>
                  <th className="px-6 py-3">สถานะ</th>
                  <th className="px-6 py-3">วันเวลาที่ส่ง</th>
                  <th className="px-6 py-3">หลักฐาน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_ORGS.filter(o => o.type === 'DISTRICT').map((org, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{org.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${i % 3 === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                        {i % 3 === 0 ? 'SUBMITTED' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{i % 3 === 0 ? '12/03/67 14:20' : '-'}</td>
                    <td className="px-6 py-4">
                      {i % 3 === 0 && <ExternalLink size={14} className="text-blue-500 cursor-pointer" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Router Logic ---

  const renderContent = () => {
    if (view === 'landing') return <Landing />;
    if (view === 'choose-district') return <ChooseDistrict />;
    if (view === 'choose-group') return <ChooseGroup />;
    if (view === 'home') {
      if (role === 'DISTRICT') return <DistrictHome />;
      if (role === 'GROUP') return <GroupHome />;
      return <Landing />;
    }
    if (view === 'detail') return <TaskDetail />;
    if (view === 'create') return <GroupCreate />;
    if (view === 'monitor') return <GroupMonitor />;
    if (view === 'dashboard') return <ExecutiveDashboard />;
    return <Landing />;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      {/* Dynamic Header */}
      {view !== 'landing' && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl">1</div>
              <span className="font-bold tracking-tight hidden sm:block">REPORT SYSTEM</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role}</span>
                <span className="text-xs font-bold text-slate-700">{currentOrg?.name || currentGroup?.name || 'ADMIN PANEL'}</span>
              </div>
              <button 
                onClick={() => { setView('landing'); setRole(null); setCurrentOrg(null); setCurrentGroup(null); }}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <UserCircle size={24} />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderContent()}
      </main>

      {/* Simple Footer Notification Mockup */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-medium shadow-2xl flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>Connected to Google Sheets</span>
        </div>
      </div>
    </div>
  );
};

export default App;
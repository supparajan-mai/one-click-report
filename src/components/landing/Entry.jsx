import React, { useState, useEffect } from 'react';
import { Building2, Users, AlertCircle, Loader2 } from 'lucide-react';
import { DISTRICTS, GROUPS } from '../../constants/organizations';
import Button from '../common/Button';

/**
 * Entry Page Component
 * หน้าเลือกชื่อหน่วยงานตาม role พร้อมโหลดจาก API
 * 
 * @param {object} auth - auth object จาก useAuth hook
 * @param {function} onNavigate - callback สำหรับ navigation
 * @param {function} onBack - callback เมื่อกดยกเลิก
 * @param {object} api - API service object
 * @param {boolean} apiConnected - สถานะการเชื่อมต่อ API
 */
const Entry = ({ auth, onNavigate, onBack, api, apiConnected = false }) => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roleLabel = auth.role === 'district' ? 'อำเภอ' : 'กลุ่มงาน';
  const RoleIcon = auth.role === 'district' ? Building2 : Users;

  // Load organizations from API
  useEffect(() => {
    const loadOrganizations = async () => {
      if (!apiConnected || !api) {
        // Use fallback data if API not connected
        setOrganizations(auth.role === 'district' ? DISTRICTS : GROUPS);
        return;
      }

      setLoading(true);
      setError('');

      try {
        let result;
        if (auth.role === 'district') {
          result = await api.getOrgs();
        } else {
          result = await api.getGroups();
        }

        if (result.status === 'success' && result.data.length > 0) {
          // Transform API data to simple array of names
          const names = result.data.map(item => 
            auth.role === 'district' ? item.orgName : item.groupName
          );
          setOrganizations(names);
        } else {
          // Fallback to constants if API returns empty
          setOrganizations(auth.role === 'district' ? DISTRICTS : GROUPS);
        }
      } catch (err) {
        console.error('Error loading organizations:', err);
        setError('ไม่สามารถโหลดข้อมูลได้ กำลังใช้ข้อมูลสำรอง');
        // Fallback to constants on error
        setOrganizations(auth.role === 'district' ? DISTRICTS : GROUPS);
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, [auth.role, api, apiConnected]);

  const handleSubmit = () => {
    if (!auth.selectedName) return;
    
    if (auth.role === 'district') {
      onNavigate('dashboard');
    } else {
      onNavigate('group_dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-8 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg ${
            auth.role === 'district' 
              ? 'bg-blue-50 text-blue-600' 
              : 'bg-emerald-50 text-emerald-600'
          }`}>
            <RoleIcon size={32} />
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
            เลือกหน่วยงาน
          </h2>
          
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">
            โปรดระบุต้นสังกัดเพื่อเข้าสู่ระบบ
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Role Info */}
          <div className={`p-5 rounded-2xl border-2 ${
            auth.role === 'district'
              ? 'bg-blue-50/50 border-blue-100'
              : 'bg-emerald-50/50 border-emerald-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  บทบาท
                </p>
                <p className={`text-lg font-black ${
                  auth.role === 'district' ? 'text-blue-700' : 'text-emerald-700'
                }`}>
                  {roleLabel}
                </p>
              </div>
              
              {/* API Status Badge */}
              {apiConnected ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-emerald-200 shadow-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                    API
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-amber-200 shadow-sm">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">
                    DEMO
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Organization Select */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">
              สังกัดหน่วยงาน
            </label>
            
            {loading ? (
              <div className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl flex items-center justify-center">
                <Loader2 size={24} className="text-blue-500 animate-spin" />
                <span className="ml-3 text-slate-500 font-bold">กำลังโหลดข้อมูล...</span>
              </div>
            ) : (
              <select 
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-slate-700 focus:border-blue-500 outline-none appearance-none cursor-pointer transition-all shadow-inner text-lg hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                value={auth.selectedName} 
                onChange={(e) => auth.selectRole(auth.role, e.target.value)}
                disabled={loading}
              >
                <option value="">เลือกจากรายการ...</option>
                {organizations.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 font-bold leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            {/* Validation Message */}
            {!auth.selectedName && !loading && (
              <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-2xl animate-in fade-in">
                <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700 font-bold leading-relaxed">
                  กรุณาเลือกหน่วยงานก่อนดำเนินการต่อ
                </p>
              </div>
            )}
          </div>

          {/* Selected Display */}
          {auth.selectedName && (
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-2xl border border-blue-100 animate-in slide-in-from-top-2">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                หน่วยงานที่เลือก:
              </p>
              <p className="text-xl font-black text-slate-800">
                {auth.selectedName}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          <Button
            disabled={!auth.selectedName || loading}
            onClick={handleSubmit}
            size="lg"
            variant="primary"
            className="w-full"
          >
            {loading ? 'กำลังโหลด...' : 'เริ่มใช้งาน'}
          </Button>
          
          <button 
            onClick={onBack}
            disabled={loading}
            className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors text-center disabled:opacity-50"
          >
            ยกเลิก
          </button>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-slate-400 text-xs text-center font-medium italic leading-relaxed">
            {auth.role === 'district' 
              ? '📋 อำเภอสามารถดูและส่งรายงานที่ได้รับมอบหมาย'
              : '🔒 กลุ่มงานจังหวัดสามารถจัดการและติดตามงานทั้งหมด'
            }
          </p>
          
          {/* Data Source Info */}
          <div className="mt-3 text-center">
            <p className="text-[10px] text-slate-300 uppercase tracking-widest">
              {apiConnected ? '📡 ข้อมูลจาก API' : '💾 ข้อมูลสำรอง'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entry;
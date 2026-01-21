import React, { useState } from 'react';
import { Lock, X, AlertCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-lg">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase">ยืนยันตัวตน</h2>
          </div>
          <button onClick={() => { setPin(''); onCancel(); }} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="bg-amber-50/50 p-6 rounded-2xl border-2 border-dashed border-amber-100">
            <p className="text-amber-900 font-bold text-sm text-center">
              หน้านี้เฉพาะเจ้าหน้าที่กลุ่มงานจังหวัดเท่านั้น<br/>กรุณาใส่รหัส PIN เพื่อเข้าถึง
            </p>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">รหัส PIN (4 หลัก)</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              className="w-full p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl font-black text-2xl text-center tracking-[0.5em] shadow-inner outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              placeholder="••••"
              autoFocus
            />
          </div>
          {error && (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5">
              <div className="flex items-center space-x-3">
                <AlertCircle size={20} className="text-rose-500" />
                <p className="text-rose-700 font-bold text-sm">{error}</p>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={pin.length !== 4 || isLoading}
            className="w-full py-6 bg-amber-600 text-white rounded-3xl font-black text-xl shadow-2xl disabled:opacity-30 hover:bg-amber-700 uppercase"
          >
            {isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PINGate;
import React from 'react';
import { X, Check, Clock, Copy } from 'lucide-react';
import Badge from '../common/Badge';
import { DISTRICTS } from '../../constants/organizations';

/**
 * Drilldown Modal Component
 * แสดงสถานะการส่งรายอำเภอแบบละเอียด พร้อม checklist ยืนยันรับเล่ม
 * 
 * @param {object} task - ข้อมูล task
 * @param {object} verifications - object ของการยืนยันรับเล่ม
 * @param {function} onClose - callback ปิด modal
 * @param {function} onVerify - callback ยืนยันรับเล่ม
 * @param {function} onCopy - callback ก๊อปปี้ข้อความ
 */
const DrilldownModal = ({ task, verifications, onClose, onVerify, onCopy }) => {
  // Mock submission status (ในระบบจริงจะดึงจาก database)
  const getSubmissionStatus = () => {
    return DISTRICTS.map((name, index) => ({
      name,
      status: index % 4 === 0 ? 'รอดำเนินการ' : 'ส่งแล้ว',
      time: index % 4 === 0 ? '-' : '10:20 น.',
      docNumber: index % 4 === 0 ? '-' : `สฎ 0019.${index + 2}/ว ${240 + index}`,
      docDate: '10 ม.ค. 2569',
      sentToProvinceDate: '11 ม.ค. 2569',
      needsDoc: task.channels?.includes('DOC')
    }));
  };

  const submissions = getSubmissionStatus();
  const submittedCount = submissions.filter(s => s.status === 'ส่งแล้ว').length;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-lg animate-in fade-in duration-300 overflow-hidden">
      <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-10 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 shrink-0">
          <div className="space-y-2 flex-1">
            <Badge color="blue">สถานะการส่งรายหน่วยงาน</Badge>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter mt-3 leading-tight">
              {task.title}
            </h2>
            <div className="flex items-center space-x-4 text-sm font-bold text-slate-400 uppercase tracking-widest italic mt-4">
              <span>กำหนดส่ง: {task.due}</span>
              <span>•</span>
              <span className="text-blue-600">ส่งแล้ว {submittedCount} / {DISTRICTS.length}</span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-4 bg-white border border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-red-500 transition-colors shadow-sm"
          >
            <X size={28} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar">
          {submissions.map((item, i) => {
            const verificationKey = `${task.id}-${item.name}`;
            const isVerified = verifications[verificationKey];
            const isSubmitted = item.status === 'ส่งแล้ว';

            return (
              <div
                key={i}
                className={`p-8 rounded-[3.5rem] border-2 flex flex-col justify-between transition-all shadow-sm ${
                  isSubmitted
                    ? 'bg-emerald-50/50 border-emerald-100'
                    : 'bg-slate-50 border-slate-100 opacity-60'
                }`}
              >
                {/* District Name & Status */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <p className="font-black text-slate-800 text-lg leading-tight tracking-tight">
                      {item.name}
                    </p>
                    {isSubmitted ? (
                      <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                        <Check size={16} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                        <Clock size={16} />
                      </div>
                    )}
                  </div>

                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                    isSubmitted ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {isSubmitted ? `ส่งเมื่อ ${item.time}` : 'รอดำเนินการ'}
                  </p>
                </div>

                {/* Document Info (if submitted & has DOC channel) */}
                {isSubmitted && item.needsDoc && (
                  <div className="mt-8 pt-6 border-t border-emerald-200/50 space-y-4">
                    {/* Document Number */}
                    <div className="p-5 bg-white rounded-2xl border border-emerald-100 space-y-3 shadow-inner">
                      <div className="flex justify-between items-center group cursor-pointer" onClick={() => onCopy(item.docNumber)}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                          เลขหนังสือจากพื้นที่
                        </p>
                        <div className="flex items-center space-x-1 text-slate-300 group-hover:text-blue-600 transition-colors">
                          <Copy size={12} />
                          <span className="text-[8px] font-black uppercase">ก๊อปปี้</span>
                        </div>
                      </div>
                      <p className="text-sm font-black text-slate-800 leading-tight bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {item.docNumber}
                      </p>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          ลงวันที่: {item.docDate}
                        </p>
                        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                          ส่งถึงจังหวัด: {item.sentToProvinceDate}
                        </p>
                      </div>
                    </div>

                    {/* Verification Checkbox */}
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={!!isVerified}
                            onChange={(e) => {
                              if (e.target.checked) {
                                onVerify(task.id, item.name, new Date().toLocaleString('th-TH'));
                              } else {
                                onVerify(task.id, item.name, null);
                              }
                            }}
                            className="peer appearance-none w-6 h-6 bg-white border-2 border-emerald-200 rounded-lg checked:bg-slate-800 checked:border-slate-800 transition-all cursor-pointer shadow-sm"
                          />
                          <Check 
                            size={14} 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" 
                          />
                        </div>
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">
                          ยืนยันรับเล่มตัวจริงแล้ว
                        </span>
                      </label>

                      {/* Timestamp */}
                      {isVerified && (
                        <div className="p-3 bg-slate-900 rounded-2xl animate-in slide-in-from-top-1">
                          <p className="text-[9px] font-black text-white uppercase tracking-widest">
                            TIMESTAMP: {isVerified}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-10 bg-white border-t border-slate-100 text-center shrink-0">
          <button
            onClick={onClose}
            className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all"
          >
            ปิดหน้านี้
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrilldownModal;
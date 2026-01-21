import React, { useState } from 'react';
import { MapPin, Globe2, FileText, ExternalLink, Check, RefreshCcw } from 'lucide-react';
import Navbar from '../common/Navbar';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Checkbox } from '../common/Input';
import Button from '../common/Button';

/**
 * Task Detail P2D Component (Province to Department)
 * หน้ารายละเอียดงานและส่งรายงานสำหรับจังหวัดส่งกรม
 * 
 * @param {object} task - ข้อมูล task
 * @param {function} onBack - callback ย้อนกลับ
 * @param {function} onSubmit - callback เมื่อส่งงาน
 */
const TaskDetailP2D = ({ task, onBack, onSubmit }) => {
  const [documentSent, setDocumentSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate if DOC channel requires confirmation
    if (task.channels?.includes('DOC') && !documentSent) {
      alert('กรุณายืนยันว่าส่งหนังสือราชการแล้ว');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Submit
    onSubmit(task.id, {
      status: 'ส่งแล้ว',
      submittedAt: new Date().toISOString(),
      documentSent
    });
    
    setIsSubmitting(false);
  };

  const handleResubmit = () => {
    onSubmit(task.id, { status: 'รอดำเนินการ' });
    setDocumentSent(false);
  };

  const isSubmitted = task.status === 'ส่งแล้ว';

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Navbar */}
      <Navbar
        title="หน้าดำเนินการรายงาน (ส่งกรม)"
        onBack={onBack}
        badge="P"
        badgeColor="emerald"
      />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 md:p-8">
        <Card variant="elevated" className="overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          {/* Header Section */}
          <div className="p-10 border-b border-slate-50 bg-gradient-to-br from-emerald-50/30 to-slate-50/50 relative">
            {/* Status & Due Date */}
            <div className="flex justify-between items-start mb-6">
              <Badge color={isSubmitted ? 'emerald' : 'amber'}>
                {task.status}
              </Badge>
              <span className="text-xs font-black text-slate-400 tracking-widest uppercase">
                กำหนดส่ง: {task.due}
              </span>
            </div>

            {/* Task Title */}
            <h1 className="text-4xl font-black text-slate-800 leading-tight tracking-tighter uppercase mb-4">
              {task.title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center space-x-4">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center">
                <MapPin size={14} className="mr-2" /> 
                PIC: {task.responsibleName}
              </p>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                {task.type}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-10 space-y-12">
            {/* Remark */}
            {task.remark && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">
                  หมายเหตุ
                </h3>
                <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border-2 border-dashed border-emerald-100 text-emerald-900 font-bold italic text-lg text-center shadow-inner leading-relaxed">
                  "{task.remark}"
                </div>
              </div>
            )}

            {/* Submission Channels */}
            <div className="space-y-10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">
                ข้อมูลการส่งรายงาน
              </h3>

              <div className="grid grid-cols-1 gap-8">
                {/* Online Channel */}
                {task.channels?.includes('ONLINE') && (
                  <div className="space-y-4">
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest ml-1">
                      ช่องทางส่งออนไลน์ (คลิกเพื่อรายงาน)
                    </p>
                    {task.onlineLinks?.map((link, i) => (
                      <a 
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-6 bg-emerald-50 border-2 border-emerald-100 rounded-3xl text-emerald-700 font-black hover:bg-emerald-600 hover:text-white transition-all group"
                      >
                        <Globe2 size={24} className="mr-5 text-emerald-400 group-hover:text-white" />
                        <span className="truncate flex-1 text-lg font-bold tracking-tight">
                          {link}
                        </span>
                        <ExternalLink size={18} className="ml-3 opacity-30" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Document Channel - Simple Checkbox */}
                {task.channels?.includes('DOC') && (
                  <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[3rem] space-y-6 shadow-inner">
                    <div className="flex items-center space-x-3 text-slate-800">
                      <FileText size={24} className="text-slate-400" />
                      <span className="text-xl tracking-tight font-black">
                        ข้อมูลทางสารบรรณ
                      </span>
                    </div>

                    {!isSubmitted ? (
                      <div className="bg-white p-6 rounded-3xl border border-emerald-100">
                        <Checkbox
                          label="ดำเนินการส่งหนังสือราชการให้กรมเรียบร้อยแล้ว"
                          checked={documentSent}
                          onChange={(e) => setDocumentSent(e.target.checked)}
                        />
                        
                        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                          <p className="text-xs text-amber-800 font-medium italic">
                            💡 กรุณาติ๊กเครื่องหมายหลังจากส่งหนังสือราชการจริงแล้วเท่านั้น
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-200 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                          <Check size={24} />
                        </div>
                        <div>
                          <p className="font-black text-lg text-emerald-800">
                            ส่งหนังสือราชการแล้ว
                          </p>
                          <p className="text-sm text-emerald-600 mt-1">
                            ยืนยันการดำเนินการเรียบร้อย
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Related Documents from Department */}
            {task.relatedDocLink && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">
                  เอกสารจากกรม
                </h3>
                <a
                  href={task.relatedDocLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-6 bg-purple-50 border-2 border-purple-100 rounded-2xl hover:bg-purple-100 transition-all group"
                >
                  <FileText size={20} className="mr-3 text-purple-400" />
                  <span className="text-sm font-bold text-purple-700 group-hover:text-purple-900 transition-colors">
                    แบบรายงาน / แนวทางจากกรม
                  </span>
                  <ExternalLink size={16} className="ml-auto text-purple-300" />
                </a>
              </div>
            )}

            {/* Action Section */}
            <div className="pt-10 border-t border-slate-100">
              {isSubmitted ? (
                <div className="bg-emerald-50 p-10 rounded-[3rem] border-2 border-emerald-100 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <Check size={40} />
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-black text-emerald-800 tracking-tighter uppercase">
                      ส่งรายงานแล้ว
                    </h2>
                    <p className="text-emerald-600 font-bold text-sm mt-3 uppercase tracking-widest opacity-60">
                      อัปเดตข้อมูลในระบบสำเร็จ
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={onBack}
                      variant="success"
                      size="lg"
                      className="w-full"
                    >
                      เรียบร้อย
                    </Button>
                    
                    <button
                      onClick={handleResubmit}
                      className="flex items-center justify-center space-x-2 text-slate-400 hover:text-emerald-600 transition-colors font-black text-[10px] uppercase tracking-widest"
                    >
                      <RefreshCcw size={14} />
                      <span>ต้องการแก้ไขข้อมูลและส่งซ้ำ</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  variant="success"
                  size="lg"
                  className="w-full"
                >
                  {isSubmitting ? 'กำลังส่ง...' : 'ยืนยันการส่งรายงาน'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default TaskDetailP2D;
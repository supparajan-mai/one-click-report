import React, { useState } from 'react';
import { MapPin, Globe2, FileText, ExternalLink, Check, RefreshCcw } from 'lucide-react';
import Navbar from '../common/Navbar';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Input } from '../common/Input';
import Button from '../common/Button';

/**
 * Task Detail Component (District to Province)
 * หน้ารายละเอียดงานและส่งรายงานสำหรับอำเภอ
 * 
 * @param {object} task - ข้อมูล task
 * @param {function} onBack - callback ย้อนกลับ
 * @param {function} onSubmit - callback เมื่อส่งงาน
 */
const TaskDetail = ({ task, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    docNumber: '',
    docDate: '',
    sentDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate
    if (task.channels?.includes('DOC')) {
      if (!formData.docNumber || !formData.docDate || !formData.sentDate) {
        alert('กรุณากรอกข้อมูลหนังสือราชการให้ครบถ้วน');
        return;
      }
    }

    setIsSubmitting(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Submit
    onSubmit(task.id, {
      status: 'ส่งแล้ว',
      submittedAt: new Date().toISOString(),
      documentInfo: formData
    });
    
    setIsSubmitting(false);
  };

  const handleResubmit = () => {
    onSubmit(task.id, { status: 'รอดำเนินการ' });
    setFormData({ docNumber: '', docDate: '', sentDate: '' });
  };

  const isSubmitted = task.status === 'ส่งแล้ว';

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Navbar */}
      <Navbar
        title="หน้าดำเนินการรายงาน"
        onBack={onBack}
        badge="D"
        badgeColor="blue"
      />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 md:p-8">
        <Card variant="elevated" className="overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          {/* Header Section */}
          <div className="p-10 border-b border-slate-50 bg-slate-50/50 relative">
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
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center">
              <MapPin size={14} className="mr-2" /> 
              PIC: {task.responsibleName} | {task.type}
            </p>
          </div>

          {/* Content Section */}
          <div className="p-10 space-y-12">
            {/* Remark */}
            {task.remark && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">
                  หมายเหตุ
                </h3>
                <div className="bg-amber-50/50 p-8 rounded-[2.5rem] border-2 border-dashed border-amber-100 text-amber-900 font-bold italic text-lg text-center shadow-inner leading-relaxed">
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
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest ml-1">
                      ช่องทางส่งออนไลน์ (คลิกเพื่อรายงาน)
                    </p>
                    {task.onlineLinks?.map((link, i) => (
                      <a 
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-6 bg-blue-50 border-2 border-blue-100 rounded-3xl text-blue-700 font-black hover:bg-blue-600 hover:text-white transition-all group"
                      >
                        <Globe2 size={24} className="mr-5 text-blue-400 group-hover:text-white" />
                        <span className="truncate flex-1 text-lg font-bold tracking-tight">
                          {link}
                        </span>
                        <ExternalLink size={18} className="ml-3 opacity-30" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Document Channel */}
                {task.channels?.includes('DOC') && (
                  <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[3rem] space-y-8 shadow-inner">
                    <div className="flex items-center space-x-3 text-slate-800">
                      <FileText size={24} className="text-slate-400" />
                      <span className="text-xl tracking-tight font-black">
                        ข้อมูลทางสารบรรณ
                      </span>
                    </div>

                    {!isSubmitted ? (
                      <div className="space-y-6">
                        <Input
                          label="เลขที่หนังสือที่ส่งจริง"
                          type="text"
                          value={formData.docNumber}
                          onChange={(e) => setFormData({...formData, docNumber: e.target.value})}
                          placeholder="สฎ 0019/..."
                          required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="วันที่ออกหนังสือ"
                            type="date"
                            value={formData.docDate}
                            onChange={(e) => setFormData({...formData, docDate: e.target.value})}
                            required
                          />

                          <Input
                            label="วันที่ส่งให้จังหวัด"
                            type="date"
                            value={formData.sentDate}
                            onChange={(e) => setFormData({...formData, sentDate: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 bg-white p-6 rounded-2xl">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                              เลขที่หนังสือ
                            </p>
                            <p className="text-lg font-black text-slate-800">
                              {formData.docNumber || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                              วันที่ออกหนังสือ
                            </p>
                            <p className="text-lg font-black text-slate-800">
                              {formData.docDate || '-'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                            วันที่ส่งให้จังหวัด
                          </p>
                          <p className="text-lg font-black text-slate-800">
                            {formData.sentDate || '-'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Related Documents */}
            {task.relatedDocLink && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-3">
                  เอกสารประกอบ
                </h3>
                <a
                  href={task.relatedDocLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all group"
                >
                  <FileText size={20} className="mr-3 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                    แบบรายงาน / เอกสารแนบ
                  </span>
                  <ExternalLink size={16} className="ml-auto text-slate-300" />
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
                      className="flex items-center justify-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-widest"
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
                  variant="primary"
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

export default TaskDetail;
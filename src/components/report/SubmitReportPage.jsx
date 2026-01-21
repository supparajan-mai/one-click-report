// SubmitReportPage.jsx - หน้าส่งรายงานจังหวัดไปกรม (P2D)
// วางไฟล์นี้ใน src/components/report/SubmitReportPage.jsx

import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Send, CheckCircle2, Clock, 
  Calendar, FileText, Link2, AlertCircle,
  ChevronDown, ChevronRight, X, Check
} from 'lucide-react';

/**
 * Submit Report Page Component
 * หน้าสำหรับจังหวัดส่งรายงานไปกรม (P2D only)
 * 
 * @param {object} auth - authentication data
 * @param {array} reports - all reports from API
 * @param {function} onBack - callback to go back
 * @param {function} onSubmit - callback when submit report
 */
const SubmitReportPage = ({ auth, reports = [], onBack, onSubmit }) => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const GROUPS = [
    "กลุ่มงานประสานฯ", 
    "กลุ่มงานยุทธศาสตร์ฯ", 
    "กลุ่มงานส่งเสริมฯ", 
    "กลุ่มงานสารสนเทศฯ"
  ];

  // Filter reports: เฉพาะ P2D และกลุ่มงานที่เลือก
  const filteredReports = useMemo(() => {
    if (!selectedGroup) return [];
    
    return reports.filter(report => 
      report.type === 'P2D' && 
      report.ownerGroupId === selectedGroup
    );
  }, [reports, selectedGroup]);

  // Handle group selection
  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    setSelectedReport(null); // Reset selected report
  };

  // Handle report selection
  const handleReportClick = (report) => {
    setSelectedReport(report);
    setShowSuccess(false); // Reset success message
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedReport) return;

    setIsSubmitting(true);

    try {
      // Create submission data
      const submissionData = {
        reportId: selectedReport.reportId,
        submittedBy: auth.selectedName,
        submittedAt: new Date().toISOString(),
        status: 'ส่งแล้ว'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('📤 Submitting report to department:', submissionData);

      // Call parent callback
      if (onSubmit) {
        onSubmit(submissionData);
      }

      // Show success message
      setShowSuccess(true);

      // Clear form after 2 seconds
      setTimeout(() => {
        setSelectedReport(null);
        setSelectedGroup('');
        setShowSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Error submitting report:', error);
      alert('❌ เกิดข้อผิดพลาดในการส่งรายงาน');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400 hover:text-slate-700"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">
                  ส่งรายงานไปกรม
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  ยืนยันการส่งรายงานจังหวัดไปยังกรม
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 animate-in slide-in-from-top-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-emerald-900 text-lg">ส่งรายงานสำเร็จ!</h3>
                <p className="text-emerald-700 text-sm mt-1">
                  บันทึกการส่งรายงานไปยังกรมเรียบร้อยแล้ว
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Group Selection */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4">
            เลือกกลุ่มงาน
          </h2>
          
          <div className="relative">
            <select
              value={selectedGroup}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 text-lg focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="">-- เลือกกลุ่มงาน --</option>
              {GROUPS.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <ChevronDown 
              size={24} 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
            />
          </div>

          {selectedGroup && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-xl w-fit">
              <CheckCircle2 size={16} />
              <span className="font-bold">เลือก: {selectedGroup}</span>
            </div>
          )}
        </div>

        {/* Reports List */}
        {selectedGroup && (
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                รายการรายงาน
              </h2>
              <span className="text-sm font-bold text-slate-500">
                {filteredReports.length} รายการ
              </span>
            </div>

            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">
                  ไม่มีรายงาน
                </h3>
                <p className="text-slate-400">
                  ยังไม่มีรายงานสำหรับกลุ่มงานนี้
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReports.map(report => {
                  const isSelected = selectedReport?.reportId === report.reportId;
                  const lastSubmission = report.lastSubmittedAt;
                  
                  return (
                    <button
                      key={report.reportId}
                      onClick={() => handleReportClick(report)}
                      className={`
                        w-full p-6 rounded-2xl border-2 transition-all text-left
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                            {report.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            {/* Due Date */}
                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                              <Calendar size={14} />
                              <span>ครบกำหนด: {report.detail?.dueDate || '-'}</span>
                            </div>

                            {/* Last Submission */}
                            {lastSubmission && (
                              <div className="flex items-center space-x-2 text-sm text-emerald-600">
                                <CheckCircle2 size={14} />
                                <span>ส่งล่าสุด: {formatDate(lastSubmission)}</span>
                              </div>
                            )}

                            {!lastSubmission && (
                              <div className="flex items-center space-x-2 text-sm text-amber-600">
                                <Clock size={14} />
                                <span>ยังไม่ได้ส่ง</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <ChevronRight 
                          size={24} 
                          className={isSelected ? 'text-blue-500' : 'text-slate-300'} 
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Report Details */}
        {selectedReport && (
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                รายละเอียดรายงาน
              </h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                หัวข้อรายงาน
              </label>
              <p className="text-xl font-bold text-slate-800">
                {selectedReport.title}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner Group */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  กลุ่มงานรับผิดชอบ
                </label>
                <p className="text-base font-bold text-slate-700">
                  {selectedReport.ownerGroupId}
                </p>
              </div>

              {/* Responsible Person */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  นักวิชาการรับผิดชอบ
                </label>
                <p className="text-base font-bold text-slate-700">
                  {selectedReport.responsibleName}
                </p>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  วันครบกำหนดส่ง
                </label>
                <p className="text-base font-bold text-slate-700 flex items-center space-x-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span>{selectedReport.detail?.dueDate || '-'}</span>
                </p>
              </div>

              {/* Repeat Type */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  รอบการรายงาน
                </label>
                <p className="text-base font-bold text-slate-700">
                  {selectedReport.detail?.repeatType === 'MONTHLY' ? 'ทุกเดือน' : 'ครั้งเดียว'}
                </p>
              </div>
            </div>

            {/* Channels */}
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                ช่องทางการรายงาน
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedReport.channelInfo?.channels?.map(channel => (
                  <span 
                    key={channel}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold"
                  >
                    {channel === 'ONLINE' ? '🌐 ออนไลน์' : '📄 หนังสือราชการ'}
                  </span>
                ))}
              </div>
            </div>

            {/* Online Links */}
            {selectedReport.channelInfo?.onlineLinks?.length > 0 && (
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  ลิ้งรายงานออนไลน์
                </label>
                <div className="space-y-2">
                  {selectedReport.channelInfo.onlineLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Link2 size={14} />
                      <span className="underline">{link}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Reference Links */}
            {selectedReport.channelInfo?.referenceLinks?.length > 0 && (
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  เอกสารที่เกี่ยวข้อง
                </label>
                <div className="space-y-2">
                  {selectedReport.channelInfo.referenceLinks.filter(link => link).map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      <FileText size={14} />
                      <span className="underline">{link}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Remark */}
            {selectedReport.remark && (
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  หมายเหตุ
                </label>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl leading-relaxed">
                  {selectedReport.remark}
                </p>
              </div>
            )}

            {/* Last Submission Info */}
            {selectedReport.lastSubmittedAt && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      ส่งรายงานแล้ว
                    </p>
                    <p className="text-xs text-emerald-700 mt-1">
                      ส่งล่าสุด: {formatDate(selectedReport.lastSubmittedAt)}
                    </p>
                    {selectedReport.lastSubmittedBy && (
                      <p className="text-xs text-emerald-600 mt-1">
                        โดย: {selectedReport.lastSubmittedBy}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center space-x-3
                  transition-all transform active:scale-95
                  ${isSubmitting 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>กำลังบันทึก...</span>
                  </>
                ) : (
                  <>
                    <Send size={24} />
                    <span>ยืนยันการส่งรายงาน</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-3">
                💡 คุณสามารถส่งรายงานซ้ำได้หากต้องการอัพเดทข้อมูล
              </p>
            </div>
          </div>
        )}

        {/* Help Info */}
        {!selectedReport && selectedGroup && filteredReports.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 mb-2">วิธีการใช้งาน</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>1. คลิกเลือกรายงานที่ต้องการส่ง</li>
                  <li>2. ตรวจสอบรายละเอียดให้ครบถ้วน</li>
                  <li>3. กดปุ่ม "ยืนยันการส่งรายงาน"</li>
                  <li>4. ระบบจะบันทึกวันเวลาที่ส่งโดยอัตโนมัติ</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubmitReportPage;
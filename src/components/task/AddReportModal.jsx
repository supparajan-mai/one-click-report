import React, { useState } from 'react';
import { X, FileText, CalendarIcon, PlusCircle, Link2, Trash2 } from 'lucide-react';
import { Input, Textarea, Select, Checkbox } from '../common/Input';
import Button from '../common/Button';
import { MONTHS, YEARS } from '../../constants/time';

/**
 * Add Report Modal Component
 * Modal สำหรับสร้างรายการรายงานใหม่ (Province only)
 * 
 * @param {boolean} isOpen - แสดง modal หรือไม่
 * @param {function} onClose - callback ปิด modal
 * @param {function} onSubmit - callback เมื่อบันทึก
 * @param {string} defaultGroup - กลุ่มงานเริ่มต้น
 */
const AddReportModal = ({ isOpen, onClose, onSubmit, defaultGroup = '' }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'อำเภอส่งจังหวัด',
    group: defaultGroup,
    responsibleName: '',
    dueDate: '',
    isRepeat: false,
    repeatUntilMonth: MONTHS[0],
    repeatUntilYear: YEARS[0],
    channels: ['ONLINE'],
    onlineLinks: [''],
    relatedDocLink: '',
    remark: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleChannelToggle = (channel) => {
    const channels = formData.channels.includes(channel)
      ? formData.channels.filter(c => c !== channel)
      : [...formData.channels, channel];
    handleChange('channels', channels);
  };

  const handleAddOnlineLink = () => {
    handleChange('onlineLinks', [...formData.onlineLinks, '']);
  };

  const handleRemoveOnlineLink = (index) => {
    const links = formData.onlineLinks.filter((_, i) => i !== index);
    handleChange('onlineLinks', links.length > 0 ? links : ['']);
  };

  const handleOnlineLinkChange = (index, value) => {
    const links = [...formData.onlineLinks];
    links[index] = value;
    handleChange('onlineLinks', links);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'กรุณาระบุหัวข้อรายงาน';
    }

    if (!formData.responsibleName.trim()) {
      newErrors.responsibleName = 'กรุณาระบุผู้รับผิดชอบ';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'กรุณาระบุกำหนดส่ง';
    }

    if (formData.channels.length === 0) {
      newErrors.channels = 'กรุณาเลือกช่องทางอย่างน้อย 1 ช่องทาง';
    }

    if (formData.channels.includes('ONLINE')) {
      const hasValidLink = formData.onlineLinks.some(link => link.trim());
      if (!hasValidLink) {
        newErrors.onlineLinks = 'กรุณาระบุลิงก์รายงานอย่างน้อย 1 ลิงก์';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clean up online links
    const cleanedLinks = formData.onlineLinks.filter(link => link.trim());

    // Submit
    onSubmit({
      ...formData,
      onlineLinks: cleanedLinks
    });

    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    // Reset form
    setFormData({
      title: '',
      type: 'อำเภอส่งจังหวัด',
      group: defaultGroup,
      responsibleName: '',
      dueDate: '',
      isRepeat: false,
      repeatUntilMonth: MONTHS[0],
      repeatUntilYear: YEARS[0],
      channels: ['ONLINE'],
      onlineLinks: [''],
      relatedDocLink: '',
      remark: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-lg animate-in fade-in duration-300 overflow-hidden">
      <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="p-10 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl">
              <FileText size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
              สร้างรายการรายงาน
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">
              ข้อมูลพื้นฐาน
            </h3>

            <Input
              label="หัวข้อรายงาน"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="ระบุหัวข้อรายงาน..."
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                label="ประเภทรายงาน"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                options={[
                  'อำเภอส่งจังหวัด',
                  'จังหวัดส่งกรม'
                ]}
              />

              <Input
                label="ผู้รับผิดชอบ (จังหวัด)"
                type="text"
                value={formData.responsibleName}
                onChange={(e) => handleChange('responsibleName', e.target.value)}
                placeholder="ระบุชื่อนักวิชาการ..."
                required
              />
            </div>
          </div>

          {/* Schedule Section */}
          <div className="p-10 bg-blue-50/50 rounded-[3rem] border-2 border-blue-100 space-y-8 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-blue-800">
                <CalendarIcon size={22} />
                <span className="text-sm font-black uppercase tracking-widest leading-none">
                  กำหนดส่งและระบบทำซ้ำ
                </span>
              </div>
              <Checkbox
                label="ทำซ้ำรายเดือน"
                checked={formData.isRepeat}
                onChange={(e) => handleChange('isRepeat', e.target.checked)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label={`กำหนดส่ง${formData.isRepeat ? ' (เดือนแรก)' : ''}`}
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                required
              />

              {formData.isRepeat && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-4">
                    สิ้นสุดเดือน/ปี
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 p-5 bg-white border-none rounded-3xl font-black shadow-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                      value={formData.repeatUntilMonth}
                      onChange={(e) => handleChange('repeatUntilMonth', e.target.value)}
                    >
                      {MONTHS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      className="w-24 p-5 bg-white border-none rounded-3xl font-black shadow-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                      value={formData.repeatUntilYear}
                      onChange={(e) => handleChange('repeatUntilYear', e.target.value)}
                    >
                      {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <Textarea
              label="หมายเหตุ"
              value={formData.remark}
              onChange={(e) => handleChange('remark', e.target.value)}
              placeholder="ระบุสิ่งที่หน่วยงานต้องเตรียม..."
              rows={3}
            />
          </div>

          {/* Channels Section */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">
              ช่องทางการรายงาน (เลือกได้ทั้งคู่)
            </h3>

            <div className="flex gap-10 px-6">
              <Checkbox
                label="ออนไลน์"
                checked={formData.channels.includes('ONLINE')}
                onChange={() => handleChannelToggle('ONLINE')}
              />
              <Checkbox
                label="หนังสือราชการ"
                checked={formData.channels.includes('DOC')}
                onChange={() => handleChannelToggle('DOC')}
              />
            </div>

            {errors.channels && (
              <p className="text-rose-500 text-sm font-bold ml-6">
                {errors.channels}
              </p>
            )}

            {/* Online Links */}
            {formData.channels.includes('ONLINE') && (
              <div className="space-y-5 p-8 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-2 italic">
                  ระบุลิงก์รายงาน (กี่รายการก็ได้)
                </p>

                {formData.onlineLinks.map((link, index) => (
                  <div key={index} className="flex gap-4 animate-in slide-in-from-top-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="url"
                        className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-3xl font-black shadow-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                        placeholder="https://..."
                        value={link}
                        onChange={(e) => handleOnlineLinkChange(index, e.target.value)}
                      />
                    </div>
                    {formData.onlineLinks.length > 1 && (
                      <button
                        onClick={() => handleRemoveOnlineLink(index)}
                        className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}

                {errors.onlineLinks && (
                  <p className="text-rose-500 text-sm font-bold ml-6">
                    {errors.onlineLinks}
                  </p>
                )}

                <button
                  onClick={handleAddOnlineLink}
                  className="flex items-center space-x-3 text-blue-600 font-black text-xs uppercase tracking-widest ml-6 hover:underline"
                >
                  <PlusCircle size={18} />
                  <span>เพิ่มลิงก์สำรอง +</span>
                </button>
              </div>
            )}
          </div>

          {/* Related Documents */}
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="relative">
              <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 z-10" size={20} />
              <Input
                label="ลิงก์เอกสารประกอบ / แบบรายงาน"
                type="url"
                value={formData.relatedDocLink}
                onChange={(e) => handleChange('relatedDocLink', e.target.value)}
                placeholder="https://drive.google.com/..."
                className="pl-14"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 bg-white border-t border-slate-100 shrink-0">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="primary"
            size="lg"
            className="w-full"
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกและเปิดระบบรายงาน'}
          </Button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AddReportModal;
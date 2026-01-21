// AddReportPage.jsx - หน้าเพิ่มรายงานใหม่
// วางไฟล์นี้ใน src/components/report/AddReportPage.jsx

import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Plus, X, Link2, FileText, 
  Calendar, Users, Building2, AlertCircle, CheckCircle2 
} from 'lucide-react';

/**
 * Add Report Page Component
 * หน้าสำหรับสร้างรายงานใหม่ (ทั้ง D2P และ P2D)
 * 
 * @param {object} auth - authentication data
 * @param {function} onBack - callback to go back
 * @param {function} onSave - callback when save report
 */
const AddReportPage = ({ auth, onBack, onSave }) => {
  // Form State
  const [formData, setFormData] = useState({
    // Basic Info
    reportType: 'D2P', // D2P หรือ P2D
    title: '',
    ownerGroupId: auth.selectedName || '',
    responsibleName: '',
    
    // Due Date
    dueDate: '',
    
    // Repeat Settings
    repeatType: 'ONCE', // ONCE หรือ MONTHLY
    repeatUntilMonth: '09', // ถ้าเลือก MONTHLY
    repeatUntilYear: '2569',
    
    // Channels (array)
    channels: [], // ['ONLINE', 'DOC']
    
    // Links
    onlineLinks: [''], // array of links
    referenceLinks: [''], // array of reference doc links
    
    // Note
    remark: '',
    
    // Target (สำหรับ D2P)
    targetDistricts: [] // ถ้าว่างคือทุกอำเภอ
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants
  const REPORT_TYPES = [
    { value: 'D2P', label: 'อำเภอส่งจังหวัด', description: 'รายงานที่อำเภอต้องส่งให้จังหวัด' },
    { value: 'P2D', label: 'จังหวัดส่งกรม', description: 'รายงานที่จังหวัดต้องส่งให้กรม' }
  ];

  const REPEAT_TYPES = [
    { value: 'ONCE', label: 'ครั้งเดียว' },
    { value: 'MONTHLY', label: 'ทุกเดือน' }
  ];

  const CHANNELS = [
    { value: 'ONLINE', label: 'ออนไลน์', icon: Link2 },
    { value: 'DOC', label: 'หนังสือราชการ', icon: FileText }
  ];

  const GROUPS = [
    "กลุ่มงานประสานฯ", 
    "กลุ่มงานยุทธศาสตร์ฯ", 
    "กลุ่มงานส่งเสริมฯ", 
    "กลุ่มงานสารสนเทศฯ"
  ];

  // Handlers
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleChannelToggle = (channel) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleAddLink = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], '']
    }));
  };

  const handleRemoveLink = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleLinkChange = (type, index, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((link, i) => i === index ? value : link)
    }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'กรุณาระบุหัวข้อรายงาน';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'กรุณาระบุวันครบกำหนดส่ง';
    }

    if (!formData.responsibleName.trim()) {
      newErrors.responsibleName = 'กรุณาระบุนักวิชาการรับผิดชอบ';
    }

    if (formData.channels.length === 0) {
      newErrors.channels = 'กรุณาเลือกช่องทางรายงานอย่างน้อย 1 ช่องทาง';
    }

    // ถ้าเลือก ONLINE ต้องมีลิ้งอย่างน้อย 1 ลิ้งที่ไม่ว่าง
    if (formData.channels.includes('ONLINE')) {
      const validLinks = formData.onlineLinks.filter(link => link.trim());
      if (validLinks.length === 0) {
        newErrors.onlineLinks = 'กรุณาระบุลิ้งรายงานออนไลน์อย่างน้อย 1 ลิ้ง';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Clean up data
    const cleanData = {
      ...formData,
      onlineLinks: formData.onlineLinks.filter(link => link.trim()),
      referenceLinks: formData.referenceLinks.filter(link => link.trim()),
      // Generate reportId (ในระบบจริงจะให้ backend generate)
      reportId: `RPT-${Date.now()}`,
      active: true,
      createdAt: new Date().toISOString()
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('📝 Saving report:', cleanData);
      
      if (onSave) {
        onSave(cleanData);
      }
      
      // Show success message
      alert('✅ บันทึกรายงานสำเร็จ!');
      
      // Go back
      onBack();
    } catch (error) {
      console.error('Error saving report:', error);
      alert('❌ เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setIsSubmitting(false);
    }
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
                  สร้างรายงานใหม่
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  สร้างรายการรายงานสำหรับอำเภอหรือกรม
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Form */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type Selection */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
            <h2 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-tight">
              ประเภทรายงาน
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REPORT_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('reportType', type.value)}
                  className={`
                    p-6 rounded-2xl border-2 transition-all text-left
                    ${formData.reportType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5
                      ${formData.reportType === type.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300'
                      }
                    `}>
                      {formData.reportType === type.value && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{type.label}</h3>
                      <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 space-y-6">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
              รายละเอียดรายงาน
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                หัวข้อรายงาน <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-2xl border-2 font-medium
                  focus:outline-none focus:border-blue-500
                  ${errors.title ? 'border-red-300' : 'border-slate-200'}
                `}
                placeholder="เช่น รายงานผลการดำเนินงาน..."
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1 ml-2">{errors.title}</p>
              )}
            </div>

            {/* Owner Group */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                กลุ่มงานรับผิดชอบ <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.ownerGroupId}
                onChange={(e) => handleChange('ownerGroupId', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 font-medium focus:outline-none focus:border-blue-500"
              >
                {GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Responsible Person */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                นักวิชาการรับผิดชอบ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.responsibleName}
                onChange={(e) => handleChange('responsibleName', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-2xl border-2 font-medium
                  focus:outline-none focus:border-blue-500
                  ${errors.responsibleName ? 'border-red-300' : 'border-slate-200'}
                `}
                placeholder="ชื่อนักวิชาการ"
              />
              {errors.responsibleName && (
                <p className="text-red-500 text-xs mt-1 ml-2">{errors.responsibleName}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                วันครบกำหนดส่ง <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className={`
                  w-full px-4 py-3 rounded-2xl border-2 font-medium
                  focus:outline-none focus:border-blue-500
                  ${errors.dueDate ? 'border-red-300' : 'border-slate-200'}
                `}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1 ml-2">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Repeat Settings */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 space-y-6">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
              รอบการรายงาน
            </h2>

            {/* Repeat Type */}
            <div className="grid grid-cols-2 gap-4">
              {REPEAT_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('repeatType', type.value)}
                  className={`
                    p-4 rounded-2xl border-2 font-bold transition-all
                    ${formData.repeatType === type.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }
                  `}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Repeat Until (if MONTHLY) */}
            {formData.repeatType === 'MONTHLY' && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
                <p className="text-sm text-purple-700 font-medium">
                  📅 จะสร้างรายงานทุกเดือนจนถึง <strong>กันยายน {formData.repeatUntilYear}</strong> โดยอัตโนมัติ
                </p>
              </div>
            )}
          </div>

          {/* Channels */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 space-y-6">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
              ช่องทางการรายงาน <span className="text-red-500">*</span>
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {CHANNELS.map(channel => {
                const Icon = channel.icon;
                const isSelected = formData.channels.includes(channel.value);
                return (
                  <button
                    key={channel.value}
                    type="button"
                    onClick={() => handleChannelToggle(channel.value)}
                    className={`
                      p-6 rounded-2xl border-2 transition-all
                      ${isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={24} className={isSelected ? 'text-emerald-600' : 'text-slate-400'} />
                      <span className={`font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {channel.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={20} className="text-emerald-500 ml-auto" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {errors.channels && (
              <p className="text-red-500 text-xs ml-2">{errors.channels}</p>
            )}

            {/* Online Links */}
            {formData.channels.includes('ONLINE') && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">
                  ลิ้งรายงานออนไลน์ <span className="text-red-500">*</span>
                </label>
                {formData.onlineLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => handleLinkChange('onlineLinks', index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                      placeholder="https://..."
                    />
                    {formData.onlineLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLink('onlineLinks', index)}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddLink('onlineLinks')}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                >
                  <Plus size={16} />
                  <span>เพิ่มลิ้ง</span>
                </button>
                {errors.onlineLinks && (
                  <p className="text-red-500 text-xs ml-2">{errors.onlineLinks}</p>
                )}
              </div>
            )}
          </div>

          {/* Reference Links */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 space-y-6">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
              เอกสารที่เกี่ยวข้อง
            </h2>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">
                ลิ้งเอกสาร
              </label>
              {formData.referenceLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handleLinkChange('referenceLinks', index, e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 font-medium focus:outline-none focus:border-blue-500"
                    placeholder="https://..."
                  />
                  {formData.referenceLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLink('referenceLinks', index)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddLink('referenceLinks')}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors"
              >
                <Plus size={16} />
                <span>เพิ่มลิ้ง</span>
              </button>
            </div>
          </div>

          {/* Remark */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 space-y-6">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
              หมายเหตุ
            </h2>

            <textarea
              value={formData.remark}
              onChange={(e) => handleChange('remark', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 font-medium resize-none focus:outline-none focus:border-blue-500"
              placeholder="ระบุรายละเอียดเพิ่มเติม คำแนะนำ หรือข้อควรระวัง..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              <span>{isSubmitting ? 'กำลังบันทึก...' : 'บันทึกรายงาน'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddReportPage;
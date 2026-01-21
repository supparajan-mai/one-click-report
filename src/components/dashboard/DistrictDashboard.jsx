// DistrictDashboard.jsx - WITH API INTEGRATION
// ไฟล์นี้สำหรับหน้า Dashboard ของอำเภอ

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building2,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Upload
} from 'lucide-react';

// Import API
import { api } from '../../config/api';

// ========================================
// 🎯 CONSTANTS
// ========================================

const STATUS = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  COMPLETED: 'COMPLETED',
  OVERDUE: 'OVERDUE'
};

const REPORT_TYPES = {
  D2P: 'D2P',
  P2D: 'P2D'
};

const CHANNELS = {
  ONLINE: 'ONLINE',
  DOC: 'DOC'
};

// ========================================
// 🎨 COMPONENTS
// ========================================

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <Card className={onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} onClick={onClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`${colorClasses[color]} p-3 rounded-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </Card>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    [STATUS.COMPLETED]: 'bg-green-100 text-green-800',
    [STATUS.PARTIAL]: 'bg-yellow-100 text-yellow-800',
    [STATUS.PENDING]: 'bg-gray-100 text-gray-800',
    [STATUS.OVERDUE]: 'bg-red-100 text-red-800'
  };

  const labels = {
    [STATUS.COMPLETED]: 'ส่งแล้ว',
    [STATUS.PARTIAL]: 'ส่งบางส่วน',
    [STATUS.PENDING]: 'รอดำเนินการ',
    [STATUS.OVERDUE]: 'เกินกำหนด'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// ========================================
// 📊 MOCK DATA (FALLBACK)
// ========================================

const MOCK_REPORTS = [
  {
    id: 'R001',
    reportId: 'R001',
    title: 'รายงานผลการดำเนินงานประจำเดือน',
    type: REPORT_TYPES.D2P,
    dueDate: '2026-01-15',
    responsibleGroup: 'กลุ่มงานประสานฯ',
    status: STATUS.COMPLETED,
    channels: [CHANNELS.ONLINE, CHANNELS.DOC],
    attachments: [
      { name: 'แบบรายงาน ดจ.01', url: 'https://example.com/form1.pdf' }
    ],
    submittedAt: '2026-01-10T14:30:00',
    submissionData: {
      onlineLinks: ['https://forms.google.com/xxxxx'],
      docNumber: 'ศธ 04158/001',
      docDate: '2026-01-10',
      sentDate: '2026-01-10'
    }
  },
  {
    id: 'R002',
    reportId: 'R002',
    title: 'รายงานการใช้จ่ายงบประมาณ',
    type: REPORT_TYPES.D2P,
    dueDate: '2026-01-20',
    responsibleGroup: 'กลุ่มงานประสานฯ',
    status: STATUS.PENDING,
    channels: [CHANNELS.ONLINE],
    attachments: [
      { name: 'แบบรายงานงบประมาณ', url: 'https://example.com/budget-form.xlsx' }
    ],
    submittedAt: null,
    submissionData: null
  },
  {
    id: 'R003',
    reportId: 'R003',
    title: 'รายงานการติดตามนักเรียน',
    type: REPORT_TYPES.D2P,
    dueDate: '2026-01-25',
    responsibleGroup: 'กลุ่มงานส่งเสริมฯ',
    status: STATUS.PARTIAL,
    channels: [CHANNELS.ONLINE, CHANNELS.DOC],
    attachments: [],
    submittedAt: '2026-01-18T09:15:00',
    submissionData: {
      onlineLinks: ['https://forms.google.com/yyyyy'],
      docNumber: null,
      docDate: null,
      sentDate: null
    }
  }
];

// ========================================
// 📊 MAIN COMPONENT
// ========================================

const DistrictDashboard = ({ districtId, districtName, onBack }) => {
  // State
  const [isLoadingAPI, setIsLoadingAPI] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [dataSource, setDataSource] = useState('mock');
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [debugMode, setDebugMode] = useState(false);

  // ========================================
  // 🔌 LOAD DATA FROM API
  // ========================================

  useEffect(() => {
    loadReportsFromAPI();
  }, [districtId]);

  const loadReportsFromAPI = async () => {
    setIsLoadingAPI(true);
    setApiError(null);

    try {
      // Test API connection
      const testResult = await api.test();
      
      if (testResult.status !== 'success') {
        throw new Error('API not connected');
      }

      console.log('✅ API Connected');

      // Load Reports for this district
      const reportsResult = await api.getReports();
      
      if (reportsResult.status === 'success' && reportsResult.data.length > 0) {
        // Filter reports for D2P type (reports that districts need to submit)
        const districtReports = reportsResult.data.filter(report => {
          // Only show D2P reports
          if (report.reportType !== 'D2P') return false;
          
          // Check if this district needs to submit this report
          // If targetDistricts is empty, all districts need to submit
          if (!report.targetDistricts || report.targetDistricts.length === 0) {
            return true;
          }
          
          // Check if this district is in the target list
          return report.targetDistricts.includes(districtId);
        });

        // Transform API data to local format
        const transformedReports = districtReports.map(report => ({
          id: report.reportId,
          reportId: report.reportId,
          title: report.reportTitle || report.title,
          type: report.reportType,
          dueDate: report.dueDate,
          responsibleGroup: report.responsibleGroup || report.pic,
          status: report.submissions?.[districtId]?.status || STATUS.PENDING,
          channels: report.channels || [],
          attachments: report.attachments || [],
          submittedAt: report.submissions?.[districtId]?.submittedAt || null,
          submissionData: report.submissions?.[districtId] || null
        }));

        if (transformedReports.length > 0) {
          setReports(transformedReports);
          setDataSource('api');
          console.log('✅ Loaded district reports from API:', transformedReports.length);
        } else {
          console.log('⚠ No reports found for district:', districtId);
          setDataSource('mock');
        }
      } else {
        throw new Error('No reports data from API');
      }

    } catch (error) {
      console.error('❌ API Error:', error);
      setApiError(error.message);
      setDataSource('mock');
      // Keep using mock data
    } finally {
      setIsLoadingAPI(false);
    }
  };

  // ========================================
  // 📊 CALCULATIONS
  // ========================================

  const stats = useMemo(() => {
    const total = reports.length;
    const completed = reports.filter(r => r.status === STATUS.COMPLETED).length;
    const partial = reports.filter(r => r.status === STATUS.PARTIAL).length;
    const pending = reports.filter(r => r.status === STATUS.PENDING).length;
    const overdue = reports.filter(r => r.status === STATUS.OVERDUE).length;

    return { total, completed, partial, pending, overdue };
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (filterStatus === 'ALL') return reports;
    return reports.filter(r => r.status === filterStatus);
  }, [reports, filterStatus]);

  // ========================================
  // 🎨 RENDER
  // ========================================

  if (selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        districtName={districtName}
        onBack={() => setSelectedReport(null)}
        onRefresh={loadReportsFromAPI}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{districtName}</h1>
                  <p className="text-gray-600">Dashboard รายงานอิเล็กทรอนิกส์</p>
                </div>
              </div>
              
              {/* Data Source Indicator */}
              <div className="mt-2 flex items-center gap-2 ml-14">
                {isLoadingAPI ? (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <RefreshCw size={12} className="animate-spin" />
                    กำลังโหลดข้อมูลจาก API...
                  </span>
                ) : (
                  <span className={`text-xs font-medium flex items-center gap-1 ${
                    dataSource === 'api' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {dataSource === 'api' ? '✓ ใช้ข้อมูลจาก Google Sheets API' : '⚠ ใช้ข้อมูล Mock (API ไม่เชื่อมต่อ)'}
                  </span>
                )}
                {!isLoadingAPI && (
                  <button
                    onClick={loadReportsFromAPI}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <RefreshCw size={12} />
                    รีเฟรช
                  </button>
                )}
                {/* Debug Mode Toggle */}
                <button
                  onClick={() => setDebugMode(!debugMode)}
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    debugMode ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {debugMode ? '🐛 Debug ON' : 'Debug'}
                </button>
                {/* Debug Info */}
                <span className="text-xs text-gray-400 ml-2">
                  (ID: {districtId}, รายงาน: {reports.length})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingAPI && (
          <Card className="mb-8">
            <div className="text-center py-12">
              <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600 text-lg">กำลังโหลดข้อมูลรายงาน...</p>
            </div>
          </Card>
        )}

        {/* Debug Panel */}
        {debugMode && !isLoadingAPI && (
          <Card className="mb-6 bg-yellow-50 border-2 border-yellow-300">
            <h3 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
              🐛 Debug Information
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">District ID:</span>
                  <span className="ml-2 font-bold">{districtId}</span>
                </div>
                <div>
                  <span className="text-gray-600">District Name:</span>
                  <span className="ml-2 font-bold">{districtName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Data Source:</span>
                  <span className="ml-2 font-bold">{dataSource}</span>
                </div>
                <div>
                  <span className="text-gray-600">Reports Count:</span>
                  <span className="ml-2 font-bold">{reports.length}</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 mb-2">Raw Reports Data:</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(reports, null, 2)}
                </pre>
              </div>
            </div>
          </Card>
        )}

        {/* Summary Cards */}
        {!isLoadingAPI && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={FileText}
            title="รายงานทั้งหมด"
            value={stats.total}
            subtitle="รายการที่ต้องส่ง"
            color="blue"
            onClick={() => setFilterStatus('ALL')}
          />
          <StatCard
            icon={CheckCircle2}
            title="ส่งแล้ว"
            value={stats.completed}
            subtitle="เสร็จสมบูรณ์"
            color="green"
            onClick={() => setFilterStatus(STATUS.COMPLETED)}
          />
          <StatCard
            icon={Clock}
            title="ส่งบางส่วน"
            value={stats.partial}
            subtitle="รอดำเนินการเพิ่มเติม"
            color="yellow"
            onClick={() => setFilterStatus(STATUS.PARTIAL)}
          />
          <StatCard
            icon={AlertCircle}
            title="ยังไม่ส่ง"
            value={stats.pending}
            subtitle="รอดำเนินการ"
            color="gray"
            onClick={() => setFilterStatus(STATUS.PENDING)}
          />
          <StatCard
            icon={AlertCircle}
            title="เกินกำหนด"
            value={stats.overdue}
            subtitle="เร่งดำเนินการ"
            color="red"
            onClick={() => setFilterStatus(STATUS.OVERDUE)}
          />
        </div>
        )}

        {/* Filter Tabs */}
        {!isLoadingAPI && (
          <div className="mb-6 flex gap-2 flex-wrap">
          {[
            { key: 'ALL', label: 'ทั้งหมด', count: stats.total },
            { key: STATUS.PENDING, label: 'รอดำเนินการ', count: stats.pending },
            { key: STATUS.PARTIAL, label: 'ส่งบางส่วน', count: stats.partial },
            { key: STATUS.COMPLETED, label: 'ส่งแล้ว', count: stats.completed },
            { key: STATUS.OVERDUE, label: 'เกินกำหนด', count: stats.overdue }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        )}

        {/* Reports List */}
        {!isLoadingAPI && (
          <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">ไม่มีรายงานในหมวดนี้</p>
              </div>
            </Card>
          ) : (
            filteredReports.map(report => (
              <Card
                key={report.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          รับผิดชอบ: {report.responsibleGroup}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>ครบกำหนด: {new Date(report.dueDate).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                          {report.submittedAt && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>ส่งเมื่อ: {new Date(report.submittedAt).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <StatusBadge status={report.status} />
                    <div className="flex gap-1">
                      {report.channels.map(channel => (
                        <span
                          key={channel}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                        >
                          {channel === CHANNELS.ONLINE ? '🌐 Online' : '📄 เอกสาร'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        )}
      </div>
    </div>
  );
};

// ========================================
// 📄 REPORT DETAIL VIEW
// ========================================

const ReportDetailView = ({ report, districtName, onBack, onRefresh }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>กลับไปรายการรายงาน</span>
          </button>
        </div>

        {/* Report Info */}
        <Card className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{report.title}</h2>
              <p className="text-gray-600">อำเภอ: {districtName}</p>
            </div>
            <StatusBadge status={report.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">ผู้รับผิดชอบ (จังหวัด)</p>
              <p className="font-medium">{report.responsibleGroup}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">ประเภทรายงาน</p>
              <p className="font-medium">อำเภอส่งจังหวัด</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">กำหนดส่ง</p>
              <p className="font-medium text-red-600">
                {new Date(report.dueDate).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {report.submittedAt && (
              <div>
                <p className="text-sm text-gray-600 mb-1">วันที่ส่ง</p>
                <p className="font-medium text-green-600">
                  {new Date(report.submittedAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Channels */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">ช่องทางส่งรายงาน</p>
            <div className="flex gap-2">
              {report.channels.map(channel => (
                <span
                  key={channel}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                >
                  {channel === CHANNELS.ONLINE ? '🌐 ส่งออนไลน์' : '📄 ส่งหนังสือราชการ'}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Attachments */}
        {report.attachments && report.attachments.length > 0 && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              เอกสารแนบจากจังหวัด
            </h3>
            <div className="space-y-2">
              {report.attachments.map((att, idx) => (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="flex-1 text-sm font-medium">{att.name}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </Card>
        )}

        {/* Submission Data */}
        {report.submissionData && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ข้อมูลการส่งรายงาน
            </h3>
            
            {/* Online Links */}
            {report.submissionData.onlineLinks && report.submissionData.onlineLinks.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">ลิงก์ออนไลน์ที่ส่ง:</p>
                <div className="space-y-2">
                  {report.submissionData.onlineLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded text-blue-600 text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="flex-1 truncate">{link}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Document Info */}
            {report.submissionData.docNumber && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">เลขที่หนังสือ</p>
                  <p className="font-medium">{report.submissionData.docNumber}</p>
                </div>
                {report.submissionData.docDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">วันที่ออกหนังสือ</p>
                    <p className="font-medium">
                      {new Date(report.submissionData.docDate).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                )}
                {report.submissionData.sentDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">วันที่ส่งถึงจังหวัด</p>
                    <p className="font-medium">
                      {new Date(report.submissionData.sentDate).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            การดำเนินการ
          </h3>
          <div className="flex gap-4">
            {report.status === STATUS.PENDING && (
              <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                ส่งรายงาน
              </button>
            )}
            {report.status === STATUS.PARTIAL && (
              <button className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                ส่งเพิ่มเติม
              </button>
            )}
            {report.status === STATUS.COMPLETED && (
              <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                แก้ไขและส่งซ้ำ
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DistrictDashboard;
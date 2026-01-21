// ProvincialDashboard.jsx - V3 WITH API INTEGRATION
// แทนที่ไฟล์ src/components/dashboard/ProvincialDashboard.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  TrendingUp,
  Building2,
  Users,
  Filter,
  Search,
  X,
  RefreshCw
} from 'lucide-react';

// Import API
import { api } from '../../config/api';

// ========================================
// 🎯 CONSTANTS (FALLBACK)
// ========================================

const FALLBACK_DISTRICTS = [
  { id: 'D01', name: 'เมืองสุราษฎร์ธานี' },
  { id: 'D02', name: 'กาญจนดิษฐ์' },
  { id: 'D03', name: 'ดอนสัก' },
  { id: 'D04', name: 'เกาะสมุย' },
  { id: 'D05', name: 'เกาะพะงัน' },
  { id: 'D06', name: 'ไชยา' },
  { id: 'D07', name: 'ท่าฉาง' },
  { id: 'D08', name: 'คีรีรัฐนิคม' },
  { id: 'D09', name: 'บ้านตาขุน' },
  { id: 'D10', name: 'พนม' },
  { id: 'D11', name: 'ท่าชนะ' },
  { id: 'D12', name: 'ขนอม' },
  { id: 'D13', name: 'พระแสง' },
  { id: 'D14', name: 'วิภาวดี' },
  { id: 'D15', name: 'ชัยบุรี' },
  { id: 'D16', name: 'เวียงสระ' },
  { id: 'D17', name: 'พุนพิน' },
  { id: 'D18', name: 'บ้านนาสาร' },
  { id: 'D19', name: 'บ้านนาเดิม' }
];

const FALLBACK_GROUPS = [
  { id: 'G01', name: 'กลุ่มงานประสานฯ' },
  { id: 'G02', name: 'กลุ่มงานยุทธศาสตร์ฯ' },
  { id: 'G03', name: 'กลุ่มงานส่งเสริมฯ' },
  { id: 'G04', name: 'กลุ่มงานสารสนเทศฯ' }
];

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

// ========================================
// 🎨 COMPONENTS
// ========================================

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <Card>
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

// Multi-Select Component
const MultiSelect = ({ options, selected, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value) => {
    onChange(selected.filter(v => v !== value));
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors min-h-[48px] flex flex-wrap gap-2 items-center"
      >
        {selected.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          selected.map(value => {
            const option = options.find(opt => opt.id === value);
            return (
              <span 
                key={value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
              >
                {option?.name || value}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(value);
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })
        )}
      </div>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {options.map(option => (
              <div
                key={option.id}
                onClick={() => toggleOption(option.id)}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${
                  selected.includes(option.id) ? 'bg-blue-50' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option.id)}
                  onChange={() => {}}
                  className="w-4 h-4"
                />
                <span className="text-sm">{option.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ========================================
// 📊 MOCK DATA (FALLBACK)
// ========================================

const MOCK_REPORTS = [
  {
    id: 'R001',
    title: 'รายงานผลการดำเนินงานประจำเดือน',
    type: REPORT_TYPES.D2P,
    dueDate: '2026-01-15',
    responsibleGroup: 'G01',
    submissions: {
      'D01': { status: STATUS.COMPLETED, submittedAt: '2026-01-10' },
      'D02': { status: STATUS.COMPLETED, submittedAt: '2026-01-12' },
      'D03': { status: STATUS.PARTIAL, submittedAt: '2026-01-13' },
      'D04': { status: STATUS.PENDING, submittedAt: null },
      'D05': { status: STATUS.PENDING, submittedAt: null },
      'D06': { status: STATUS.COMPLETED, submittedAt: '2026-01-11' },
      'D07': { status: STATUS.COMPLETED, submittedAt: '2026-01-09' },
      'D08': { status: STATUS.PENDING, submittedAt: null },
      'D09': { status: STATUS.PARTIAL, submittedAt: '2026-01-14' },
      'D10': { status: STATUS.COMPLETED, submittedAt: '2026-01-08' },
      'D11': { status: STATUS.PENDING, submittedAt: null },
      'D12': { status: STATUS.COMPLETED, submittedAt: '2026-01-10' },
      'D13': { status: STATUS.PENDING, submittedAt: null },
      'D14': { status: STATUS.COMPLETED, submittedAt: '2026-01-11' },
      'D15': { status: STATUS.PENDING, submittedAt: null },
      'D16': { status: STATUS.COMPLETED, submittedAt: '2026-01-12' },
      'D17': { status: STATUS.PENDING, submittedAt: null },
      'D18': { status: STATUS.PENDING, submittedAt: null },
      'D19': { status: STATUS.COMPLETED, submittedAt: '2026-01-13' }
    }
  },
  {
    id: 'R002',
    title: 'รายงานการใช้จ่ายงบประมาณ',
    type: REPORT_TYPES.D2P,
    dueDate: '2026-01-20',
    responsibleGroup: 'G01',
    submissions: {
      'D01': { status: STATUS.COMPLETED, submittedAt: '2026-01-18' },
      'D02': { status: STATUS.PENDING, submittedAt: null },
      'D03': { status: STATUS.PENDING, submittedAt: null },
      'D04': { status: STATUS.COMPLETED, submittedAt: '2026-01-19' },
      'D05': { status: STATUS.PENDING, submittedAt: null },
      'D06': { status: STATUS.COMPLETED, submittedAt: '2026-01-17' },
      'D07': { status: STATUS.PENDING, submittedAt: null },
      'D08': { status: STATUS.PENDING, submittedAt: null },
      'D09': { status: STATUS.PENDING, submittedAt: null },
      'D10': { status: STATUS.COMPLETED, submittedAt: '2026-01-18' },
      'D11': { status: STATUS.PENDING, submittedAt: null },
      'D12': { status: STATUS.PENDING, submittedAt: null },
      'D13': { status: STATUS.PENDING, submittedAt: null },
      'D14': { status: STATUS.PENDING, submittedAt: null },
      'D15': { status: STATUS.PENDING, submittedAt: null },
      'D16': { status: STATUS.PENDING, submittedAt: null },
      'D17': { status: STATUS.PENDING, submittedAt: null },
      'D18': { status: STATUS.PENDING, submittedAt: null },
      'D19': { status: STATUS.PENDING, submittedAt: null }
    }
  },
  {
    id: 'R101',
    title: 'รายงานสรุปผลการดำเนินงานประจำไตรมาส',
    type: REPORT_TYPES.P2D,
    dueDate: '2026-01-30',
    responsibleGroup: 'G01',
    provincialStatus: STATUS.PENDING
  },
  {
    id: 'R102',
    title: 'รายงานการใช้ระบบสารสนเทศ',
    type: REPORT_TYPES.P2D,
    dueDate: '2026-02-05',
    responsibleGroup: 'G04',
    provincialStatus: STATUS.COMPLETED
  },
  {
    id: 'R103',
    title: 'รายงานการวิเคราะห์นโยบายและแผน',
    type: REPORT_TYPES.P2D,
    dueDate: '2026-02-10',
    responsibleGroup: 'G02',
    provincialStatus: STATUS.COMPLETED
  }
];

// ========================================
// 📊 MAIN COMPONENT WITH API
// ========================================

const ProvincialDashboard = ({ onBackToHome }) => {
  // API State
  const [isLoadingAPI, setIsLoadingAPI] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [districts, setDistricts] = useState(FALLBACK_DISTRICTS);
  const [groups, setGroups] = useState(FALLBACK_GROUPS);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [dataSource, setDataSource] = useState('mock'); // 'api' or 'mock'

  // Filter State
  const [filters, setFilters] = useState({
    reportType: 'ALL',
    reportName: 'ALL',
    units: []
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  // ========================================
  // 🔌 LOAD DATA FROM API
  // ========================================

  useEffect(() => {
    loadDataFromAPI();
  }, []);

  const loadDataFromAPI = async () => {
    setIsLoadingAPI(true);
    setApiError(null);

    try {
      // Test API connection
      const testResult = await api.test();
      
      if (testResult.status !== 'success') {
        throw new Error('API not connected');
      }

      console.log('✅ API Connected');

      // Load Organizations (Districts)
      const orgsResult = await api.getOrgs();
      if (orgsResult.status === 'success' && orgsResult.data.length > 0) {
        const districtData = orgsResult.data
          .filter(org => org.orgType === 'DISTRICT')
          .map(org => ({
            id: org.orgId,
            name: org.orgName
          }));
        
        if (districtData.length > 0) {
          setDistricts(districtData);
          console.log('✅ Loaded districts from API:', districtData.length);
        }
      }

      // Load Groups
      const groupsResult = await api.getGroups();
      if (groupsResult.status === 'success' && groupsResult.data.length > 0) {
        const groupData = groupsResult.data.map(group => ({
          id: group.groupId,
          name: group.groupName
        }));
        
        if (groupData.length > 0) {
          setGroups(groupData);
          console.log('✅ Loaded groups from API:', groupData.length);
        }
      }

      // Load Reports
      const reportsResult = await api.getReports();
      if (reportsResult.status === 'success' && reportsResult.data.length > 0) {
        // Transform API data to match our structure
        // TODO: Map API report structure to local structure
        console.log('📋 Reports from API:', reportsResult.data);
        // For now, keep using mock reports until we map the structure
      }

      setDataSource('api');
      
    } catch (error) {
      console.error('❌ API Error:', error);
      setApiError(error.message);
      setDataSource('mock');
      // Keep using fallback data
    } finally {
      setIsLoadingAPI(false);
    }
  };

  // ========================================
  // 📊 CALCULATIONS
  // ========================================

  const stats = useMemo(() => {
    let totalReports = 0;
    let completedReports = 0;
    let partialReports = 0;
    let pendingReports = 0;

    let filteredReports = reports;
    
    if (appliedFilters.reportType !== 'ALL') {
      filteredReports = filteredReports.filter(r => r.type === appliedFilters.reportType);
    }

    if (appliedFilters.reportName !== 'ALL') {
      filteredReports = filteredReports.filter(r => r.id === appliedFilters.reportName);
    }

    filteredReports.forEach(report => {
      totalReports++;
      
      if (report.type === REPORT_TYPES.D2P && report.submissions) {
        const submissions = Object.values(report.submissions);
        const totalUnits = submissions.length;
        const completedUnits = submissions.filter(s => s.status === STATUS.COMPLETED).length;
        const partialUnits = submissions.filter(s => s.status === STATUS.PARTIAL).length;
        
        if (completedUnits === totalUnits) {
          completedReports++;
        } else if (completedUnits > 0 || partialUnits > 0) {
          partialReports++;
        } else {
          pendingReports++;
        }
      } else if (report.type === REPORT_TYPES.P2D) {
        if (report.provincialStatus === STATUS.COMPLETED) {
          completedReports++;
        } else if (report.provincialStatus === STATUS.PARTIAL) {
          partialReports++;
        } else {
          pendingReports++;
        }
      }
    });

    const progressPercentage = totalReports > 0 
      ? Math.round((completedReports / totalReports) * 100) 
      : 0;

    return {
      total: totalReports,
      completed: completedReports,
      partial: partialReports,
      pending: pendingReports,
      progressPercentage
    };
  }, [reports, appliedFilters]);

  const districtStats = useMemo(() => {
    const stats = {};
    
    if (appliedFilters.reportType === REPORT_TYPES.P2D) {
      return [];
    }

    let districtsToShow = districts;
    if (appliedFilters.units.length > 0 && appliedFilters.reportType !== REPORT_TYPES.P2D) {
      districtsToShow = districts.filter(d => appliedFilters.units.includes(d.id));
    }
    
    districtsToShow.forEach(district => {
      stats[district.id] = {
        name: district.name,
        total: 0,
        completed: 0,
        partial: 0,
        pending: 0
      };
    });

    let filteredReports = reports.filter(r => r.type === REPORT_TYPES.D2P);
    
    if (appliedFilters.reportName !== 'ALL') {
      filteredReports = filteredReports.filter(r => r.id === appliedFilters.reportName);
    }

    filteredReports.forEach(report => {
      if (report.submissions) {
        Object.entries(report.submissions).forEach(([districtId, submission]) => {
          if (stats[districtId]) {
            stats[districtId].total++;
            if (submission.status === STATUS.COMPLETED) {
              stats[districtId].completed++;
            } else if (submission.status === STATUS.PARTIAL) {
              stats[districtId].partial++;
            } else {
              stats[districtId].pending++;
            }
          }
        });
      }
    });

    return Object.values(stats);
  }, [reports, appliedFilters, districts]);

  const groupStats = useMemo(() => {
    const stats = {};
    
    if (appliedFilters.reportType === REPORT_TYPES.D2P) {
      return [];
    }

    let groupsToShow = groups;
    if (appliedFilters.units.length > 0 && appliedFilters.reportType !== REPORT_TYPES.D2P) {
      groupsToShow = groups.filter(g => appliedFilters.units.includes(g.id));
    }
    
    groupsToShow.forEach(group => {
      stats[group.id] = {
        name: group.name,
        total: 0,
        completed: 0,
        partial: 0,
        pending: 0
      };
    });

    let filteredReports = reports.filter(r => r.type === REPORT_TYPES.P2D);
    
    if (appliedFilters.reportName !== 'ALL') {
      filteredReports = filteredReports.filter(r => r.id === appliedFilters.reportName);
    }

    filteredReports.forEach(report => {
      if (report.responsibleGroup) {
        const groupId = report.responsibleGroup;
        if (stats[groupId]) {
          stats[groupId].total++;
          if (report.provincialStatus === STATUS.COMPLETED) {
            stats[groupId].completed++;
          } else if (report.provincialStatus === STATUS.PARTIAL) {
            stats[groupId].partial++;
          } else {
            stats[groupId].pending++;
          }
        }
      }
    });

    return Object.values(stats);
  }, [reports, appliedFilters, groups]);

  const unitOptions = useMemo(() => {
    if (filters.reportType === REPORT_TYPES.D2P) {
      return districts;
    } else if (filters.reportType === REPORT_TYPES.P2D) {
      return groups;
    } else {
      return [...districts, ...groups];
    }
  }, [filters.reportType, districts, groups]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleResetFilters = () => {
    const resetFilters = {
      reportType: 'ALL',
      reportName: 'ALL',
      units: []
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Provincial Dashboard</h1>
              <p className="text-gray-600 mt-1">ภาพรวมระดับจังหวัด - ระบบรายงานอิเล็กทรอนิกส์</p>
              
              {/* Data Source Indicator */}
              <div className="mt-2 flex items-center gap-2">
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
                    onClick={loadDataFromAPI}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <RefreshCw size={12} />
                    รีเฟรช
                  </button>
                )}
              </div>
            </div>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                กลับหน้าแรก
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon={FileText}
            title="รายงานทั้งหมด"
            value={stats.total}
            subtitle="จำนวนรายการทั้งหมด"
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            title="ความคืบหน้า"
            value={`${stats.progressPercentage}%`}
            subtitle={`${stats.completed}/${stats.total} รายการ`}
            color="purple"
          />
          <StatCard
            icon={CheckCircle2}
            title="ส่งครบแล้ว"
            value={stats.completed}
            subtitle="รายงานที่เสร็จสมบูรณ์"
            color="green"
          />
          <StatCard
            icon={Clock}
            title="ส่งบางส่วน"
            value={stats.partial}
            subtitle="รอดำเนินการเพิ่มเติม"
            color="yellow"
          />
          <StatCard
            icon={AlertCircle}
            title="ยังไม่ส่ง"
            value={stats.pending}
            subtitle="รอดำเนินการ"
            color="red"
          />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">กรองข้อมูล</h3>
            </div>
            {(filters.reportType !== 'ALL' || filters.reportName !== 'ALL' || filters.units.length > 0) && (
              <button
                onClick={handleResetFilters}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ประเภทรายงาน
              </label>
              <select
                value={filters.reportType}
                onChange={(e) => {
                  setFilters({ 
                    ...filters, 
                    reportType: e.target.value,
                    units: []
                  });
                }}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">ทั้งหมด</option>
                <option value="D2P">อำเภอส่งจังหวัด</option>
                <option value="P2D">จังหวัดส่งกรม</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อรายงาน
              </label>
              <select
                value={filters.reportName}
                onChange={(e) => setFilters({ ...filters, reportName: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">ทั้งหมด</option>
                {reports
                  .filter(r => filters.reportType === 'ALL' || r.type === filters.reportType)
                  .map(report => (
                    <option key={report.id} value={report.id}>
                      {report.title}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หน่วยงาน {filters.units.length > 0 && `(${filters.units.length})`}
              </label>
              <MultiSelect
                options={unitOptions}
                selected={filters.units}
                onChange={(newUnits) => setFilters({ ...filters, units: newUnits })}
                placeholder="เลือกหน่วยงาน..."
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Search size={18} />
              แสดงผล
            </button>
            
            {appliedFilters !== filters && (
              <span className="text-xs text-gray-500 flex items-center">
                * กรุณากดปุ่ม "แสดงผล" เพื่อใช้งานตัวกรอง
              </span>
            )}
          </div>
        </Card>

        {/* สรุปสถานะรายอำเภอ */}
        {districtStats.length > 0 && (
          <Card className="mb-6">
            <div className="flex items-center mb-4">
              <Building2 className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                สรุปสถานะรายอำเภอ
                {appliedFilters.units.length > 0 && appliedFilters.reportType !== REPORT_TYPES.P2D && (
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({districtStats.length} อำเภอที่เลือก)
                  </span>
                )}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">อำเภอ</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">รายงานทั้งหมด</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">ส่งครบแล้ว</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">ความคืบหน้า</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {districtStats.map((district, idx) => {
                    const percentage = district.total > 0 
                      ? Math.round((district.completed / district.total) * 100) 
                      : 0;
                    
                    return (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{district.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-center font-semibold">{district.total}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                            {district.completed}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <div className="w-full max-w-[140px] bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full transition-all ${
                                  percentage === 100 ? 'bg-green-500' :
                                  percentage >= 70 ? 'bg-blue-500' :
                                  percentage >= 40 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{percentage}% เสร็จสิ้น</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* สรุปสถานะรายกลุ่มงาน */}
        {groupStats.length > 0 && (
          <Card>
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                สรุปสถานะรายกลุ่มงาน
                {appliedFilters.units.length > 0 && appliedFilters.reportType !== REPORT_TYPES.D2P && (
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    ({groupStats.length} กลุ่มที่เลือก)
                  </span>
                )}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {groupStats.map((group, idx) => {
                const percentage = group.total > 0 
                  ? Math.round((group.completed / group.total) * 100) 
                  : 0;
                
                return (
                  <div key={idx} className="border-2 border-gray-200 rounded-xl p-5 hover:border-purple-400 hover:shadow-lg transition-all">
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">{group.name}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">รายงานทั้งหมด:</span>
                        <span className="text-lg font-bold text-gray-900">{group.total}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">ส่งครบแล้ว:</span>
                        <span className="text-lg font-bold text-green-600">{group.completed}</span>
                      </div>
                      <div className="pt-3 mt-3 border-t-2 border-gray-100">
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                          <div 
                            className={`h-4 rounded-full transition-all ${
                              percentage === 100 ? 'bg-green-500' :
                              percentage >= 70 ? 'bg-blue-500' :
                              percentage >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-base text-center text-gray-900 font-bold mb-1">{percentage}% เสร็จสิ้น</p>
                        <p className="text-sm text-center text-gray-600 font-medium">
                          {group.completed}/{group.total} ส่งแล้ว
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProvincialDashboard;
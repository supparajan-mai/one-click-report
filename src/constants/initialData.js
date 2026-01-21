import { STATUS, REPORT_TYPES, SUBMISSION_CHANNELS } from './status.js';

// ข้อมูลรายงานตัวอย่าง (Mock Data)
export const INITIAL_REPORTS = [
  // รายงานประเภท D2P (อำเภอส่งจังหวัด)
  {
    id: 'R001',
    title: 'รายงานผลการดำเนินงานประจำเดือน',
    type: REPORT_TYPES.D2P,
    dueDate: '2026-01-15',
    channel: SUBMISSION_CHANNELS.BOTH,
    responsibleGroup: 'G01',
    targetDistricts: [], // ว่าง = ทุกอำเภอต้องส่ง
    attachments: [
      { name: 'แบบรายงาน', url: 'https://example.com/form1.pdf' }
    ],
    notes: 'กรุณาส่งภายในวันที่ 15 ของทุกเดือน',
    submissions: {
      'D01': { status: STATUS.COMPLETED, submittedAt: '2026-01-10', onlineLink: 'https://...', docNumber: 'สพจ.สฎ. 123/2569' },
      'D02': { status: STATUS.COMPLETED, submittedAt: '2026-01-12', onlineLink: 'https://...' },
      'D03': { status: STATUS.PARTIAL, submittedAt: '2026-01-13', docNumber: 'สพอ. 456/2569' },
      'D04': { status: STATUS.PENDING, submittedAt: null },
      'D05': { status: STATUS.PENDING, submittedAt: null },
      'D06': { status: STATUS.COMPLETED, submittedAt: '2026-01-11', onlineLink: 'https://...' },
      'D07': { status: STATUS.COMPLETED, submittedAt: '2026-01-09', onlineLink: 'https://...' },
      'D08': { status: STATUS.PENDING, submittedAt: null },
      'D09': { status: STATUS.PARTIAL, submittedAt: '2026-01-14', onlineLink: 'https://...' },
      'D10': { status: STATUS.COMPLETED, submittedAt: '2026-01-08', onlineLink: 'https://...', docNumber: 'สพอ. 789/2569' },
      'D11': { status: STATUS.PENDING, submittedAt: null },
      'D12': { status: STATUS.COMPLETED, submittedAt: '2026-01-10', onlineLink: 'https://...' },
      'D13': { status: STATUS.PENDING, submittedAt: null },
      'D14': { status: STATUS.COMPLETED, submittedAt: '2026-01-11', onlineLink: 'https://...' },
      'D15': { status: STATUS.PENDING, submittedAt: null },
      'D16': { status: STATUS.COMPLETED, submittedAt: '2026-01-12', onlineLink: 'https://...' },
      'D17': { status: STATUS.PENDING, submittedAt: null },
      'D18': { status: STATUS.PENDING, submittedAt: null },
      'D19': { status: STATUS.COMPLETED, submittedAt: '2026-01-13', onlineLink: 'https://...' }
    }
  },
  {
    id: 'R002',
    title: 'รายงานการใช้จ่ายงบประมาณ',
    type: REPORT_TYPES.D2P,
    dueDate: '2026-01-20',
    channel: SUBMISSION_CHANNELS.ONLINE,
    responsibleGroup: 'G01',
    targetDistricts: [],
    attachments: [
      { name: 'แบบรายงาน Excel', url: 'https://example.com/budget.xlsx' }
    ],
    notes: 'ส่งเฉพาะทาง Google Forms',
    submissions: {
      'D01': { status: STATUS.COMPLETED, submittedAt: '2026-01-18', onlineLink: 'https://...' },
      'D02': { status: STATUS.PENDING, submittedAt: null },
      'D03': { status: STATUS.PENDING, submittedAt: null },
      'D04': { status: STATUS.COMPLETED, submittedAt: '2026-01-19', onlineLink: 'https://...' },
      'D05': { status: STATUS.PENDING, submittedAt: null },
      'D06': { status: STATUS.COMPLETED, submittedAt: '2026-01-17', onlineLink: 'https://...' },
      'D07': { status: STATUS.PENDING, submittedAt: null },
      'D08': { status: STATUS.PENDING, submittedAt: null },
      'D09': { status: STATUS.PENDING, submittedAt: null },
      'D10': { status: STATUS.COMPLETED, submittedAt: '2026-01-18', onlineLink: 'https://...' },
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
    id: 'R003',
    title: 'รายงานสถิติข้อมูลพื้นฐาน',
    type: REPORT_TYPES.D2P,
    dueDate: '2026-01-25',
    channel: SUBMISSION_CHANNELS.DOCUMENT,
    responsibleGroup: 'G04',
    targetDistricts: ['D01', 'D02', 'D03', 'D06', 'D10'], // เฉพาะบางอำเภอ
    attachments: [],
    notes: 'เฉพาะอำเภอขนาดใหญ่',
    submissions: {
      'D01': { status: STATUS.COMPLETED, submittedAt: '2026-01-22', docNumber: 'สพจ. 100/2569' },
      'D02': { status: STATUS.PENDING, submittedAt: null },
      'D03': { status: STATUS.COMPLETED, submittedAt: '2026-01-23', docNumber: 'สพจ. 101/2569' },
      'D06': { status: STATUS.PENDING, submittedAt: null },
      'D10': { status: STATUS.COMPLETED, submittedAt: '2026-01-24', docNumber: 'สพจ. 102/2569' }
    }
  },
  // รายงานประเภท P2D (จังหวัดส่งกรม)
  {
    id: 'R101',
    title: 'รายงานสรุปผลการดำเนินงานประจำไตรมาส',
    type: REPORT_TYPES.P2D,
    dueDate: '2026-01-30',
    channel: SUBMISSION_CHANNELS.BOTH,
    responsibleGroup: 'G01',
    targetDistricts: null,
    attachments: [
      { name: 'แบบรายงาน', url: 'https://example.com/quarterly.pdf' },
      { name: 'คู่มือการกรอก', url: 'https://example.com/manual.pdf' }
    ],
    notes: 'รวบรวมจากทุกอำเภอ',
    provincialStatus: STATUS.PENDING,
    provincialSubmission: null
  },
  {
    id: 'R102',
    title: 'รายงานการใช้ระบบสารสนเทศ',
    type: REPORT_TYPES.P2D,
    dueDate: '2026-02-05',
    channel: SUBMISSION_CHANNELS.ONLINE,
    responsibleGroup: 'G04',
    targetDistricts: null,
    attachments: [
      { name: 'แบบฟอร์ม Google Forms', url: 'https://forms.google.com/...' }
    ],
    notes: 'ส่งผ่านระบบออนไลน์เท่านั้น',
    provincialStatus: STATUS.COMPLETED,
    provincialSubmission: {
      submittedAt: '2026-02-03',
      onlineLink: 'https://forms.google.com/response/...',
      submittedBy: 'นางสาวทดสอบ ระบบ'
    }
  }
];

// Helper function: คำนวณสถิติรายงาน
export const calculateReportStats = (reports) => {
  const stats = {
    total: reports.length,
    completed: 0,
    partial: 0,
    pending: 0,
    overdue: 0,
    progressPercentage: 0
  };

  reports.forEach(report => {
    if (report.type === REPORT_TYPES.D2P && report.submissions) {
      const submissions = Object.values(report.submissions);
      const totalUnits = submissions.length;
      const completedUnits = submissions.filter(s => s.status === STATUS.COMPLETED).length;
      const partialUnits = submissions.filter(s => s.status === STATUS.PARTIAL).length;
      
      if (completedUnits === totalUnits) {
        stats.completed++;
      } else if (completedUnits > 0 || partialUnits > 0) {
        stats.partial++;
      } else {
        stats.pending++;
      }
    } else if (report.type === REPORT_TYPES.P2D) {
      if (report.provincialStatus === STATUS.COMPLETED) {
        stats.completed++;
      } else if (report.provincialStatus === STATUS.PARTIAL) {
        stats.partial++;
      } else {
        stats.pending++;
      }
    }
  });

  stats.progressPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  return stats;
};
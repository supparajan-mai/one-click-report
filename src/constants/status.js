// สถานะรายงาน
export const STATUS = {
  PENDING: 'PENDING',           // รอดำเนินการ
  PARTIAL: 'PARTIAL',           // ส่งแล้วบางส่วน
  COMPLETED: 'COMPLETED',       // ส่งครบแล้ว
  OVERDUE: 'OVERDUE'           // เลยกำหนด
};

// ข้อความแสดงสถานะ (ภาษาไทย)
export const STATUS_LABELS = {
  [STATUS.PENDING]: 'รอดำเนินการ',
  [STATUS.PARTIAL]: 'ส่งแล้วบางส่วน',
  [STATUS.COMPLETED]: 'ส่งครบแล้ว',
  [STATUS.OVERDUE]: 'เลยกำหนด'
};

// สีของแต่ละสถานะ
export const STATUS_COLORS = {
  [STATUS.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    badge: 'bg-yellow-500'
  },
  [STATUS.PARTIAL]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    badge: 'bg-blue-500'
  },
  [STATUS.COMPLETED]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    badge: 'bg-green-500'
  },
  [STATUS.OVERDUE]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    badge: 'bg-red-500'
  }
};

// ประเภทรายงาน
export const REPORT_TYPES = {
  D2P: 'D2P',  // District to Province (อำเภอส่งจังหวัด)
  P2D: 'P2D'   // Province to Department (จังหวัดส่งกรม)
};

export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.D2P]: 'อำเภอส่งจังหวัด',
  [REPORT_TYPES.P2D]: 'จังหวัดส่งกรม'
};

// ช่องทางการส่ง
export const SUBMISSION_CHANNELS = {
  ONLINE: 'ONLINE',
  DOCUMENT: 'DOCUMENT',
  BOTH: 'BOTH'
};

export const CHANNEL_LABELS = {
  [SUBMISSION_CHANNELS.ONLINE]: 'ออนไลน์',
  [SUBMISSION_CHANNELS.DOCUMENT]: 'หนังสือราชการ',
  [SUBMISSION_CHANNELS.BOTH]: 'ทั้งสองช่องทาง'
};
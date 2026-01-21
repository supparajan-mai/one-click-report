export const PERMISSIONS = {
  PUBLIC: ['landing', 'entry', 'provincial_dashboard'],
  DISTRICT: ['dashboard', 'task_detail'],
  PROVINCE: ['group_dashboard', 'monitor', 'task_detail_p2d', 'add_report']
};

export const canAccessView = (role, view, isPINVerified = false) => {
  if (PERMISSIONS.PUBLIC.includes(view)) return true;
  if (PERMISSIONS.DISTRICT.includes(view)) return role === 'district';
  if (PERMISSIONS.PROVINCE.includes(view)) return role === 'province' && isPINVerified;
  return false;
};

export const requiresPIN = (view) => {
  return PERMISSIONS.PROVINCE.includes(view);
};

export const getDefaultViewForRole = (role) => {
  if (role === 'district') return 'dashboard';
  if (role === 'province') return 'group_dashboard';
  return 'landing';
};

const PROVINCE_PIN = '1234';

export const verifyPIN = (inputPIN) => {
  return inputPIN === PROVINCE_PIN;
};

export const getAccessDeniedMessage = (role, view) => {
  if (!role) return 'กรุณาเลือกหน่วยงานก่อนเข้าใช้งาน';
  if (role === 'district') return 'หน่วยงานอำเภอไม่สามารถเข้าถึงหน้านี้ได้';
  if (requiresPIN(view)) return 'กรุณายืนยันตัวตนด้วย PIN ก่อนเข้าใช้งาน';
  return 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้';
};
/**
 * Organizations Constants
 * รายชื่ออำเภอและกลุ่มงานในจังหวัดสุราษฎร์ธานี
 */

/**
 * DISTRICTS - รายชื่ออำเภอทั้งหมด (19 อำเภอ)
 */
 export const DISTRICTS = [
  "เมืองสุราษฎร์ธานี",
  "กาญจนดิษฐ์",
  "ดอนสัก",
  "เกาะสมุย",
  "เกาะพะงัน",
  "ไชยา",
  "ท่าชนะ",
  "คีรีรัฐนิคม",
  "บ้านตาขุน",
  "พนม",
  "ท่าฉาง",
  "บ้านนาสาร",
  "บ้านนาเดิม",
  "เคียนซา",
  "เวียงสระ",
  "พระแสง",
  "พุนพิน",
  "ชัยบุรี",
  "วิภาวดี"
];

/**
 * GROUPS - กลุ่มงานจังหวัด
 */
export const GROUPS = [
  "กลุ่มงานยุทธศาสตร์ฯ",
  "กลุ่มงานประสานฯ",
  "กลุ่มงานส่งเสริมฯ",
  "กลุ่มงานพัฒนาชุมชนฯ",
  "กลุ่มงานสารสนเทศฯ"
];

/**
 * Helper function: Check if name is a valid district
 */
export const isValidDistrict = (name) => {
  return DISTRICTS.includes(name);
};

/**
 * Helper function: Check if name is a valid group
 */
export const isValidGroup = (name) => {
  return GROUPS.includes(name);
};

/**
 * Helper function: Get organization type by name
 * @param {string} name - organization name
 * @returns {'district'|'group'|null}
 */
export const getOrgType = (name) => {
  if (isValidDistrict(name)) return 'district';
  if (isValidGroup(name)) return 'group';
  return null;
};
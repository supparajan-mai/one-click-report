/**
 * Calendar Service
 * สร้าง calendar events สำหรับส่งไปยัง Google Calendar
 * เพื่อให้ GAS (Google Apps Script) ยิง LINE notification ได้
 */

/**
 * แปลง task เป็น calendar event
 * @param {object} task - ข้อมูล task
 * @returns {object} calendar event object
 */
 export const taskToCalendarEvent = (task) => {
  // Parse due date (format: "15 ม.ค. 2569")
  const dueDate = parseDueDate(task.due);
  
  // สร้าง description ที่มีข้อมูลครบสำหรับ LINE
  const description = createEventDescription(task);
  
  return {
    id: `task-${task.id}`,
    title: task.title,
    start: dueDate,
    end: dueDate,
    allDay: true,
    
    // Extended properties สำหรับ GAS
    extendedProperties: {
      taskId: task.id.toString(),
      taskType: task.type,
      taskGroup: task.group,
      taskStatus: task.status,
      responsibleName: task.responsibleName,
      channels: task.channels?.join(',') || '',
      onlineLinks: task.onlineLinks?.join('|') || '',
      relatedDocLink: task.relatedDocLink || '',
      remark: task.remark || ''
    },
    
    // Description ที่อ่านง่าย
    description,
    
    // Color coding
    colorId: getColorByType(task.type),
    
    // Reminders
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 3 * 24 * 60 }, // 3 days before
      ]
    }
  };
};

/**
 * สร้าง description สำหรับ event
 */
const createEventDescription = (task) => {
  let desc = `📋 ${task.title}\n\n`;
  
  desc += `ประเภท: ${task.type}\n`;
  desc += `กลุ่มงาน: ${task.group}\n`;
  desc += `ผู้รับผิดชอบ: ${task.responsibleName}\n`;
  desc += `สถานะ: ${task.status}\n\n`;
  
  if (task.remark) {
    desc += `📝 หมายเหตุ:\n${task.remark}\n\n`;
  }
  
  if (task.channels?.includes('ONLINE') && task.onlineLinks?.length > 0) {
    desc += `🔗 ลิงก์รายงาน:\n`;
    task.onlineLinks.forEach((link, i) => {
      desc += `  ${i + 1}. ${link}\n`;
    });
    desc += '\n';
  }
  
  if (task.relatedDocLink) {
    desc += `📎 เอกสารประกอบ:\n${task.relatedDocLink}\n\n`;
  }
  
  if (task.channels?.includes('DOC')) {
    desc += `📄 ต้องส่งหนังสือราชการ\n\n`;
  }
  
  desc += `⏰ กำหนดส่ง: ${task.due}\n`;
  
  return desc;
};

/**
 * Parse due date string เป็น Date object
 * @param {string} dueDateStr - "15 ม.ค. 2569"
 * @returns {Date}
 */
const parseDueDate = (dueDateStr) => {
  // Map เดือนไทย
  const thaiMonths = {
    'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3,
    'พ.ค.': 4, 'มิ.ย.': 5, 'ก.ค.': 6, 'ส.ค.': 7,
    'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11
  };
  
  try {
    const parts = dueDateStr.split(' ');
    const day = parseInt(parts[0]);
    const month = thaiMonths[parts[1]];
    const buddhistYear = parseInt(parts[2]);
    const gregorianYear = buddhistYear - 543;
    
    return new Date(gregorianYear, month, day);
  } catch (error) {
    console.error('Failed to parse date:', dueDateStr);
    return new Date();
  }
};

/**
 * Get color ID by task type
 */
const getColorByType = (type) => {
  // Google Calendar color IDs
  // 1: Lavender, 2: Sage, 3: Grape, 4: Flamingo, 5: Banana
  // 6: Tangerine, 7: Peacock, 8: Graphite, 9: Blueberry, 10: Basil, 11: Tomato
  
  return type === 'อำเภอส่งจังหวัด' ? '9' : '3'; // Blueberry vs Grape
};

/**
 * สร้าง events สำหรับงานที่ทำซ้ำรายเดือน
 * @param {object} task - task ที่มี isRepeat = true
 * @param {string} startMonth - เดือนเริ่มต้น
 * @param {string} endMonth - เดือนสิ้นสุด
 * @param {string} year - ปี
 * @returns {array} array ของ calendar events
 */
export const createRecurringEvents = (task, startMonth, endMonth, year) => {
  const events = [];
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  
  const startIndex = monthNames.indexOf(startMonth);
  const endIndex = monthNames.indexOf(endMonth);
  
  if (startIndex === -1 || endIndex === -1) {
    console.error('Invalid month names');
    return events;
  }
  
  // สร้าง event สำหรับแต่ละเดือน
  for (let i = startIndex; i <= endIndex; i++) {
    const monthTask = {
      ...task,
      id: `${task.id}-${i}`,
      due: `${task.due.split(' ')[0]} ${getShortMonthName(monthNames[i])} ${year}`,
      title: `${task.title} (${monthNames[i]})`
    };
    
    events.push(taskToCalendarEvent(monthTask));
  }
  
  return events;
};

/**
 * แปลงชื่อเดือนเต็มเป็นแบบย่อ
 */
const getShortMonthName = (fullName) => {
  const mapping = {
    'มกราคม': 'ม.ค.',
    'กุมภาพันธ์': 'ก.พ.',
    'มีนาคม': 'มี.ค.',
    'เมษายน': 'เม.ย.',
    'พฤษภาคม': 'พ.ค.',
    'มิถุนายน': 'มิ.ย.',
    'กรกฎาคม': 'ก.ค.',
    'สิงหาคม': 'ส.ค.',
    'กันยายน': 'ก.ย.',
    'ตุลาคม': 'ต.ค.',
    'พฤศจิกายน': 'พ.ย.',
    'ธันวาคม': 'ธ.ค.'
  };
  
  return mapping[fullName] || fullName;
};

/**
 * Export ทุก tasks เป็น calendar events
 * @param {array} tasks - array ของ tasks
 * @returns {array} array ของ calendar events
 */
export const exportAllTasksToCalendar = (tasks) => {
  const events = [];
  
  tasks.forEach(task => {
    if (task.isRepeat) {
      // ถ้าเป็นงานทำซ้ำ สร้างหลาย events
      const recurringEvents = createRecurringEvents(
        task,
        task.repeatStartMonth || 'มกราคม',
        task.repeatUntilMonth,
        task.repeatUntilYear
      );
      events.push(...recurringEvents);
    } else {
      // งานปกติ สร้าง 1 event
      events.push(taskToCalendarEvent(task));
    }
  });
  
  return events;
};

/**
 * สร้าง JSON สำหรับส่งไปยัง Google Apps Script
 * @param {array} events - calendar events
 * @returns {string} JSON string
 */
export const createCalendarExportJSON = (events) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    version: '1.0',
    source: '1-Click Report System',
    events
  }, null, 2);
};

/**
 * Download calendar events เป็นไฟล์ JSON
 * @param {array} tasks - array ของ tasks
 * @param {string} filename - ชื่อไฟล์
 */
export const downloadCalendarExport = (tasks, filename = 'calendar-events.json') => {
  const events = exportAllTasksToCalendar(tasks);
  const json = createCalendarExportJSON(events);
  
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * สร้าง iCal format สำหรับ import เข้า Google Calendar
 * @param {array} tasks - array ของ tasks
 * @returns {string} iCal string
 */
export const createICalFormat = (tasks) => {
  let ical = 'BEGIN:VCALENDAR\n';
  ical += 'VERSION:2.0\n';
  ical += 'PRODID:-//1-Click Report System//TH\n';
  ical += 'CALSCALE:GREGORIAN\n';
  
  const events = exportAllTasksToCalendar(tasks);
  
  events.forEach(event => {
    const startDate = event.start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    ical += 'BEGIN:VEVENT\n';
    ical += `UID:${event.id}@1clickreport.go.th\n`;
    ical += `DTSTAMP:${startDate}\n`;
    ical += `DTSTART;VALUE=DATE:${startDate.split('T')[0]}\n`;
    ical += `SUMMARY:${event.title}\n`;
    ical += `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\n`;
    ical += 'END:VEVENT\n';
  });
  
  ical += 'END:VCALENDAR';
  
  return ical;
};
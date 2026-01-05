import { Handler } from '@netlify/functions';
import { getSheetsClient, getRows, SHEET_ID } from './_sheetsClient';

/**
 * createReport.ts
 * 1. บันทึก Template ใหม่
 * 2. คำนวณขยายงาน (Tasks) ตามช่วงเดือน (Repeat Monthly)
 * 3. ปรับ Logic: ถ้าเป็นรายงานส่งกรม ให้ Target คือตัวกลุ่มงานเอง (G01-G04)
 */

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const payload = JSON.parse(event.body || '{}');
  const { 
    title, type, ownerGroupId, responsibleName, channelInfo, 
    startPeriod, dueDateFirst, frequency, endPeriod, targets 
  } = payload;

  try {
    const client = await getSheetsClient();
    const reportId = 'R' + Date.now().toString().slice(-8);

    // 1. บันทึกเข้า ReportTemplates
    await client.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'ReportTemplates!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          reportId, title, type, ownerGroupId, responsibleName, 
          payload.detail || '', channelInfo, '', '', 'ACTIVE', new Date().toISOString()
        ]]
      }
    });

    // 2. ดึงข้อมูล Periods และ Tasks ปัจจุบันเพื่อตรวจสอบความซ้ำซ้อน
    const [periods, existingTasks] = await Promise.all([
      getRows(client, 'Periods!A:D'),
      getRows(client, 'Tasks!A:A')
    ]);

    const existingIds = new Set(existingTasks.map((t: any) => t.taskId));
    const startIdx = periods.findIndex((p: any) => p.periodId === startPeriod);
    const endIdx = frequency === 'MONTHLY' 
      ? periods.findIndex((p: any) => p.periodId === endPeriod)
      : startIdx;

    const baseDate = new Date(dueDateFirst);
    const targetDay = baseDate.getDate();

    // 3. กำหนดเป้าหมาย (Targets)
    // ถ้าเป็นรายงานจังหวัดส่งกรม ให้เป้าหมายคือรหัสกลุ่มงาน (ownerGroupId)
    const finalTargets = type === 'PROVINCE_TO_DEPT' ? [ownerGroupId] : targets;

    const newTasks: any[][] = [];

    // 4. วนลูปสร้าง Tasks ล่วงหน้าตามกติกา Date Clamping
    for (let i = startIdx; i <= endIdx; i++) {
      const period = periods[i];
      
      const taskDueDate = new Date(baseDate);
      taskDueDate.setMonth(baseDate.getMonth() + (i - startIdx), 1);
      
      // หาจากวันสุดท้ายของเดือนเพื่อกันเลขวันล้น
      const lastDayOfMonth = new Date(taskDueDate.getFullYear(), taskDueDate.getMonth() + 1, 0).getDate();
      taskDueDate.setDate(Math.min(targetDay, lastDayOfMonth));

      finalTargets.forEach((orgId: string) => {
        const taskId = `${reportId}|${period.periodId}|${orgId}`;
        
        if (!existingIds.has(taskId)) {
          newTasks.push([
            taskId, 
            reportId, 
            period.periodId, 
            orgId,
            taskDueDate.toLocaleDateString('th-TH'), // dueDate format ไทย
            'PENDING', 
            '', '', '', '', 
            new Date().toISOString()
          ]);
        }
      });
    }

    // 5. บันทึก Tasks ลงชีทแบบ Batch (ถ้ามี)
    if (newTasks.length > 0) {
      await client.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Tasks!A:K',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: newTasks }
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        success: true, 
        data: { reportId, taskCount: newTasks.length } 
      }),
    };
  } catch (error: any) {
    console.error('Create Report Error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ success: false, error: error.message }) 
    };
  }
};
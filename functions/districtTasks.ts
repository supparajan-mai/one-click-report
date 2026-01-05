import { Handler } from '@netlify/functions';
import { getSheetsClient, getRows } from './_sheetsClient';

/**
 * districtTasks.ts
 * ดึงรายการงานของอำเภอในเดือนที่เลือก พร้อมรวมข้อมูลจาก Template
 * เรียกใช้ผ่าน: /.netlify/functions/districtTasks?orgId=D01&periodId=202403
 */

export const handler: Handler = async (event) => {
  const { orgId, periodId } = event.queryStringParameters || {};

  if (!orgId || !periodId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'กรุณาระบุ orgId และ periodId' }),
    };
  }

  try {
    const client = await getSheetsClient();
    
    // ดึงข้อมูล Tasks และ ReportTemplates มาเพื่อทำ Join ข้อมูล
    const [tasks, templates] = await Promise.all([
      getRows(client, 'Tasks!A:K'),
      getRows(client, 'ReportTemplates!A:K')
    ]);

    // กรองเฉพาะงานที่ตรงกับอำเภอและเดือนที่เลือก
    const filteredTasks = tasks
      .filter((t: any) => t.targetOrgId === orgId && t.periodId === periodId)
      .map((t: any) => {
        // หาข้อมูล Template ที่เกี่ยวข้องเพื่อเอาชื่อรายงานและช่องทางส่งมาโชว์
        const tmpl = templates.find((temp: any) => temp.reportId === t.reportId) || {};
        return {
          ...t,
          title: tmpl.title || 'ไม่มีชื่อรายงาน',
          channelInfo: tmpl.channelInfo || 'ไม่ได้ระบุช่องทาง',
          responsibleName: tmpl.responsibleName || 'ไม่ระบุผู้รับผิดชอบ',
        };
      });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, data: filteredTasks }),
    };
  } catch (error: any) {
    console.error('DistrictTasks API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
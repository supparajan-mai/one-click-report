import { Handler } from '@netlify/functions';
import { getSheetsClient, getRows } from './_sheetsClient';

/**
 * meta.ts
 * ดึงข้อมูลพื้นฐาน: Orgs (อำเภอ), Groups (กลุ่มงาน), Periods (เดือน)
 * เรียกใช้ผ่าน: /.netlify/functions/meta
 */

export const handler: Handler = async (event) => {
  try {
    const client = await getSheetsClient();
    
    // ดึงข้อมูลจาก 3 ชีทพร้อมกันเพื่อความรวดเร็ว
    const [orgs, groups, periods] = await Promise.all([
      getRows(client, 'Orgs!A:C'),
      getRows(client, 'Groups!A:B'),
      getRows(client, 'Periods!A:D')
    ]);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // ป้องกันปัญหา CORS เบื้องต้น
      },
      body: JSON.stringify({
        success: true,
        data: { orgs, groups, periods }
      }),
    };
  } catch (error: any) {
    console.error('Meta API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
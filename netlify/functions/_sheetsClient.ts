import { google } from 'googleapis';

/**
 * _sheetsClient.ts
 * ทำหน้าที่เชื่อมต่อกับ Google Sheets API โดยใช้ Service Account
 */

export const getSheetsClient = async () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // จัดการเรื่องขึ้นบรรทัดใหม่ของ Private Key ที่ก๊อปมาจาก JSON
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '';
  const privateKey = rawKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT(
    email,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  return google.sheets({ version: 'v4', auth });
};

export const SHEET_ID = process.env.SHEET_ID;

/**
 * ฟังก์ชันช่วยอ่านข้อมูลจาก Sheet และแปลงเป็น Array of Objects
 * เพื่อให้หน้าบ้าน (Frontend) ใช้งานง่าย
 */
export const getRows = async (client: any, range: string) => {
  const response = await client.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: range,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) return [];

  const headers = rows[0]; // แถวแรกเป็นหัวตาราง
  return rows.slice(1).map((row: any) => {
    const obj: any = {};
    headers.forEach((header: string, index: number) => {
      // จับคู่หัวตารางกับข้อมูลในแถวนั้นๆ
      obj[header.trim()] = row[index] || '';
    });
    return obj;
  });
};
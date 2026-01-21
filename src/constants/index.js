export * from './organization.js';
export * from './status.js';

// PIN สำหรับเข้าใช้งานระดับจังหวัด (Soft Gate)
export const PROVINCE_PIN = '1234';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://script.google.com/macros/s/AKfycbwx6FcoigOvqodRrJOSwe37U_ZT5HQITDdIxce0p18HMzvR9GSBiZMrsh7_-dQ8YSOR/exec',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};
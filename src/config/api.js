// src/config/api.js
// API Configuration for 1-Click Report System

const API_URL = 'https://script.google.com/macros/s/AKfycbwx6FcoigOvqodRrJOSwe37U_ZT5HQITDdIxce0p18HMzvR9GSBiZMrsh7_-dQ8YSOR/exec';

export const api = {
  // Test connection
  test: async () => {
    try {
      const res = await fetch(`${API_URL}?action=test`);
      return await res.json();
    } catch (error) {
      console.error('API Test Error:', error);
      return { status: 'error', message: error.message };
    }
  },
  
  // Get all sheets list
  getSheets: async () => {
    try {
      const res = await fetch(`${API_URL}?action=getSheets`);
      return await res.json();
    } catch (error) {
      console.error('API Error:', error);
      return { status: 'error', message: error.message };
    }
  },
  
  // Get reports
  getReports: async () => {
    try {
      const res = await fetch(`${API_URL}?action=getReports`);
      const data = await res.json();
      console.log('📋 Reports from API:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { status: 'error', message: error.message, data: [] };
    }
  },
  
  // Get organizations (districts)
  getOrgs: async () => {
    try {
      const res = await fetch(`${API_URL}?action=getOrgs`);
      const data = await res.json();
      console.log('🏛️ Orgs from API:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { status: 'error', message: error.message, data: [] };
    }
  },
  
  // Get groups
  getGroups: async () => {
    try {
      const res = await fetch(`${API_URL}?action=getGroups`);
      const data = await res.json();
      console.log('👥 Groups from API:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { status: 'error', message: error.message, data: [] };
    }
  },
  
  // Get submissions
  getSubmissions: async (reportId = null) => {
    try {
      const url = reportId 
        ? `${API_URL}?action=getSubmissions&reportId=${reportId}`
        : `${API_URL}?action=getSubmissions`;
      const res = await fetch(url);
      return await res.json();
    } catch (error) {
      console.error('API Error:', error);
      return { status: 'error', message: error.message, data: [] };
    }
  },
  
  // ✨ NEW: Create report template
  createReport: async (reportData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createReport',
          data: reportData
        })
      });
      const result = await res.json();
      console.log('💾 Create Report Response:', result);
      return result;
    } catch (error) {
      console.error('API Create Report Error:', error);
      return { status: 'error', message: error.message };
    }
  },
  
  // ✨ NEW: Submit report (P2D - Province to Department)
  submitReport: async (submissionData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submitReport',
          data: submissionData
        })
      });
      const result = await res.json();
      console.log('📤 Submit Report Response:', result);
      return result;
    } catch (error) {
      console.error('API Submit Report Error:', error);
      return { status: 'error', message: error.message };
    }
  },
  
  // ✨ NEW: Record district submission (D2P - District to Province)
  recordDistrictSubmission: async (submissionData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'recordDistrictSubmission',
          data: submissionData
        })
      });
      const result = await res.json();
      console.log('✅ District Submission Response:', result);
      return result;
    } catch (error) {
      console.error('API Record Submission Error:', error);
      return { status: 'error', message: error.message };
    }
  }
};

export default API_URL;
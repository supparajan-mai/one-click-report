import { useState, useCallback, useMemo } from 'react';
import { INITIAL_TASKS } from '../constants/initialData';

/**
 * useTasks Hook
 * จัดการ state และ logic ของ tasks
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [verifications, setVerifications] = useState({});

  /**
   * เพิ่ม task ใหม่
   */
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      status: 'รอดำเนินการ',
      sentCount: 0,
      targetDistricts: taskData.targetDistricts || []
    };
    
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  /**
   * อัพเดท task
   */
  const updateTask = useCallback((taskId, updates) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, ...updates }
          : task
      )
    );
  }, []);

  /**
   * เปลี่ยนสถานะ task
   */
  const updateTaskStatus = useCallback((taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  /**
   * ลบ task
   */
  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  /**
   * Filter tasks ตาม role และ selectedName
   */
  const getTasksByRole = useCallback((role, selectedName) => {
    return tasks.filter(task => {
      if (role === 'district') {
        // อำเภอเห็นเฉพาะ "อำเภอส่งจังหวัด"
        if (task.type !== 'อำเภอส่งจังหวัด') return false;
        
        // ถ้า targetDistricts ว่าง = ทุกอำเภอเห็น
        if (!task.targetDistricts || task.targetDistricts.length === 0) return true;
        
        // ถ้ามี targetDistricts = ต้องตรงกับอำเภอที่เลือก
        return task.targetDistricts.includes(selectedName);
      }
      
      if (role === 'province') {
        // จังหวัดเห็นเฉพาะ "จังหวัดส่งกรม" ที่ตรงกับกลุ่มงาน
        return task.type === 'จังหวัดส่งกรม' && task.group === selectedName;
      }
      
      return false;
    });
  }, [tasks]);

  /**
   * Get tasks by type
   */
  const getTasksByType = useCallback((type) => {
    return tasks.filter(task => task.type === type);
  }, [tasks]);

  /**
   * Get tasks by group
   */
  const getTasksByGroup = useCallback((group) => {
    return tasks.filter(task => task.group === group);
  }, [tasks]);

  /**
   * Get tasks by status
   */
  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  /**
   * คำนวณสถิติ
   */
  const getStatistics = useMemo(() => {
    const total = tasks.length;
    const submitted = tasks.filter(t => t.status === 'ส่งแล้ว').length;
    const pending = tasks.filter(t => t.status === 'รอดำเนินการ').length;
    const overdue = tasks.filter(t => t.status === 'เลยกำหนด').length;
    const partial = tasks.filter(t => t.status === 'ส่งบางส่วน').length;
    
    const progress = total > 0 ? Math.round((submitted / total) * 100) : 0;

    return {
      total,
      submitted,
      pending,
      overdue,
      partial,
      progress
    };
  }, [tasks]);

  /**
   * Get statistics by organization
   */
  const getStatsByOrganization = useCallback((organizationName, organizationType = 'district') => {
    let relevantTasks;
    
    if (organizationType === 'district') {
      relevantTasks = tasks.filter(task => 
        task.type === 'อำเภอส่งจังหวัด' && 
        (!task.targetDistricts || task.targetDistricts.length === 0 || task.targetDistricts.includes(organizationName))
      );
    } else {
      relevantTasks = tasks.filter(task => 
        task.type === 'จังหวัดส่งกรม' && 
        task.group === organizationName
      );
    }

    const total = relevantTasks.length;
    const submitted = relevantTasks.filter(t => t.status === 'ส่งแล้ว').length;
    const progress = total > 0 ? Math.round((submitted / total) * 100) : 0;

    return { total, submitted, progress };
  }, [tasks]);

  /**
   * Verify document received
   */
  const verifyDocument = useCallback((taskId, districtName, timestamp) => {
    const key = `${taskId}-${districtName}`;
    setVerifications(prev => ({
      ...prev,
      [key]: timestamp || new Date().toLocaleString('th-TH')
    }));
  }, []);

  /**
   * Unverify document
   */
  const unverifyDocument = useCallback((taskId, districtName) => {
    const key = `${taskId}-${districtName}`;
    setVerifications(prev => {
      const newVerifications = { ...prev };
      delete newVerifications[key];
      return newVerifications;
    });
  }, []);

  /**
   * Check if document is verified
   */
  const isDocumentVerified = useCallback((taskId, districtName) => {
    const key = `${taskId}-${districtName}`;
    return verifications[key] || null;
  }, [verifications]);

  return {
    // State
    tasks,
    verifications,
    
    // Actions
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    
    // Queries
    getTasksByRole,
    getTasksByType,
    getTasksByGroup,
    getTasksByStatus,
    
    // Statistics
    getStatistics,
    getStatsByOrganization,
    
    // Verifications
    verifyDocument,
    unverifyDocument,
    isDocumentVerified
  };
};
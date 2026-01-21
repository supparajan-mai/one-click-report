import { useState, useCallback } from 'react';
import { 
  canAccessView, 
  requiresPIN, 
  verifyPIN as verifyPINUtil,
  getAccessDeniedMessage,
  getDefaultViewForRole
} from '../utils/accessControl';

export const useAuth = () => {
  const [role, setRole] = useState(null);
  const [selectedName, setSelectedName] = useState('');
  const [isPINVerified, setIsPINVerified] = useState(false);
  const [pinError, setPinError] = useState('');

  const selectRole = useCallback((newRole, name) => {
    setRole(newRole);
    setSelectedName(name);
    setIsPINVerified(false);
  }, []);

  const verifyPIN = useCallback((inputPIN) => {
    const isValid = verifyPINUtil(inputPIN);
    if (isValid) {
      setIsPINVerified(true);
      setPinError('');
      return true;
    } else {
      setPinError('รหัส PIN ไม่ถูกต้อง');
      return false;
    }
  }, []);

  const clearPINVerification = useCallback(() => {
    setIsPINVerified(false);
    setPinError('');
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    setSelectedName('');
    setIsPINVerified(false);
    setPinError('');
  }, []);

  const checkAccess = useCallback((view) => {
    return canAccessView(role, view, isPINVerified);
  }, [role, isPINVerified]);

  const needsPIN = useCallback((view) => {
    return requiresPIN(view);
  }, []);

  const getErrorMessage = useCallback((view) => {
    return getAccessDeniedMessage(role, view);
  }, [role]);

  const getDefaultView = useCallback(() => {
    return getDefaultViewForRole(role);
  }, [role]);

  return {
    role,
    selectedName,
    isPINVerified,
    pinError,
    selectRole,
    verifyPIN,
    clearPINVerification,
    logout,
    checkAccess,
    needsPIN,
    getErrorMessage,
    getDefaultView,
    isDistrict: role === 'district',
    isProvince: role === 'province',
    isAuthenticated: role !== null
  };
};
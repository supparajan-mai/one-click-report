import React from 'react';
import { STATUS, STATUS_LABELS, STATUS_COLORS } from '../../constants/status.js';

export const Badge = ({ status, children, className = '' }) => {
  if (status) {
    const colors = STATUS_COLORS[status];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${className}`}>
        {STATUS_LABELS[status]}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  return <Badge status={status} />;
};

export const ProgressBadge = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  let colorClass = 'bg-red-100 text-red-800';
  if (percentage === 100) {
    colorClass = 'bg-green-100 text-green-800';
  } else if (percentage >= 70) {
    colorClass = 'bg-blue-100 text-blue-800';
  } else if (percentage >= 40) {
    colorClass = 'bg-yellow-100 text-yellow-800';
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {completed}/{total} ({percentage}%)
    </span>
  );
};
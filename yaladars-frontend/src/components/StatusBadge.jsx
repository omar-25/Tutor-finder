import React from 'react';

const STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   className: 'badge badge-pending'   },
  ACCEPTED:  { label: 'Confirmed', className: 'badge badge-accepted'  },
  REJECTED:  { label: 'Rejected',  className: 'badge badge-rejected'  },
  CANCELLED: { label: 'Cancelled', className: 'badge badge-cancelled' },
  COMPLETED: { label: 'Completed', className: 'badge badge-completed' },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return <span className={config.className}>{config.label}</span>;
};

export default StatusBadge;

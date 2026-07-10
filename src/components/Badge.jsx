import React from 'react';

const Badge = ({ type, text }) => {
    let bgColor, color;

    switch (type?.toLowerCase()) {
        case 'present':
        case 'approved':
        case 'active':
        case 'success':
            bgColor = 'rgba(34, 197, 94, 0.15)';
            color = 'var(--success)';
            break;
        case 'absent':
        case 'rejected':
        case 'danger':
            bgColor = 'rgba(239, 68, 68, 0.15)';
            color = 'var(--danger)';
            break;
        case 'leave':
        case 'pending':
        case 'warning':
            bgColor = 'rgba(245, 158, 11, 0.15)';
            color = 'var(--warning)';
            break;
        case 'late':
            bgColor = 'rgba(163, 217, 92, 0.2)';
            color = 'var(--primary-dark)';
            break;
        default:
            bgColor = 'var(--bg-color)';
            color = 'var(--text-secondary)';
    }

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            backgroundColor: bgColor,
            color: color
        }}>
            {text}
        </span>
    );
};

export default Badge;

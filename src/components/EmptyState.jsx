import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon = "📭", title = "No Data Found", message = "There is currently no data to display in this section.", actionText, onAction }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '48px 24px', 
            textAlign: 'center',
            background: 'var(--bg-color)',
            borderRadius: '16px',
            border: '1px dashed var(--border-color)',
            margin: '24px 0'
        }}
    >
        <div style={{ fontSize: '48px', marginBottom: '16px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {title}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '300px', marginBottom: '24px', lineHeight: '1.5' }}>
            {message}
        </p>
        {actionText && (
            <button className="btn-primary" onClick={onAction}>
                {actionText}
            </button>
        )}
    </motion.div>
);

export default EmptyState;

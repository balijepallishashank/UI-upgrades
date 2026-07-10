import React from 'react';
import { motion } from 'framer-motion';

const SegmentedControl = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div style={{
            display: 'flex',
            gap: '4px',
            background: 'var(--bg-color)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            width: 'fit-content',
            marginBottom: '24px'
        }}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        style={{
                            position: 'relative',
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            outline: 'none',
                            zIndex: 1,
                            transition: 'color 0.2s ease'
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId={`active-tab-indicator-${tabs.map(t=>t.id).join('')}`}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'var(--card-white)',
                                    borderRadius: '8px',
                                    boxShadow: 'var(--glass-shadow)',
                                    zIndex: -1,
                                    border: '1px solid var(--border-color)'
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            />
                        )}
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default SegmentedControl;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, UserPlus, CalendarCheck, CalendarOff, Box, MessageSquare, FileText } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const FloatingFAB = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const actions = [
        { label: 'Add Student', icon: Users, color: '#3B82F6', action: () => navigate('/students', { state: { tab: 'add' } }) },
        { label: 'Add Employee', icon: UserPlus, color: '#8B5CF6', action: () => navigate('/employees', { state: { tab: 'add' } }) },
        { label: 'Mark Attendance', icon: CalendarCheck, color: '#10B981', action: () => navigate('/attendance', { state: { tab: 'mark' } }) },
        { label: 'Apply Leave', icon: CalendarOff, color: '#F59E0B', action: () => navigate('/leave', { state: { tab: 'apply' } }) },
        { label: 'Add Stock', icon: Box, color: '#EC4899', action: () => navigate('/inventory', { state: { tab: 'add' } }) },
        { label: 'Send Broadcast', icon: MessageSquare, color: '#6366F1', action: () => navigate('/communication', { state: { tab: 'sms-email' } }) },
        { label: 'Generate Report', icon: FileText, color: '#64748B', action: () => navigate('/reports') }
    ];

    return (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9998, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            background: 'var(--card-white)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            padding: '12px',
                            boxShadow: 'var(--glass-shadow)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            minWidth: '220px'
                        }}
                    >
                        {actions.map((action, idx) => (
                            <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { action.action(); setIsOpen(false); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'left',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: action.color }}>
                                    <action.icon size={14} />
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{action.label}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isOpen ? 45 : 0 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '28px',
                    background: 'var(--primary-dark)',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(6, 78, 59, 0.4)',
                    zIndex: 2
                }}
            >
                <Plus size={24} />
            </motion.button>
        </div>
    );
};

export default FloatingFAB;

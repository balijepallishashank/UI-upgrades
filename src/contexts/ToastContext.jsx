import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

const Toast = ({ id, type = 'success', title, message, removeToast }) => {
    const icons = {
        success: <CheckCircle size={20} color="var(--success)" />,
        warning: <AlertTriangle size={20} color="var(--warning)" />,
        error: <XCircle size={20} color="var(--danger)" />,
        info: <Info size={20} color="var(--primary-dark)" />
    };

    const borders = {
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--danger)',
        info: 'var(--primary-dark)'
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(id);
        }, 4000);
        return () => clearTimeout(timer);
    }, [id, removeToast]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            style={{
                width: '320px',
                background: 'var(--card-white)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
                borderLeft: `4px solid ${borders[type]}`,
                borderRadius: '12px',
                padding: '16px',
                boxShadow: 'var(--glass-shadow)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{icons[type]}</div>
            <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{title}</h4>
                {message && <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{message}</p>}
            </div>
            <button 
                onClick={() => removeToast(id)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
            >
                <X size={14} />
            </button>
            <motion.div 
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4, ease: "linear" }}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '3px',
                    width: '100%',
                    background: borders[type],
                    transformOrigin: 'left'
                }}
            />
        </motion.div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        setToasts((prev) => {
            const newToasts = [...prev, { ...toast, id: Date.now() }];
            if (newToasts.length > 3) newToasts.shift();
            return newToasts;
        });
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '32px',
                right: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 9999,
                pointerEvents: 'none'
            }}>
                <AnimatePresence>
                    {toasts.map((t) => (
                        <div key={t.id} style={{ pointerEvents: 'auto' }}>
                            <Toast {...t} removeToast={removeToast} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

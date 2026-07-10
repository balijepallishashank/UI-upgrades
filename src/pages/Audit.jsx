import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Activity, Clock, Server, Monitor } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import AnimatedNumber from '../components/AnimatedNumber';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { mockAuditLogs, mockEmployees } from '../mockData';
import { useToast } from '../contexts/ToastContext';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const KPICard = ({ title, value, icon: Icon, color }) => (
    <motion.div 
        variants={itemVariants} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, margin: "-50px" }}
        className="card"
        style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}
        whileHover={{ y: -5, scale: 1.02, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
    >
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            <Icon size={24} />
        </div>
        <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{title}</p>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
            </h3>
        </div>
    </motion.div>
);

const TimelineItem = ({ log, index }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            style={{ display: 'flex', gap: '20px', position: 'relative' }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-dark)', zIndex: 2, border: '2px solid var(--bg-color)' }} />
                <div style={{ width: '2px', height: '100%', background: 'var(--border-color)', position: 'absolute', top: '12px', left: '5px', zIndex: 1 }} />
            </div>
            <div className="card" style={{ padding: '16px 20px', flex: 1, marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{log.user}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{log.timestamp}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>{log.action}</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--primary-dark)', background: 'rgba(163, 217, 92, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>{log.module}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>IP: {log.ip}</span>
                </div>
            </div>
        </motion.div>
    );
};

const Audit = () => {
    const [activeTab, setActiveTab] = useState('activity');
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const tabs = [
        { id: 'activity', label: 'Activity Timeline' },
        { id: 'users', label: 'Active Users' },
        { id: 'loginHistory', label: 'Login & IP History' },
    ];

    const exportLogs = () => {
        addToast({ type: 'success', title: 'Logs Exported', message: 'System security logs exported as spreadsheet.' });
    };

    return (
        <PageTransition>
            <div className="dashboard-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>🛡️</span> Audit Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        Monitor real-time system mutations, administrator check-ins, and IP session access trails.
                    </p>
                </div>
                <button className="btn-white" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={exportLogs}>
                    <Server size={18} /> Export System Logs
                </button>
            </div>

            <SegmentedControl tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    style={{ marginTop: '24px' }}
                >
                    {activeTab === 'activity' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                                <KPICard title="Events Logged Today" value={142} icon={Activity} color="#3B82F6" />
                                <KPICard title="Active Session Users" value={28} icon={Users} color="#22C55E" />
                                <KPICard title="Critical Alerts" value={2} icon={Shield} color="#EF4444" />
                                <KPICard title="Uptime SLA" value="99.99%" icon={Clock} color="#8B5CF6" />
                            </div>

                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>System Events Timeline</h3>
                            
                            <div style={{ maxWidth: '800px', paddingLeft: '12px' }}>
                                {isLoading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                                        <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary-dark)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                    </div>
                                ) : (
                                    mockAuditLogs.map((log, idx) => (
                                        <TimelineItem key={log.id} log={log} index={idx} />
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'users' && (
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Currently Active Session Users</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {mockEmployees.slice(0, 8).map((user, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-color)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ position: 'relative' }}>
                                                <img src={user.avatar} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                                <div style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%', border: '2px solid var(--card-white)', position: 'absolute', bottom: 0, right: 0 }} />
                                            </div>
                                            <div>
                                                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--text-primary)' }}>{user.name}</strong>
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{user.role}</span>
                                            </div>
                                        </div>
                                        <Badge type="Success" text="Online Now" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'loginHistory' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Critical Security Alerts */}
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--danger)' }}>Active Security Incident Alerts</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { title: 'Failed Login Threshold Exceeded', msg: 'User Vikram Singh failed login 5 times from IP 192.168.1.104', date: '3 hours ago', severity: 'Absent' },
                                        { title: 'Unusual Session Location', msg: 'Privileged user Anita Rao session detected outside office hours.', date: 'Yesterday', severity: 'Warning' }
                                    ].map((alert, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-color)' }}>
                                            <div>
                                                <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '13px' }}>{alert.title}</strong>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>{alert.msg}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                                <Badge type={alert.severity === 'Absent' ? 'Absent' : 'Warning'} text={alert.severity === 'Absent' ? 'High Severity' : 'Medium Severity'} />
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{alert.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <motion.div variants={itemVariants} initial="hidden" animate="show">
                                <DataTable 
                                    title="Login Roster Audits"
                                    columns={[
                                        { header: 'Session ID', accessor: 'id' },
                                        { header: 'User Account', accessor: 'user', render: (row) => <strong style={{color: 'var(--text-primary)'}}>{row.user}</strong> },
                                        { header: 'IP Address', accessor: 'ip' },
                                        { header: 'Device / Agent', accessor: 'device' },
                                        { header: 'Access Time', accessor: 'timestamp' },
                                        { header: 'Login Outcome', accessor: 'status', render: (row) => <Badge type={row.status === 'Absent' ? 'Absent' : 'Success'} text={row.status === 'Absent' ? 'Failed' : 'Success'} /> }
                                    ]}
                                    data={[
                                        { id: 'SESS-8921', user: 'Dr. Anita Rao', ip: '192.168.1.12', device: 'Chrome / Windows', timestamp: '10:42 AM', status: 'Success' },
                                        { id: 'SESS-8922', user: 'Meera Nair', ip: '192.168.1.45', device: 'Safari / MacOS', timestamp: '09:15 AM', status: 'Success' },
                                        { id: 'SESS-8923', user: 'Vikram Singh', ip: '192.168.1.104', device: 'Firefox / Linux', timestamp: '08:50 AM', status: 'Absent' },
                                        { id: 'SESS-8924', user: 'Sanjay Kumar', ip: '192.168.1.60', device: 'Edge / Windows', timestamp: '08:30 AM', status: 'Success' }
                                    ]}
                                    isLoading={isLoading}
                                />
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </PageTransition>
    );
};

export default Audit;

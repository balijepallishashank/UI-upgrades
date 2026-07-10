import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell, MessageSquare, Mail, Send, Copy
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import Badge from '../components/Badge';
import AnimatedNumber from '../components/AnimatedNumber';
import { useToast } from '../contexts/ToastContext';
import { mockNotifications, mockSMS, mockEmailDelivery } from '../mockData';

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const KPICard = ({ title, value, icon: Icon, color }) => (
    <motion.div 
        variants={itemVariants}
        className="card"
        style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
        whileHover={{ y: -4, scale: 1.01 }}
    >
        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            <Icon size={20} />
        </div>
        <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>{title}</p>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
            </h3>
        </div>
    </motion.div>
);

const Communication = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToast();
    
    const [activeTab, setActiveTab] = useState('overview');
    
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Notification list state (to mark as read)
    const [notifs, setNotifs] = useState(mockNotifications);

    // SMS/Email Form States
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [broadcastTarget, setBroadcastTarget] = useState('All Students');
    const [smsMsg, setSmsMsg] = useState('');
    const [smsTarget, setSmsTarget] = useState('Parents (CS-A)');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [emailTarget, setEmailTarget] = useState('All Employees');

    useEffect(() => {
        if (location.state?.tab) {
            let targetTab = location.state.tab;
            if (targetTab === 'notifications') {
                targetTab = 'overview';
            } else if (targetTab === 'sms') {
                targetTab = 'sms-email';
            }
            setActiveTab(targetTab);
        }
    }, [location]);

    const markNotificationRead = (id) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, status: 'Read' } : n));
        addToast({ type: 'success', title: 'Notification Read', message: 'Marked notification as read.' });
    };

    const handleBroadcastSubmit = (e) => {
        e.preventDefault();
        if (!broadcastMsg.trim()) return;
        addToast({ type: 'success', title: 'Announcement Broadcasted', message: `Message sent to ${broadcastTarget} segment.` });
        setBroadcastMsg('');
    };

    const handleSmsSubmit = (e) => {
        e.preventDefault();
        if (!smsMsg.trim()) return;
        addToast({ type: 'success', title: 'SMS Dispatched', message: `SMS queued for ${smsTarget} via SMS gateway.` });
        setSmsMsg('');
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!emailSubject.trim() || !emailBody.trim()) return;
        addToast({ type: 'success', title: 'Email Sent', message: `Newsletter dispatched to ${emailTarget} segment.` });
        setEmailSubject('');
        setEmailBody('');
    };

    const loadTemplate = (text) => {
        setActiveTab('sms-email');
        setSmsMsg(text);
        setEmailBody(text);
        setEmailSubject('Urgent Institution Circular');
        addToast({ type: 'info', title: 'Template Loaded', message: 'Copied template content to editor.' });
    };

    const mainTabs = [
        { id: 'overview', label: 'Overview & Broadcast' },
        { id: 'sms-email', label: 'SMS & Email Centers' },
        { id: 'history', label: 'Templates & History' }
    ];

    const templates = [
        { title: 'PTM Announcement', text: 'Dear Parent, the Parent-Teacher Meeting is scheduled for this Saturday, July 11, at 10:00 AM. Please attend to discuss your ward\'s academic progress.' },
        { title: 'Rain Holiday Notice', text: 'Dear Students, please note that the institution will remain closed tomorrow, July 07, due to warnings of heavy rain in Noida. Online classes will run as scheduled.' },
        { title: 'Fee Payment Reminder', text: 'Dear Parent, this is a reminder that the outstanding tuition fee installment is due on July 15. Please settle via UPI or NetBanking portal to avoid penalty.' }
    ];

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>💬</span> Communication Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Dispatch institutional broadcasts, compose SMS campaigns, issue email circulars, and monitor alerts.
                    </p>
                </div>
            </div>

            <SegmentedControl tabs={mainTabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* 1. OVERVIEW & BROADCAST */}
                    {activeTab === 'overview' && (
                        <div className="responsive-split-grid-alt">
                            {/* Live Notifications Feed */}
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={18} /> System Notification Feeds</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {notifs.map((n, idx) => (
                                        <div key={idx} style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            padding: '12px 16px', 
                                            background: n.status === 'Unread' ? 'rgba(163, 217, 92, 0.08)' : 'var(--bg-color)', 
                                            borderRadius: '10px',
                                            borderLeft: n.status === 'Unread' ? '4px solid var(--primary-green)' : '4px solid transparent'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ fontSize: '22px' }}>{n.icon}</span>
                                                <div>
                                                    <strong style={{ fontSize: '13px', display: 'block' }}>{n.title}</strong>
                                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{n.message}</p>
                                                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{n.date}</span>
                                                </div>
                                            </div>
                                            {n.status === 'Unread' && (
                                                <button className="btn-white" style={{ padding: '4px 8px', fontSize: '10px' }} onClick={() => markNotificationRead(n.id)}>
                                                    Read
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Broadcast message form */}
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Send size={18} /> Create Global Broadcast</h3>
                                <form onSubmit={handleBroadcastSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Target Audience</label>
                                        <select value={broadcastTarget} onChange={(e) => setBroadcastTarget(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                            <option>All Students</option>
                                            <option>All Employees</option>
                                            <option>Support Staff</option>
                                            <option>Parents</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Broadcast Message</label>
                                        <textarea rows={4} placeholder="Type announcement..." value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required></textarea>
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                        <Send size={14} /> Send Broadcast
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* 2. SMS & EMAIL CENTERS */}
                    {activeTab === 'sms-email' && (
                        <div className="responsive-split-grid">
                            {/* SMS Composer */}
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><MessageSquare size={18} /> SMS Campaign Composer</h3>
                                <form onSubmit={handleSmsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Recipient Segment</label>
                                        <select value={smsTarget} onChange={(e) => setSmsTarget(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
                                            <option>Parents (CS-A)</option>
                                            <option>Parents (IT-B)</option>
                                            <option>All Staff</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>SMS Body ({160 - smsMsg.length} characters left)</label>
                                        <textarea maxLength={160} rows={3} placeholder="Compose SMS..." value={smsMsg} onChange={(e) => setSmsMsg(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }} required></textarea>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="submit" className="btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                            <Send size={14} /> Dispatch SMS
                                        </button>
                                        <button type="button" className="btn-white" style={{ display: 'flex', justifyContent: 'center', gap: '6px', borderColor: '#25D366', color: '#25D366' }} 
                                            onClick={() => {
                                                if(!smsMsg.trim()) { addToast({ type: 'error', title: 'Empty Message', message: 'Please write a message first.' }); return; }
                                                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(smsMsg)}`, '_blank');
                                                addToast({ type: 'success', title: 'Redirecting', message: 'Opening WhatsApp Web Gateway...' });
                                            }}>
                                            🟢 WhatsApp
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Email Composer */}
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={18} /> Email Newsletter Broadcaster</h3>
                                <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Recipient Group</label>
                                        <select value={emailTarget} onChange={(e) => setEmailTarget(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
                                            <option>All Employees</option>
                                            <option>All Students</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Subject Line *</label>
                                        <input type="text" placeholder="Enter Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }} required />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email Content Body *</label>
                                        <textarea rows={3} placeholder="Write email body..." value={emailBody} onChange={(e) => setEmailBody(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontFamily: 'inherit' }} required></textarea>
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                        <Send size={14} /> Send Email
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* 3. TEMPLATES & HISTORY */}
                    {activeTab === 'history' && (
                        <div>
                            <div className="responsive-split-grid-alt">
                                {/* Templates */}
                                <div className="card" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Predefined Templates</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {templates.map((tpl, idx) => (
                                            <div key={idx} style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-color)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                                                    <strong style={{ fontSize: '13px' }}>{tpl.title}</strong>
                                                    <button className="btn-white" style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => loadTemplate(tpl.text)}>
                                                        <Copy size={11} /> Use Template
                                                    </button>
                                                </div>
                                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{tpl.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* SMS Logs History */}
                                <div className="card" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Broadcast Logs History</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {mockSMS.map((sms, idx) => (
                                            <div key={idx} style={{ pb: '8px', borderBottom: idx < mockSMS.length - 1 ? '1px solid var(--border-color)' : 'none', fontSize: '12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <strong>To: {sms.recipient}</strong>
                                                    <span style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>{sms.date}</span>
                                                </div>
                                                <p style={{ color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>{sms.message}</p>
                                                <Badge type="Success" text={sms.status} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Email Delivery Statistics Table */}
                            <div className="card" style={{ padding: '24px', marginTop: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Mail size={18} /> Email Campaign Delivery & Open Tracking
                                </h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
                                                <th style={{ padding: '10px' }}>Campaign Subject</th>
                                                <th style={{ padding: '10px' }}>Recipient Group</th>
                                                <th style={{ padding: '10px', textAlign: 'center' }}>Sent</th>
                                                <th style={{ padding: '10px', textAlign: 'center' }}>Delivered</th>
                                                <th style={{ padding: '10px', textAlign: 'center' }}>Opened</th>
                                                <th style={{ padding: '10px', textAlign: 'center' }}>Bounced</th>
                                                <th style={{ padding: '10px' }}>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockEmailDelivery.map((email, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '10px', fontWeight: 600, color: 'var(--text-primary)' }}>{email.subject}</td>
                                                    <td style={{ padding: '10px' }}>{email.recipient}</td>
                                                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 600 }}>{email.sent}</td>
                                                    <td style={{ padding: '10px', textAlign: 'center', color: 'var(--primary-green)', fontWeight: 600 }}>{email.delivered}</td>
                                                    <td style={{ padding: '10px', textAlign: 'center', color: 'var(--primary-dark)', fontWeight: 600 }}>{email.opened}</td>
                                                    <td style={{ padding: '10px', textAlign: 'center', color: 'var(--danger)', fontWeight: 600 }}>{email.bounced}</td>
                                                    <td style={{ padding: '10px', color: 'var(--text-secondary)', fontSize: '12px' }}>{email.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </PageTransition>
    );
};

export default Communication;

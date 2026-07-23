import React, { useState } from 'react';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import { 
    Sliders, Calendar, ShieldAlert, UserCheck, Server, Save, 
    Moon, Sun, Shield, Download, RefreshCw, Bell
} from 'lucide-react';
import Badge from '../components/Badge';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { addToast } = useToast();

    const [activePanel, setActivePanel] = useState('general');

    // States for custom interactive fields
    const [instName, setInstName] = useState('Titus Institute of Technology');
    const [academicYear, setAcademicYear] = useState('2026-2027');
    const [academicTerm, setAcademicTerm] = useState('Fall Semester');
    const [lateBuffer, setLateBuffer] = useState(15);
    const [minAttendance, setMinAttendance] = useState(75);
    const [weeklyOffs, setWeeklyOffs] = useState({ Saturday: true, Sunday: true });
    
    // States for custom notification preferences
    const [notifPreferences, setNotifPreferences] = useState({
        biometricCheckIn: true,
        lateArrivalSms: true,
        feeDuesEmail: false,
        leavePush: true,
    });
    
    // Security session logs state
    const [sessions, setSessions] = useState([
        { id: 1, user: 'admin@titus.edu', device: 'Chrome / Windows 11', ip: '192.168.1.15', active: 'Active now' },
        { id: 2, user: 'hod.cs@titus.edu', device: 'Safari / macOS Catalina', ip: '192.168.1.22', active: '4 hours ago' },
        { id: 3, user: 'registrar@titus.edu', device: 'Firefox / Ubuntu Linux', ip: '192.168.2.105', active: '1 day ago' },
    ]);

    // Roles and permissions matrix state
    const [permissions, setPermissions] = useState({
        Admin: { students: true, attendance: true, finance: true, settings: true },
        Teacher: { students: true, attendance: true, finance: false, settings: false },
        Staff: { students: true, attendance: false, finance: false, settings: false },
        Student: { students: false, attendance: false, finance: false, settings: false },
    });

    const handleSave = () => {
        addToast({ 
            type: 'success', 
            title: 'System Settings Saved', 
            message: 'All system parameters and policy configurations updated successfully.' 
        });
    };

    const handleTogglePermission = (role, module) => {
        setPermissions(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [module]: !prev[role][module]
            }
        }));
        addToast({ 
            type: 'info', 
            title: 'Permissions Adjusted', 
            message: `Updated access policy for ${role} on ${module} module.` 
        });
    };

    const handleRevokeSession = (id, user) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        addToast({ 
            type: 'warning', 
            title: 'Session Revoked', 
            message: `Successfully disconnected session for user ${user}.` 
        });
    };

    const handleDownloadBackup = () => {
        addToast({ 
            type: 'success', 
            title: 'SQL Backup Initialized', 
            message: `SQL file generated: titus_backup_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.sql. Downloading...` 
        });
    };

    const panelsList = [
        { id: 'general', name: 'General Settings', desc: 'Institution profile, academic calendar', icon: Sliders },
        { id: 'attendance', name: 'Attendance Rules', desc: 'Late buffer, thresholds, weekly offs', icon: Calendar },
        { id: 'notifications', name: 'Notification Settings', desc: 'Email alerts, SMS triggers, system feeds', icon: Bell },
        { id: 'security', name: 'Security & Access', desc: 'IP logging, Active Login sessions', icon: ShieldAlert },
        { id: 'roles', name: 'Roles & Permissions', desc: 'Module access matrix by user role', icon: UserCheck },
        { id: 'backup', name: 'Backup & Restore', desc: 'Database dumps, cloud logging system', icon: Server },
    ];

    return (
        <PageTransition>
            <div className="dashboard-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>⚙️</span> System Settings
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        Configure organization-wide policies, academic terms, session controls, and permissions.
                    </p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleSave}>
                    <Save size={18} /> Save Settings
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '32px' }}>
                {/* Sidebar Navigation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {panelsList.map((tab) => {
                        const isCurrent = activePanel === tab.id;
                        const Icon = tab.icon;
                        return (
                            <div 
                                key={tab.id} 
                                onClick={() => setActivePanel(tab.id)}
                                style={{ 
                                    padding: '16px', 
                                    borderRadius: '12px', 
                                    border: isCurrent ? '1px solid var(--primary-dark)' : '1px solid var(--border-color)', 
                                    background: isCurrent ? 'var(--primary-light)' : 'var(--card-white)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px'
                                }}
                            >
                                <div style={{ 
                                    width: '32px', 
                                    height: '32px', 
                                    borderRadius: '8px', 
                                    background: isCurrent ? 'var(--primary-dark)15' : 'var(--bg-color)', 
                                    color: isCurrent ? 'var(--primary-dark)' : 'var(--text-secondary)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <Icon size={16} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: isCurrent ? 'var(--primary-dark)' : 'var(--text-primary)' }}>{tab.name}</h4>
                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{tab.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Form Panels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    
                    {/* PANEL 1: GENERAL SETTINGS */}
                    {activePanel === 'general' && (
                        <div className="card" style={{ padding: '28px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Sliders size={20} color="var(--primary-dark)" /> General Organization Profile
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Institution Name</label>
                                        <input 
                                            type="text" 
                                            value={instName}
                                            onChange={e => setInstName(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '13px' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Contact Email</label>
                                        <input 
                                            type="email" 
                                            defaultValue="admin@titus.edu" 
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '13px' }} 
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Academic Term Calendar</label>
                                        <select 
                                            value={academicTerm}
                                            onChange={e => setAcademicTerm(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '13px' }}
                                        >
                                            <option value="Fall Semester">Fall Semester</option>
                                            <option value="Spring Semester">Spring Semester</option>
                                            <option value="Summer Session">Summer Session</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Academic Session Year</label>
                                        <select 
                                            value={academicYear}
                                            onChange={e => setAcademicYear(e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '13px' }}
                                        >
                                            <option value="2026-2027">2026-2027 (Active)</option>
                                            <option value="2025-2026">2025-2026</option>
                                            <option value="2027-2028">2027-2028</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>Appearance Options</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                        <div>
                                            <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '13px' }}>System Theme Mode</strong>
                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>Toggle between light and dark UI presentation styles.</span>
                                        </div>
                                        <button className="btn-white" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }} onClick={toggleTheme}>
                                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PANEL 2: ATTENDANCE RULES */}
                    {activePanel === 'attendance' && (
                        <div className="card" style={{ padding: '28px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Calendar size={20} color="var(--primary-dark)" /> Attendance Policies & Thresholds
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Late Buffer Threshold (Minutes)</label>
                                        <input 
                                            type="number" 
                                            value={lateBuffer}
                                            onChange={e => setLateBuffer(+e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '13px' }} 
                                        />
                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>Minutes allowed after check-in time before flagging "Late".</span>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Min Mandatory Attendance Rate (%)</label>
                                        <input 
                                            type="number" 
                                            value={minAttendance}
                                            onChange={e => setMinAttendance(+e.target.value)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '13px' }} 
                                        />
                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>Minimum attendance rate required to generate Admit Cards.</span>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Weekly Holidays</label>
                                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                            <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={!!weeklyOffs[day]}
                                                    onChange={e => setWeeklyOffs({ ...weeklyOffs, [day]: e.target.checked })}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                {day}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PANEL 3: SECURITY & SESSIONS */}
                    {activePanel === 'security' && (
                        <div className="card" style={{ padding: '28px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Shield size={20} color="var(--primary-dark)" /> Security Access Policies
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'flex-end' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Allowed Administrator IP Subnet Range</label>
                                        <input 
                                            type="text" 
                                            defaultValue="192.168.1.0/24, 10.0.0.0/8" 
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '13px' }} 
                                        />
                                    </div>
                                    <button className="btn-white" style={{ padding: '11px', fontSize: '12px' }} onClick={() => addToast({ type: 'success', title: 'Whitelist Configured', message: 'Allowed IP ranges have been verified.' })}>
                                        Verify Range
                                    </button>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>Active User Login Sessions</h4>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                                    <th style={{ padding: '10px' }}>User Session</th>
                                                    <th style={{ padding: '10px' }}>Device & Client</th>
                                                    <th style={{ padding: '10px' }}>IP Location</th>
                                                    <th style={{ padding: '10px' }}>Status</th>
                                                    <th style={{ padding: '10px', textAlign: 'center' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sessions.map((sess) => (
                                                    <tr key={sess.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                        <td style={{ padding: '10px', fontWeight: 600 }}>{sess.user}</td>
                                                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{sess.device}</td>
                                                        <td style={{ padding: '10px', fontFamily: 'monospace' }}>{sess.ip}</td>
                                                        <td style={{ padding: '10px' }}><Badge type={sess.active.includes('now') ? 'Success' : 'Warning'} text={sess.active} /></td>
                                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                                            <button 
                                                                className="btn-white" 
                                                                style={{ padding: '4px 8px', fontSize: '10px', borderColor: 'var(--danger)60', color: 'var(--danger)' }} 
                                                                onClick={() => handleRevokeSession(sess.id, sess.user)}
                                                            >
                                                                Disconnect
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PANEL 4: ROLES & PERMISSIONS */}
                    {activePanel === 'roles' && (
                        <div className="card" style={{ padding: '28px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <UserCheck size={20} color="var(--primary-dark)" /> User Role Authorization Rules
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                                Distribute functional read/write permissions dynamically across standard user classification roles.
                            </p>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                            <th style={{ padding: '12px' }}>Role Classification</th>
                                            <th style={{ padding: '12px', textAlign: 'center' }}>Manage Students</th>
                                            <th style={{ padding: '12px', textAlign: 'center' }}>Mark Attendance</th>
                                            <th style={{ padding: '12px', textAlign: 'center' }}>Finance Ledger</th>
                                            <th style={{ padding: '12px', textAlign: 'center' }}>System Settings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(permissions).map(([role, modules]) => (
                                            <tr key={role} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>{role}</td>
                                                {['students', 'attendance', 'finance', 'settings'].map((mod) => (
                                                    <td key={mod} style={{ textAlign: 'center', padding: '12px' }}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={modules[mod]}
                                                            disabled={role === 'Admin'} // Admin has absolute master access
                                                            onChange={() => handleTogglePermission(role, mod)}
                                                            style={{ cursor: role === 'Admin' ? 'not-allowed' : 'pointer', width: '16px', height: '16px' }}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* PANEL 5: BACKUP & RESTORE */}
                    {activePanel === 'backup' && (
                        <div className="card" style={{ padding: '28px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Server size={20} color="var(--primary-dark)" /> Backup & System Restore Center
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-color)' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Trigger SQL Dump Backup</h4>
                                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>Compile a snapshot of the primary relational database and download locally.</p>
                                        <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleDownloadBackup}>
                                            <Download size={14} /> Download SQL Backup
                                        </button>
                                    </div>
                                    <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-color)' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Restore Database Point</h4>
                                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>Upload an existing Titus SQL backup snapshot file to overwrite system data.</p>
                                        <button className="btn-white" style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => addToast({ type: 'info', title: 'File Upload', message: 'Please select a valid .sql backup snapshot file.' })}>
                                            <RefreshCw size={14} /> Upload & Restore point
                                        </button>
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--danger)', marginBottom: '12px' }}>Danger Zone</h4>
                                    <div style={{ padding: '16px', border: '1px solid var(--danger)30', background: 'var(--danger)05', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong style={{ display: 'block', color: 'var(--danger)', fontSize: '13px' }}>Flush Audit Logs Database</strong>
                                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                                                Deletes all transaction history and system audit logs older than 365 days. Action is irreversible.
                                            </span>
                                        </div>
                                        <button className="btn-white" style={{ borderColor: 'var(--danger)60', color: 'var(--danger)', fontSize: '12px' }} onClick={() => addToast({ type: 'error', title: 'Action Denied', message: 'You must have Master System Owner credentials to perform this.' })}>
                                            Flush Log Database
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PANEL: NOTIFICATION SETTINGS */}
                    {activePanel === 'notifications' && (
                        <div className="card" style={{ padding: '28px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Bell size={20} color="var(--primary-dark)" /> Organizational Alert Preferences
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                                Configure organization-wide notification triggers, SMS gateways, and automated email dispatches.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { key: 'biometricCheckIn', label: 'Biometric Check-In Logs', desc: 'Log immediate check-in logs directly to the live Activity Feed.' },
                                    { key: 'lateArrivalSms', label: 'Parental SMS Warnings', desc: 'Send automated late check-in SMS notifications to parents for late students.' },
                                    { key: 'feeDuesEmail', label: 'Weekly Fee Ledger Digests', desc: 'Email outstanding payment reminders to defaulter lists automatically every Sunday.' },
                                    { key: 'leavePush', label: 'Leave Center Push Triggers', desc: 'Alert administrators instantly upon new leave request submissions.' }
                                ].map((item) => (
                                    <div 
                                        key={item.key} 
                                        style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            padding: '14px 18px', 
                                            background: 'var(--bg-color)', 
                                            borderRadius: '10px', 
                                            border: '1px solid var(--border-color)' 
                                        }}
                                    >
                                        <div style={{ paddingRight: '16px' }}>
                                            <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '13px' }}>{item.label}</strong>
                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>{item.desc}</span>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setNotifPreferences(prev => {
                                                    const updated = { ...prev, [item.key]: !prev[item.key] };
                                                    addToast({ 
                                                        type: 'info', 
                                                        title: 'Setting Changed', 
                                                        message: `${item.label} notification triggers are now ${updated[item.key] ? 'ENABLED' : 'DISABLED'}.` 
                                                    });
                                                    return updated;
                                                });
                                            }}
                                            style={{ 
                                                padding: '6px 12px', 
                                                fontSize: '12px', 
                                                fontWeight: 600,
                                                borderRadius: '6px', 
                                                border: '1px solid var(--border-color)', 
                                                background: notifPreferences[item.key] ? 'var(--primary-green)' : 'var(--card-white)',
                                                color: notifPreferences[item.key] ? 'white' : 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                boxShadow: notifPreferences[item.key] ? '0 2px 6px rgba(16, 185, 129, 0.2)' : 'none'
                                            }}
                                        >
                                            {notifPreferences[item.key] ? 'Enabled' : 'Disabled'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </PageTransition>
    );
};

export default Settings;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, UserCheck, CalendarOff,
    Clock, ShieldAlert, MapPin, Phone, FileText, Calendar, FileUp, User
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import AnimatedNumber from '../components/AnimatedNumber';
import { useToast } from '../contexts/ToastContext';
import { mockStaff, mockLeave } from '../mockData';

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const KPICard = ({ title, value, icon: Icon, color }) => (
    <motion.div 
        variants={itemVariants}
        className="card"
        style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
        whileHover={{ y: -4, scale: 1.01, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
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

const Staff = () => {
    const location = useLocation();
    const { addToast } = useToast();
    
    const [activeTab, setActiveTab] = useState('overview');
    
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const [selectedStaff, setSelectedStaff] = useState(null);
    const [detailsSubTab, setDetailsSubTab] = useState('profile');
    const [leavesList, setLeavesList] = useState(mockLeave);
    
    // Apply leave form state
    const [applyLeaveType, setApplyLeaveType] = useState('Casual Leave');
    const [applyLeaveFrom, setApplyLeaveFrom] = useState('');
    const [applyLeaveTo, setApplyLeaveTo] = useState('');
    const [applyLeaveReason, setApplyLeaveReason] = useState('');
    
    // Add Staff Form State
    const [formData, setFormData] = useState({
        name: '', role: 'Security Guard', shift: 'Morning', phone: '', assignedArea: 'Block A'
    });

    // Check deep links
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            if (location.state.tab === 'details' && location.state.staffId) {
                const st = mockStaff.find(s => s.id === location.state.staffId);
                if (st) {
                    setSelectedStaff(st);
                    setDetailsSubTab('profile');
                }
            }
        }
    }, [location]);

    const handleRowClick = (st) => {
        setSelectedStaff(st);
        setActiveTab('details');
        setDetailsSubTab('profile');
        addToast({ type: 'info', title: 'Support Staff Hub', message: `Opened Hub for ${st.name}` });
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddStaffSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) {
            addToast({ type: 'error', title: 'Registration Failed', message: 'Please fill in all mandatory fields.' });
            return;
        }
        addToast({ type: 'success', title: 'Staff Added', message: `${formData.name} successfully registered as ${formData.role}!` });
        setActiveTab('directory');
        setFormData({ name: '', role: 'Security Guard', shift: 'Morning', phone: '', assignedArea: 'Block A' });
    };

    // Stats
    const totalStaff = mockStaff.length;
    const presentToday = mockStaff.filter(s => s.status === 'Present').length;
    const absentToday = mockStaff.filter(s => s.status === 'Absent').length;
    const lateToday = mockStaff.filter(s => s.status === 'Late').length;

    const mainTabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'directory', label: 'Staff Directory' },
        ...(selectedStaff ? [{ id: 'details', label: `Details: ${selectedStaff.name}` }] : []),
        { id: 'add', label: 'Add Support Staff' }
    ];

    const staffColumns = [
        { header: 'Staff Profile', accessor: 'name', render: (row) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={row.avatar} alt={row.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '13px' }}>{row.name}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{row.id}</span>
                </div>
            </div>
        ) },
        { header: 'Role / Duties', accessor: 'role' },
        { header: 'Shift', accessor: 'shift' },
        { header: 'Assigned Work Area', accessor: 'assignedArea' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Status', accessor: 'status', render: (row) => <Badge type={row.status} text={row.status} /> }
    ];

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>👷</span> Support Staff Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage shift rosters, background check verifications, duties, and work assignments for support staff.
                    </p>
                </div>
                {activeTab !== 'add' && (
                    <button className="btn-primary" onClick={() => setActiveTab('add')}>
                        Add Staff Member
                    </button>
                )}
            </div>

            {/* Main Tabs */}
            <SegmentedControl tabs={mainTabs} activeTab={activeTab} onTabChange={(tabId) => {
                setActiveTab(tabId);
                if (tabId !== 'details') setSelectedStaff(null);
            }} />

            {/* Content Switcher */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* 1. OVERVIEW VIEW */}
                    {activeTab === 'overview' && (
                        <div>
                            {/* KPI cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <KPICard title="Total Support Staff" value={totalStaff} icon={Users} color="#3B82F6" />
                                <KPICard title="Active On Duty" value={presentToday} icon={UserCheck} color="#22C55E" />
                                <KPICard title="Absentees" value={absentToday} icon={ShieldAlert} color="#EF4444" />
                                <KPICard title="Late Today" value={lateToday} icon={Clock} color="#F59E0B" />
                            </div>

                            {/* Summary Charts or lists */}
                            <div className="responsive-split-grid-alt">
                                <div className="card" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Shift Assignments Today</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {['Morning Shift (06:00 AM - 02:00 PM)', 'Evening Shift (02:00 PM - 10:00 PM)', 'Night Shift (10:00 PM - 06:00 AM)', 'Full Day Shift (09:00 AM - 05:00 PM)'].map((sh, idx) => {
                                            const counts = [12, 10, 6, 12];
                                            return (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{sh}</span>
                                                    <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{counts[idx]} Staff Assigned</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="card" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Role Distribution</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {[
                                            { role: 'Security Guard', count: 12 },
                                            { role: 'Cafeteria Staff', count: 8 },
                                            { role: 'Janitor', count: 10 },
                                            { role: 'Bus Driver', count: 10 }
                                        ].map((r, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', paddingBottom: '6px', borderBottom: '1px solid var(--border-color)' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>{r.role}s</span>
                                                <strong style={{ color: 'var(--text-primary)' }}>{r.count}</strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. DIRECTORY VIEW */}
                    {activeTab === 'directory' && (
                        <DataTable 
                            title="Support Staff Roster"
                            columns={staffColumns}
                            data={mockStaff}
                            onRowClick={handleRowClick}
                            isLoading={false}
                        />
                    )}

                    {/* 3. STAFF DETAILS HUB */}
                    {activeTab === 'details' && selectedStaff && (
                        <div className="enterprise-layout">
                            {/* Inner Notion Sidebar */}
                            <div className="enterprise-sidebar">
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'profile' ? 'active' : ''}`} onClick={() => setDetailsSubTab('profile')}>
                                    <User size={16} /> Basic Profile
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'attendance' ? 'active' : ''}`} onClick={() => setDetailsSubTab('attendance')}>
                                    <Clock size={16} /> Punch Logs
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'leave' ? 'active' : ''}`} onClick={() => setDetailsSubTab('leave')}>
                                    <CalendarOff size={16} /> Leave Form & Requests
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'shift' ? 'active' : ''}`} onClick={() => setDetailsSubTab('shift')}>
                                    <Calendar size={16} /> Shift Management
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'documents' ? 'active' : ''}`} onClick={() => setDetailsSubTab('documents')}>
                                    <FileText size={16} /> Verification Documents
                                </button>
                            </div>

                            {/* Inner Content Area */}
                            <div className="enterprise-content">
                                <div className="card" style={{ padding: '24px' }}>
                                    
                                    {/* Header Banner */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '18px', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <img src={selectedStaff.avatar} alt="avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--primary-green)', objectFit: 'cover' }} />
                                            <div>
                                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedStaff.name}</h2>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: {selectedStaff.id} • Role: {selectedStaff.role} • Area: {selectedStaff.assignedArea}</span>
                                            </div>
                                        </div>
                                        <Badge type={selectedStaff.status} text={selectedStaff.status} />
                                    </div>

                                    {/* Sub-view switcher */}
                                    {detailsSubTab === 'profile' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                                                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Shift Roster</span>
                                                    <strong style={{ fontSize: '18px', color: 'var(--text-primary)', display: 'block', marginTop: '4px' }}>{selectedStaff.shift} Shift</strong>
                                                </div>
                                                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Work Area</span>
                                                    <strong style={{ fontSize: '18px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                        <MapPin size={16} /> {selectedStaff.assignedArea}
                                                    </strong>
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Hub Quick Navigation</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setDetailsSubTab('attendance')}>⏱️ Punch Logs</button>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setDetailsSubTab('leave')}>🏖️ Request Leave</button>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setDetailsSubTab('shift')}>📅 Manage Shifts</button>
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}><Phone size={14} style={{ marginRight: 6 }} /> Contact phone</h4>
                                                <span style={{ fontSize: '13px' }}>{selectedStaff.phone}</span>
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'attendance' && (
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Daily Attendance Punch Logs</h3>
                                            <div style={{ display: 'grid', gap: '10px' }}>
                                                {['July 06', 'July 05', 'July 04'].map((day) => (
                                                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                                        <span>{day}, 2026</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Check In: 07:55 AM | Out: 04:00 PM</span>
                                                            <Badge type="Present" text="On Time" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'leave' && (() => {
                                        const staffLeaves = leavesList.filter(
                                            l => l.role === 'Staff' && l.name.toLowerCase() === selectedStaff.name.toLowerCase()
                                        );
                                        return (
                                            <div>
                                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Leave Request Form</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px', marginBottom: '24px' }}>
                                                    <select 
                                                        value={applyLeaveType}
                                                        onChange={(e) => setApplyLeaveType(e.target.value)}
                                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                                    >
                                                        <option>Casual Leave</option>
                                                        <option>Sick Leave</option>
                                                    </select>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                        <input 
                                                            type="date" 
                                                            value={applyLeaveFrom}
                                                            onChange={(e) => setApplyLeaveFrom(e.target.value)}
                                                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} 
                                                        />
                                                        <input 
                                                            type="date" 
                                                            value={applyLeaveTo}
                                                            onChange={(e) => setApplyLeaveTo(e.target.value)}
                                                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} 
                                                        />
                                                    </div>
                                                    <textarea 
                                                        placeholder="Reason..." 
                                                        rows={3} 
                                                        value={applyLeaveReason}
                                                        onChange={(e) => setApplyLeaveReason(e.target.value)}
                                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                                    ></textarea>
                                                    <button 
                                                        className="btn-primary" 
                                                        onClick={() => {
                                                            if (!applyLeaveFrom || !applyLeaveTo || !applyLeaveReason) {
                                                                addToast({ type: 'error', title: 'Submission Failed', message: 'Mandatory fields: Dates and Reason.' });
                                                                return;
                                                            }
                                                            const durationNum = Math.ceil((new Date(applyLeaveTo) - new Date(applyLeaveFrom)) / (1000 * 60 * 60 * 24)) + 1;
                                                            const durationText = `${durationNum} ${durationNum > 1 ? 'Days' : 'Day'}`;
                                                            const newLeave = {
                                                                id: `LV${String(mockLeave.length + 1).padStart(3, '0')}`,
                                                                avatar: selectedStaff.avatar,
                                                                name: selectedStaff.name,
                                                                role: 'Staff',
                                                                classOrDept: selectedStaff.role,
                                                                type: applyLeaveType,
                                                                startDate: applyLeaveFrom,
                                                                duration: durationText,
                                                                reason: applyLeaveReason,
                                                                status: 'Pending'
                                                            };
                                                            mockLeave.unshift(newLeave);
                                                            setLeavesList([...mockLeave]);
                                                            
                                                            // Reset form
                                                            setApplyLeaveFrom('');
                                                            setApplyLeaveTo('');
                                                            setApplyLeaveReason('');
                                                            
                                                            addToast({ type: 'success', title: 'Submitted', message: 'Leave request has been submitted to the shift manager.' });
                                                        }}
                                                    >
                                                        Submit Request
                                                    </button>
                                                </div>

                                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Leave Requests History</h3>
                                                {staffLeaves.length === 0 ? (
                                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No leave history found for this staff member.</p>
                                                ) : (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                        {staffLeaves.map(leave => (
                                                            <div key={leave.id} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div>
                                                                    <strong style={{ fontSize: '13px', display: 'block' }}>{leave.type} • {leave.duration}</strong>
                                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Starts: {leave.startDate} • Reason: {leave.reason}</span>
                                                                </div>
                                                                <Badge type={leave.status === 'Pending' ? 'Warning' : leave.status === 'Approved' ? 'Success' : 'Absent'} text={leave.status} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {detailsSubTab === 'shift' && (
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Roster Shift Allocations</h3>
                                            <div style={{ padding: '16px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '20px' }}>
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Current Shift</span>
                                                <strong style={{ fontSize: '16px', display: 'block', color: 'var(--primary-dark)', marginTop: '4px' }}>{selectedStaff.shift} Shift</strong>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hours: {selectedStaff.shift === 'Morning' ? '06:00 AM - 02:00 PM' : selectedStaff.shift === 'Evening' ? '02:00 PM - 10:00 PM' : '09:00 AM - 05:00 PM'}</span>
                                            </div>
                                            
                                            <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Request Roster Swap</h4>
                                            <div style={{ display: 'flex', gap: '12px', maxWidth: '400px' }}>
                                                <select style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }}>
                                                    <option>Evening Shift</option>
                                                    <option>Night Shift</option>
                                                    <option>Full Day Shift</option>
                                                </select>
                                                <button className="btn-primary" onClick={() => addToast({ type: 'success', title: 'Swap Requested', message: 'Roster swap request sent.' })}>Request Shift Change</button>
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'documents' && (
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Verified Onboarding Documents</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                                                {['Aadhaar Card Copy', 'Police Clearance Certificate', 'Address Verification Report'].map((doc, idx) => (
                                                    <div key={idx} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'var(--bg-color)' }}>
                                                        <FileText size={24} color="var(--primary-dark)" />
                                                        <span style={{ fontSize: '12px', fontWeight: 500, textAlign: 'center' }}>{doc}</span>
                                                        <button className="btn-white" style={{ padding: '4px 8px', fontSize: '11px', width: '100%', marginTop: '6px' }} onClick={() => addToast({ type: 'info', title: 'File Downloaded', message: `${doc} downloaded.` })}>Download</button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer' }} onClick={() => addToast({ type: 'success', title: 'Document Uploaded', message: 'Document added to files.' })}>
                                                <FileUp size={24} color="var(--text-secondary)" style={{ margin: '0 auto 8px' }} />
                                                <span style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Upload verification document</span>
                                                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>PDF up to 10MB</span>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. ADD STAFF VIEW */}
                    {activeTab === 'add' && (
                        <div className="card" style={{ padding: '28px', maxWidth: '700px', margin: '0 auto' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Support Staff Registration Form</h3>
                            <form onSubmit={handleAddStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                                        <input type="text" name="name" placeholder="Enter name" value={formData.name} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Shift Allocation</label>
                                        <select name="shift" value={formData.shift} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                            <option>Morning</option>
                                            <option>Evening</option>
                                            <option>Night</option>
                                            <option>Full Day</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Duty Role *</label>
                                        <select name="role" value={formData.role} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                            <option>Security Guard</option>
                                            <option>Cafeteria Staff</option>
                                            <option>Janitor</option>
                                            <option>Bus Driver</option>
                                            <option>Gardener</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Assigned Work Area</label>
                                        <input type="text" name="assignedArea" placeholder="e.g. Block A Floor 1" value={formData.assignedArea} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Contact Phone *</label>
                                    <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }} required />
                                </div>

                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                                    Complete Staff Roster Entry
                                </button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </PageTransition>
    );
};

export default Staff;

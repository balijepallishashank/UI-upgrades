import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, CheckCircle, XCircle, FileText
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import DataTable from '../components/DataTable';
import Drawer from '../components/Drawer';
import Badge from '../components/Badge';
import AnimatedNumber from '../components/AnimatedNumber';
import { useToast } from '../contexts/ToastContext';
import { mockLeave, leaveAnalyticsData, mockLeaveBalance } from '../mockData';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const Leave = () => {
    const location = useLocation();
    const { addToast } = useToast();
    
    const [activeTab, setActiveTab] = useState('overview');
    
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const [requestFilter, setRequestFilter] = useState('All');
    const [applicantRoleFilter, setApplicantRoleFilter] = useState('All');
    const [selectedRequest, setSelectedRequest] = useState(null);
    
    // Apply leave form state
    const [formData, setFormData] = useState({
        applicantType: 'Student', name: '', type: 'Casual Leave', fromDate: '', toDate: '', reason: ''
    });

    useEffect(() => {
        if (location.state?.tab) {
            let targetTab = location.state.tab;
            if (targetTab === 'pending') {
                targetTab = 'requests';
                setRequestFilter('Pending');
            }
            setActiveTab(targetTab);
        }
    }, [location]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplySubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.fromDate || !formData.toDate) {
            addToast({ type: 'error', title: 'Submission Failed', message: 'Please fill in all mandatory fields.' });
            return;
        }
        addToast({ type: 'success', title: 'Leave Applied', message: `Leave request submitted successfully for ${formData.name}.` });
        setActiveTab('requests');
        setRequestFilter('Pending');
    };

    const handleApprove = (id, name) => {
        addToast({ type: 'success', title: 'Leave Approved', message: `Approved leave for ${name}` });
    };

    const handleReject = (id, name) => {
        addToast({ type: 'error', title: 'Leave Rejected', message: `Rejected leave for ${name}` });
    };

    const mainTabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'apply', label: 'Apply Leave' },
        { id: 'requests', label: 'Manage Requests' },
        { id: 'balance', label: '📊 Leave Balance' },
        { id: 'analytics', label: 'Calendar & Analytics' }
    ];

    const filteredRequests = mockLeave.filter(req => {
        const matchesStatus = requestFilter === 'All' || req.status === requestFilter;
        const matchesRole = applicantRoleFilter === 'All' || req.role === applicantRoleFilter;
        return matchesStatus && matchesRole;
    });

    const requestColumns = [
        { header: 'Applicant', accessor: 'name', render: (row) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={row.avatar} alt={row.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '13px' }}>{row.name}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{row.role} • {row.classOrDept}</span>
                </div>
            </div>
        ) },
        { header: 'Leave Type', accessor: 'type' },
        { header: 'Duration', accessor: 'duration' },
        { header: 'Start Date', accessor: 'startDate' },
        { header: 'Reason', accessor: 'reason', render: (row) => <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.reason}>{row.reason}</span> },
        { header: 'Status', accessor: 'status', render: (row) => <Badge type={row.status === 'Pending' ? 'Warning' : row.status === 'Approved' ? 'Success' : 'Absent'} text={row.status} /> },
        { header: 'Actions', accessor: 'actions', render: (row) => (
            row.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        style={{ padding: '6px', background: 'none', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--primary-dark)' }} 
                        onClick={() => handleApprove(row.id, row.name)}
                        title="Approve Request"
                    >
                        <CheckCircle size={14} />
                    </button>
                    <button 
                        style={{ padding: '6px', background: 'none', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', color: 'var(--danger)' }} 
                        onClick={() => handleReject(row.id, row.name)}
                        title="Reject Request"
                    >
                        <XCircle size={14} />
                    </button>
                </div>
            ) : <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Reviewed</span>
        ) }
    ];

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🏖️</span> Leave Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Approve or reject student and faculty leave requests, track daily out-of-office lists, and evaluate leave cycles.
                    </p>
                </div>
                {activeTab !== 'apply' && (
                    <button className="btn-primary" onClick={() => setActiveTab('apply')}>
                        Apply for Leave
                    </button>
                )}
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
                    {/* 1. OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div>
                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <KPICard title="Total Logged Requests" value={mockLeave.length} icon={FileText} color="#3B82F6" />
                                <KPICard title="Pending Approval" value={14} icon={Clock} color="#F59E0B" />
                                <KPICard title="Approved Leaves" value={35} icon={CheckCircle} color="#22C55E" />
                                <KPICard title="Rejected Requests" value={11} icon={XCircle} color="#EF4444" />
                            </div>

                            {/* Main split */}
                            <div className="responsive-split-grid">
                                {/* Left Side: Pending Actions summary */}
                                <div className="card" style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Urgent Action Required</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {mockLeave.filter(r => r.status === 'Pending').slice(0, 3).map((req, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <img src={req.avatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                                    <div>
                                                        <strong style={{ fontSize: '13px', display: 'block' }}>{req.name}</strong>
                                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{req.role} • {req.type} ({req.duration})</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button className="btn-white" style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--primary-dark)' }} onClick={() => handleApprove(req.id, req.name)}>Approve</button>
                                                    <button className="btn-white" style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)' }} onClick={() => handleReject(req.id, req.name)}>Reject</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="btn-white" style={{ width: '100%', marginTop: '16px', fontSize: '13px' }} onClick={() => { setActiveTab('requests'); setRequestFilter('Pending'); }}>
                                        Manage All Pending Requests
                                    </button>
                                </div>

                                {/* Right Side: Leave Calendar Summary */}
                                <div className="card" style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Out of Office Today</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {mockLeave.filter(r => r.status === 'Approved').slice(0, 4).map((req, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--warning)' }}></div>
                                                <strong>{req.name}</strong>
                                                <span style={{ color: 'var(--text-secondary)' }}>({req.role})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. APPLY LEAVE */}
                    {activeTab === 'apply' && (
                        <div className="card" style={{ padding: '28px', maxWidth: '600px', margin: '0 auto' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Apply For Leave</h3>
                            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Applicant Type</label>
                                        <select name="applicantType" value={formData.applicantType} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                            <option>Student</option>
                                            <option>Employee</option>
                                            <option>Staff</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Applicant Name *</label>
                                        <input type="text" name="name" placeholder="Enter name" value={formData.name} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Leave Category</label>
                                        <select name="type" value={formData.type} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                            <option>Sick Leave</option>
                                            <option>Casual Leave</option>
                                            <option>Medical Leave</option>
                                            <option>Emergency Leave</option>
                                            <option>Vacation</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                        <div>
                                            <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>From</label>
                                            <input type="date" name="fromDate" value={formData.fromDate} onChange={handleFormChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '12px' }} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>To</label>
                                            <input type="date" name="toDate" value={formData.toDate} onChange={handleFormChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '12px' }} required />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Reason *</label>
                                    <textarea name="reason" rows={3} placeholder="Please specify details..." value={formData.reason} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required></textarea>
                                </div>

                                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                                    Submit Leave Request
                                </button>
                            </form>
                        </div>
                    )}

                    {/* 3. MANAGE REQUESTS */}
                    {activeTab === 'requests' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-color)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
                                    <div style={{ display: 'flex', gap: '4px', background: 'var(--card-white)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
                                        {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                                            <button 
                                                key={status}
                                                onClick={() => setRequestFilter(status)}
                                                style={{ 
                                                    padding: '4px 10px', 
                                                    fontSize: '11px', 
                                                    border: 'none', 
                                                    borderRadius: '6px', 
                                                    background: requestFilter === status ? 'var(--primary-dark)' : 'transparent',
                                                    color: requestFilter === status ? '#ffffff' : 'var(--text-secondary)',
                                                    fontWeight: requestFilter === status ? 600 : 500,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Applicant:</span>
                                    <div style={{ display: 'flex', gap: '4px', background: 'var(--card-white)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
                                        {['All', 'Student', 'Employee', 'Staff'].map(role => (
                                            <button 
                                                key={role}
                                                onClick={() => setApplicantRoleFilter(role)}
                                                style={{ 
                                                    padding: '4px 10px', 
                                                    fontSize: '11px', 
                                                    border: 'none', 
                                                    borderRadius: '6px', 
                                                    background: applicantRoleFilter === role ? 'var(--primary-dark)' : 'transparent',
                                                    color: applicantRoleFilter === role ? '#ffffff' : 'var(--text-secondary)',
                                                    fontWeight: applicantRoleFilter === role ? 600 : 500,
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {role === 'All' ? 'All Roles' : role === 'Employee' ? 'Faculty' : role}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DataTable 
                                title={`${requestFilter} ${applicantRoleFilter === 'All' ? '' : applicantRoleFilter} Leave Applications`}
                                columns={requestColumns}
                                data={filteredRequests}
                                onRowClick={(row) => setSelectedRequest(row)}
                                isLoading={false}
                            />
                        </div>
                    )}

                    {/* 4.5. LEAVE BALANCE */}
                    {activeTab === 'balance' && (
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>📊 Employee Leave Balance Register</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Annual leave allocation vs. used vs. remaining for each staff member.</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {mockLeaveBalance.map((emp, idx) => (
                                    <motion.div key={emp.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                                        className="card" style={{ padding: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img src={emp.avatar} alt={emp.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{emp.name}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{emp.role} • {emp.department}</div>
                                                </div>
                                            </div>
                                            <button className="btn-white" style={{ fontSize: '11px', padding: '5px 12px' }} onClick={() => { setFormData(f => ({ ...f, name: emp.name })); setActiveTab('apply'); }}>
                                                Apply Leave
                                            </button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                                            {Object.entries({
                                                'Casual Leave': emp.casual,
                                                'Sick Leave': emp.sick,
                                                'Earned Leave': emp.earned,
                                                'Emergency': emp.emergency
                                            }).map(([type, bal]) => {
                                                const pct = Math.round((bal.used / bal.total) * 100);
                                                const barColor = pct > 80 ? '#EF4444' : pct > 50 ? '#F59E0B' : '#22C55E';
                                                return (
                                                    <div key={type} style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>{type}</div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{bal.remaining}</span>
                                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>/{bal.total}</span>
                                                        </div>
                                                        <div style={{ height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: idx * 0.04 }}
                                                                style={{ height: '100%', background: barColor, borderRadius: '2px' }} />
                                                        </div>
                                                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '3px' }}>{bal.used} used</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 5. CALENDAR & ANALYTICS */}
                    {activeTab === 'analytics' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Roster Calendar */}
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Monthly Leaves Roster Calendar</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', maxWidth: '600px' }}>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                        <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>{d}</div>
                                    ))}
                                    {Array.from({ length: 30 }, (_, i) => {
                                        const dateStr = `2026-07-${String(i + 1).padStart(2, '0')}`;
                                        const count = mockLeave.filter(r => r.status === 'Approved' && r.startDate === dateStr).length;
                                        const bg = count > 0 ? 'rgba(245, 158, 11, 0.15)' : 'transparent';
                                        return (
                                            <div 
                                                key={i} 
                                                style={{ 
                                                    aspectRatio: '1', 
                                                    background: bg, 
                                                    border: '1px solid var(--border-color)', 
                                                    borderRadius: '6px', 
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    cursor: 'pointer' 
                                                }}
                                                onClick={() => {
                                                    if (count > 0) {
                                                        const names = mockLeave.filter(r => r.status === 'Approved' && r.startDate === dateStr).map(r => r.name).join(', ');
                                                        addToast({ type: 'info', title: `Leaves on July ${i + 1}`, message: `Out of Office: ${names}` });
                                                    } else {
                                                        addToast({ type: 'info', title: `July ${i + 1}`, message: 'No approved leaves scheduled.' });
                                                    }
                                                }}
                                            >
                                                <span style={{ fontSize: '12px', fontWeight: 600 }}>{i + 1}</span>
                                                {count > 0 && <span style={{ fontSize: '9px', color: 'var(--warning)', fontWeight: 700 }}>{count} Out</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Recharts Area Chart */}
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Leave Applications Analytics (Last 6 Months)</h3>
                                <div style={{ height: '240px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsAreaChart data={leaveAnalyticsData}>
                                            <defs>
                                                <linearGradient id="colorL" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--primary-dark)" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="var(--primary-dark)" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--glass-shadow)' }} />
                                            <Area type="monotone" dataKey="leaves" name="Leave Requests" stroke="var(--primary-dark)" strokeWidth={3} fillOpacity={1} fill="url(#colorL)" />
                                        </RechartsAreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <Drawer 
                isOpen={!!selectedRequest} 
                onClose={() => setSelectedRequest(null)} 
                title="Leave Application Details"
            >
                {selectedRequest && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                            <img src={selectedRequest.avatar} alt="avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{selectedRequest.name}</h4>
                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedRequest.role} • {selectedRequest.classOrDept}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                            <div>
                                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>Leave Type</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedRequest.type}</span>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>Duration</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedRequest.duration}</span>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>Start Date</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedRequest.startDate}</span>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '2px' }}>Status</span>
                                <Badge type={selectedRequest.status === 'Pending' ? 'Warning' : selectedRequest.status === 'Approved' ? 'Success' : 'Absent'} text={selectedRequest.status} />
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>Reason for Leave</span>
                            <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.5' }}>{selectedRequest.reason}</p>
                        </div>

                        {selectedRequest.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                <button 
                                    className="btn-primary" 
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }} 
                                    onClick={() => {
                                        handleApprove(selectedRequest.id, selectedRequest.name);
                                        selectedRequest.status = 'Approved';
                                        setSelectedRequest(null);
                                    }}
                                >
                                    Approve Leave
                                </button>
                                <button 
                                    className="btn-white" 
                                    style={{ flex: 1, borderColor: 'var(--danger)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                                    onClick={() => {
                                        handleReject(selectedRequest.id, selectedRequest.name);
                                        selectedRequest.status = 'Rejected';
                                        setSelectedRequest(null);
                                    }}
                                >
                                    Reject Leave
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </PageTransition>
    );
};

export default Leave;

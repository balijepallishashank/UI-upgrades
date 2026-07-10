import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, UserCheck, CalendarOff, UserPlus, Edit, Trash2,
    Briefcase, Building2, FileText, Phone, Mail, Clock,
    TrendingUp, Star, FileUp, User, Download
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import AnimatedNumber from '../components/AnimatedNumber';
import { useToast } from '../contexts/ToastContext';
import { mockEmployees, departmentDistributionData, employeeGrowthData, mockPayroll, mockLeaveBalance, mockLeave } from '../mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

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

const Employees = () => {
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

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [detailsSubTab, setDetailsSubTab] = useState('profile');
    const [showPaySlip, setShowPaySlip] = useState(null); // stores payroll record
    const [leavesList, setLeavesList] = useState(mockLeave);
    
    // Apply leave form state
    const [applyLeaveType, setApplyLeaveType] = useState('Earned Leave');
    const [applyLeaveFrom, setApplyLeaveFrom] = useState('');
    const [applyLeaveTo, setApplyLeaveTo] = useState('');
    const [applyLeaveReason, setApplyLeaveReason] = useState('');
    
    // Add Employee Form State
    const [formData, setFormData] = useState({
        name: '', department: 'Computer Science', role: 'Assistant Professor', gender: 'Male', phone: '', email: '', experience: ''
    });

    // Check for deep links from FAB or Search
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            if (location.state.tab === 'details' && location.state.employeeId) {
                const emp = mockEmployees.find(e => e.id === location.state.employeeId);
                if (emp) {
                    setSelectedEmployee(emp);
                    setDetailsSubTab('profile');
                }
            }
        }
    }, [location]);

    const handleRowClick = (emp) => {
        setSelectedEmployee(emp);
        setActiveTab('details');
        setDetailsSubTab('profile');
        addToast({ type: 'info', title: 'Employee Profile Hub', message: `Opened Hub for ${emp.name}` });
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddEmployeeSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.email) {
            addToast({ type: 'error', title: 'Registration Failed', message: 'Please fill in all mandatory fields.' });
            return;
        }
        addToast({ type: 'success', title: 'Employee Recruited', message: `${formData.name} successfully onboarded as ${formData.role}!` });
        setActiveTab('directory');
        setFormData({ name: '', department: 'Computer Science', role: 'Assistant Professor', gender: 'Male', phone: '', email: '', experience: '' });
    };

    // Calculations
    const totalEmployees = mockEmployees.length;
    const presentToday = mockEmployees.filter(e => e.status === 'Present').length;
    const leaveToday = mockEmployees.filter(e => e.status === 'On Leave' || e.status === 'Leave').length;
    const lateToday = mockEmployees.filter(e => e.status === 'Late').length;

    const mainTabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'directory', label: 'Employee Directory' },
        ...(selectedEmployee ? [{ id: 'details', label: `Details: ${selectedEmployee.name}` }] : []),
        { id: 'payroll', label: '💰 Payroll' },
        { id: 'add', label: 'Add Employee' }
    ];

    const employeeColumns = [
        { header: 'Employee Name', accessor: 'name', render: (row) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={row.avatar} alt={row.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '13px' }}>{row.name}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{row.id}</span>
                </div>
            </div>
        ) },
        { header: 'Department', accessor: 'department' },
        { header: 'Designation / Role', accessor: 'role' },
        { header: 'Experience', accessor: 'experience' },
        { header: 'Performance Score', accessor: 'performanceScore', render: (row) => <span style={{ fontWeight: 600 }}>{row.performanceScore}%</span> },
        { header: 'Status', accessor: 'status', render: (row) => <Badge type={row.status === 'On Leave' ? 'Leave' : row.status} text={row.status} /> }
    ];

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>👨‍🏫</span> Employees Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage academic faculty and administrative employees, departments, and payroll configurations.
                    </p>
                </div>
                {activeTab !== 'add' && (
                    <button className="btn-primary" onClick={() => setActiveTab('add')}>
                        Onboard Employee
                    </button>
                )}
            </div>

            {/* Main Tabs */}
            <SegmentedControl tabs={mainTabs} activeTab={activeTab} onTabChange={(tabId) => {
                setActiveTab(tabId);
                if (tabId !== 'details') setSelectedEmployee(null);
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
                            {/* KPI Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <KPICard title="Total Employees" value={totalEmployees} icon={Users} color="#3B82F6" />
                                <KPICard title="Present Today" value={presentToday} icon={UserCheck} color="#22C55E" />
                                <KPICard title="On Leave" value={leaveToday} icon={CalendarOff} color="#EF4444" />
                                <KPICard title="Late Today" value={lateToday} icon={Clock} color="#F59E0B" />
                            </div>

                            {/* Dashboard Graphs and timelines */}
                            <div className="responsive-split-grid-alt" style={{ marginBottom: '32px' }}>
                                {/* Department Distribution (Pie chart) */}
                                <div className="card" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Department Distribution</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ height: '180px' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={departmentDistributionData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={45}
                                                        outerRadius={65}
                                                        paddingAngle={3}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {departmentDistributionData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {departmentDistributionData.map((dept, i) => (
                                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dept.color }} />
                                                        <span style={{ color: 'var(--text-secondary)' }}>{dept.name}</span>
                                                    </div>
                                                    <span style={{ fontWeight: 600 }}>{dept.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Employee Recruitment Trend */}
                                <div className="card" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Recruitment Trend (Last 6 Months)</h3>
                                    <div style={{ height: '180px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={employeeGrowthData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--glass-shadow)' }} />
                                                <Line type="monotone" dataKey="count" stroke="var(--primary-dark)" strokeWidth={3} dot={{ r: 4 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. DIRECTORY VIEW */}
                    {activeTab === 'directory' && (
                        <DataTable 
                            title="Employees Catalog"
                            columns={employeeColumns}
                            data={mockEmployees}
                            onRowClick={handleRowClick}
                            isLoading={false}
                        />
                    )}

                    {/* 3. EMPLOYEE DETAILS HUB */}
                    {activeTab === 'details' && selectedEmployee && (
                        <div className="enterprise-layout">
                            {/* Inner Notion-Style Sidebar */}
                            <div className="enterprise-sidebar">
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'profile' ? 'active' : ''}`} onClick={() => setDetailsSubTab('profile')}>
                                    <User size={16} /> Basic Profile
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'attendance' ? 'active' : ''}`} onClick={() => setDetailsSubTab('attendance')}>
                                    <Clock size={16} /> Check-In Logs
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'leave' ? 'active' : ''}`} onClick={() => setDetailsSubTab('leave')}>
                                    <CalendarOff size={16} /> Leave Registry
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'department' ? 'active' : ''}`} onClick={() => setDetailsSubTab('department')}>
                                    <Building2 size={16} /> Department Hub
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'performance' ? 'active' : ''}`} onClick={() => setDetailsSubTab('performance')}>
                                    <TrendingUp size={16} /> Faculty Performance
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'documents' ? 'active' : ''}`} onClick={() => setDetailsSubTab('documents')}>
                                    <FileText size={16} /> Documents Locker
                                </button>
                            </div>

                            {/* Inner Content Area */}
                            <div className="enterprise-content">
                                <div className="card" style={{ padding: '24px' }}>
                                    
                                    {/* Selected Employee Title Banner */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '18px', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <img src={selectedEmployee.avatar} alt="avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--primary-green)', objectFit: 'cover' }} />
                                            <div>
                                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedEmployee.name}</h2>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: {selectedEmployee.id} • Dept: {selectedEmployee.department} • Role: {selectedEmployee.role}</span>
                                            </div>
                                        </div>
                                        <Badge type={selectedEmployee.status === 'On Leave' ? 'Leave' : selectedEmployee.status} text={selectedEmployee.status} />
                                    </div>

                                    {/* Sub-view Switcher */}
                                    {detailsSubTab === 'profile' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Academic Experience</span>
                                                    <strong style={{ fontSize: '18px', color: 'var(--text-primary)', display: 'block', marginTop: '4px' }}>{selectedEmployee.experience}</strong>
                                                </div>
                                                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Feedback Rating</span>
                                                    <strong style={{ fontSize: '18px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                                        <Star size={16} fill="var(--primary-dark)" /> {selectedEmployee.performanceScore}%
                                                    </strong>
                                                </div>
                                                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Research Publications</span>
                                                    <strong style={{ fontSize: '18px', color: 'var(--text-primary)', display: 'block', marginTop: '4px' }}>{selectedEmployee.publications} Papers</strong>
                                                </div>
                                            </div>

                                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Hub Quick Navigation</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setDetailsSubTab('attendance')}>⏱️ Check Attendance</button>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setDetailsSubTab('leave')}>🏖️ Request Leave</button>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setDetailsSubTab('department')}>🏢 Department view</button>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => navigate('/reports', { state: { filter: selectedEmployee.name } })}>📊 View Reports</button>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}><Phone size={14} style={{ marginRight: 6 }} /> Contact Information</h4>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        <span style={{ fontSize: '12px' }}><strong>Email:</strong> {selectedEmployee.email}</span>
                                                        <span style={{ fontSize: '12px' }}><strong>Phone:</strong> {selectedEmployee.phone}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>System Info</h4>
                                                    <span style={{ fontSize: '12px' }}><strong>System Privileges:</strong> Faculty Access Level</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'attendance' && (
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Check-In Attendance History</h3>
                                            <div style={{ display: 'grid', gap: '10px' }}>
                                                {['July 06', 'July 05', 'July 04'].map((day, idx) => {
                                                    const stat = idx === 2 ? 'Late' : 'Present';
                                                    return (
                                                        <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                                            <span>{day}, 2026</span>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>In: {stat === 'Present' ? '08:50 AM' : '09:20 AM'} | Out: 04:30 PM</span>
                                                                <Badge type={stat} text={stat} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'leave' && (() => {
                                        const bal = mockLeaveBalance.find(b => b.id === selectedEmployee.id) || {
                                            casual: { total: 12, used: 3, remaining: 9 },
                                            sick: { total: 10, used: 2, remaining: 8 },
                                            earned: { total: 15, used: 4, remaining: 11 },
                                            emergency: { total: 3, used: 0, remaining: 3 }
                                        };
                                        return (
                                            <div>
                                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Remaining Leave Quota</h3>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                                                    {[
                                                        { label: 'Casual Leave', b: bal.casual },
                                                        { label: 'Sick Leave', b: bal.sick },
                                                        { label: 'Earned Leave', b: bal.earned },
                                                        { label: 'Emergency Leave', b: bal.emergency }
                                                    ].map(({ label, b }) => (
                                                        <div key={label} style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>{label}</div>
                                                            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                                {b.remaining} <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-secondary)' }}>/ {b.total}</span>
                                                            </div>
                                                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>Used: {b.used} days</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Employee Leave Application Form</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px', marginBottom: '24px' }}>
                                                    <select 
                                                        value={applyLeaveType}
                                                        onChange={(e) => setApplyLeaveType(e.target.value)}
                                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                                    >
                                                        <option>Earned Leave</option>
                                                        <option>Sick Leave</option>
                                                        <option>Casual Leave</option>
                                                        <option>Emergency Leave</option>
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
                                                        rows={3} 
                                                        placeholder="Provide leave reason..." 
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
                                                                avatar: selectedEmployee.avatar,
                                                                name: selectedEmployee.name,
                                                                role: 'Employee',
                                                                classOrDept: selectedEmployee.department,
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
                                                            
                                                            addToast({ type: 'success', title: 'Submitted', message: 'Leave request has been sent for HOD approval.' });
                                                        }}
                                                    >
                                                        Submit Leave Application
                                                    </button>
                                                </div>
 
                                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Leave Requests History</h3>
                                                {(() => {
                                                    const empLeaves = leavesList.filter(
                                                        l => l.role === 'Employee' && l.name.toLowerCase() === selectedEmployee.name.toLowerCase()
                                                    );
                                                    return empLeaves.length === 0 ? (
                                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No leave history found for this employee.</p>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                            {empLeaves.map(leave => (
                                                                <div key={leave.id} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <div>
                                                                        <strong style={{ fontSize: '13px', display: 'block' }}>{leave.type} • {leave.duration}</strong>
                                                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Starts: {leave.startDate} • Reason: {leave.reason}</span>
                                                                    </div>
                                                                    <Badge type={leave.status === 'Pending' ? 'Warning' : leave.status === 'Approved' ? 'Success' : 'Absent'} text={leave.status} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        );
                                    })()}

                                    {detailsSubTab === 'department' && (
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Department Hub: {selectedEmployee.department}</h3>
                                            <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Department Head (HOD)</span>
                                                <strong style={{ fontSize: '15px', display: 'block', color: 'var(--primary-dark)', marginTop: '4px' }}>Dr. Anita Rao</strong>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Employees in Dept: 85 members • Academic Score: 94%</span>
                                            </div>
                                            
                                            <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Vacant Open Positions</h4>
                                            <div style={{ border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <strong style={{ fontSize: '13px', display: 'block' }}>Senior Professor - AI/ML</strong>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>1 position open • Requirement: Ph.D + 10 years experience</span>
                                                </div>
                                                <Badge type="Warning" text="Recruiting" />
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'performance' && (
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Faculty Feedback & Evaluation</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                                    <span>Student Evaluation Score</span>
                                                    <strong style={{ color: 'var(--primary-dark)' }}>{selectedEmployee.performanceScore}% (Excellent)</strong>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                                    <span>Research & Publication Index</span>
                                                    <strong>Tier 1 (Scopus Indexed)</strong>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                                    <span>Annual Appraisals Review</span>
                                                    <Badge type="Success" text="Recommended" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'documents' && (
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Employment Credentials Folder</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                                                {['Employment Contract', 'Degree Certificate', 'Experience Letter', 'ID Proof'].map((doc, idx) => (
                                                    <div key={idx} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'var(--bg-color)' }}>
                                                        <FileText size={24} color="var(--primary-dark)" />
                                                        <span style={{ fontSize: '12px', fontWeight: 500, textAlign: 'center' }}>{doc}</span>
                                                        <button className="btn-white" style={{ padding: '4px 8px', fontSize: '11px', width: '100%', marginTop: '6px' }} onClick={() => addToast({ type: 'info', title: 'File Downloaded', message: `${doc} downloaded.` })}>Download</button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer' }} onClick={() => addToast({ type: 'success', title: 'Document Uploaded', message: 'Document added to files.' })}>
                                                <FileUp size={24} color="var(--text-secondary)" style={{ margin: '0 auto 8px' }} />
                                                <span style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Upload verified credentials</span>
                                                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>PDF up to 10MB</span>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. ADD EMPLOYEE VIEW */}
                    {activeTab === 'add' && (
                        <div className="responsive-split-grid" style={{ gap: '24px' }}>
                            {/* Left Column: Manual Form */}
                            <div className="card" style={{ padding: '28px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Employee Recruitment Form</h3>
                                <form onSubmit={handleAddEmployeeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                                            <input type="text" name="name" placeholder="Enter full name" value={formData.name} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Gender</label>
                                            <select name="gender" value={formData.gender} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Department *</label>
                                            <select name="department" value={formData.department} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                                <option>Computer Science</option>
                                                <option>Information Technology</option>
                                                <option>Electronics</option>
                                                <option>Mechanical</option>
                                                <option>Administration</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Designation / Role *</label>
                                            <select name="role" value={formData.role} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                                <option>Professor</option>
                                                <option>Assistant Professor</option>
                                                <option>Senior Lecturer</option>
                                                <option>Lab Assistant</option>
                                                <option>Registrar</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Contact Phone *</label>
                                            <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Work Email *</label>
                                            <input type="email" name="email" placeholder="name@institution.edu.in" value={formData.email} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Total Experience *</label>
                                            <input type="text" name="experience" placeholder="e.g. 5 Years" value={formData.experience} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required />
                                        </div>
                                    </div>

                                    <motion.button 
                                        type="submit" 
                                        className="btn-primary" 
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ width: '100%', marginTop: '8px' }}
                                    >
                                        Complete Onboarding Registration
                                    </motion.button>
                                </form>
                            </div>

                            {/* Right Column: Bulk Faculty Ingestion */}
                            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Faculty Bulk Ingestion (CSV)</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                    Onboard entire departments or hiring waves instantly by uploading a completed roster sheet.
                                </p>
                                
                                <div style={{ 
                                    border: '2px dashed var(--border-color)', 
                                    borderRadius: '12px', 
                                    padding: '36px 20px', 
                                    textAlign: 'center', 
                                    background: 'var(--bg-color)', 
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => {
                                    addToast({ type: 'success', title: 'Faculty Ingested', message: 'Successfully parsed and onboarded 18 employee records from CSV!' });
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-green)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                >
                                    <FileUp size={36} color="var(--primary-dark)" style={{ marginBottom: '12px' }} />
                                    <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>Drag & drop roster spreadsheet</strong>
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>or click to browse local files (CSV, XLSX)</span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                                    <motion.button 
                                        className="btn-white" 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                                        onClick={() => {
                                            const element = document.createElement("a");
                                            const file = new Blob(["Name,Gender,Department,Designation,Phone,Email,Experience\nDr. Amit Nair,Male,Computer Science,Professor,+91 9988776655,amit.nair@institution.edu.in,18 Years"], {type: 'text/csv'});
                                            element.href = URL.createObjectURL(file);
                                            element.download = "faculty_roster_template.csv";
                                            document.body.appendChild(element);
                                            element.click();
                                            document.body.removeChild(element);
                                            addToast({ type: 'success', title: 'Template Downloaded', message: 'faculty_roster_template.csv saved to downloads.' });
                                        }}>
                                        <Download size={14} /> Download CSV Template
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* 5. PAYROLL VIEW */}
                    {activeTab === 'payroll' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>💰 Payroll Register — June 2026</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Salary disbursement status for all employees.</p>
                                </div>
                                <button className="btn-primary" onClick={() => addToast({ type: 'success', title: 'Payroll Processed', message: 'Payroll for June 2026 dispatched to all bank accounts.' })}>
                                    🚀 Disburse All
                                </button>
                            </div>
                            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                        <thead style={{ background: 'var(--bg-color)' }}>
                                            <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
                                                {['Employee', 'Department', 'Basic', 'HRA', 'DA', 'Gross', 'PF', 'Tax', 'Net Pay', 'Status', 'Action'].map(h => (
                                                    <th key={h} style={{ padding: '12px 16px', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mockPayroll.slice(0, 20).map((pay, idx) => (
                                                <motion.tr key={pay.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                                                    style={{ borderBottom: '1px solid var(--border-color)' }}
                                                >
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <img src={pay.avatar} alt={pay.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                                            <div>
                                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>{pay.name}</div>
                                                                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{pay.employeeId}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{pay.department}</td>
                                                    <td style={{ padding: '12px 16px' }}>₹{pay.basic.toLocaleString()}</td>
                                                    <td style={{ padding: '12px 16px' }}>₹{pay.hra.toLocaleString()}</td>
                                                    <td style={{ padding: '12px 16px' }}>₹{pay.da.toLocaleString()}</td>
                                                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>₹{pay.grossPay.toLocaleString()}</td>
                                                    <td style={{ padding: '12px 16px', color: 'var(--danger)' }}>-₹{pay.pf.toLocaleString()}</td>
                                                    <td style={{ padding: '12px 16px', color: 'var(--danger)' }}>-₹{pay.tax.toLocaleString()}</td>
                                                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary-dark)' }}>₹{pay.netPay.toLocaleString()}</td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: pay.status === 'Paid' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: pay.status === 'Paid' ? '#22C55E' : '#F59E0B' }}>
                                                            {pay.status === 'Paid' ? '✔ Paid' : '⏳ Pending'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <button className="btn-white" style={{ padding: '4px 12px', fontSize: '11px' }} onClick={() => setShowPaySlip(pay)}>Slip</button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>

            {/* ── Pay Slip Modal ── */}
            <AnimatePresence>
                {showPaySlip && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPaySlip(null)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }} transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'white', borderRadius: '20px', padding: '36px', maxWidth: '560px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', position: 'relative' }}>
                            <button onClick={() => setShowPaySlip(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>✕</button>
                            <div style={{ textAlign: 'center', borderBottom: '2px solid #1F5535', paddingBottom: '16px', marginBottom: '24px' }}>
                                <div style={{ fontWeight: 700, color: '#1F5535', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>TITUS Institute of Technology</div>
                                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1D1D1D', margin: '8px 0 0' }}>Salary Pay Slip — {showPaySlip.month}</h2>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', background: '#f8fafc', borderRadius: '12px', padding: '16px' }}>
                                <img src={showPaySlip.avatar} alt={showPaySlip.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#1D1D1D' }}>{showPaySlip.name}</div>
                                    <div style={{ fontSize: '12px', color: '#587290' }}>{showPaySlip.role} • {showPaySlip.department}</div>
                                    <div style={{ fontSize: '11px', color: '#587290' }}>Bank: {showPaySlip.bankAccount} • IFSC: {showPaySlip.ifsc}</div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#22C55E', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Earnings</div>
                                    {[['Basic Pay', showPaySlip.basic], ['HRA', showPaySlip.hra], ['DA', showPaySlip.da], ['TA', showPaySlip.ta]].map(([k, v]) => (
                                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                                            <span style={{ color: '#587290' }}>{k}</span>
                                            <span style={{ fontWeight: 500 }}>₹{v.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '14px', fontWeight: 700, color: '#22C55E' }}>
                                        <span>Gross Pay</span><span>₹{showPaySlip.grossPay.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deductions</div>
                                    {[['Provident Fund', showPaySlip.pf], ['Income Tax', showPaySlip.tax]].map(([k, v]) => (
                                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                                            <span style={{ color: '#587290' }}>{k}</span>
                                            <span style={{ fontWeight: 500, color: '#EF4444' }}>-₹{v.toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '14px', fontWeight: 700, color: '#1F5535' }}>
                                        <span>Net Pay</span><span>₹{showPaySlip.netPay.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => window.print()} style={{ flex: 1, padding: '11px', background: '#1F5535', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>🖨️ Print Slip</motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowPaySlip(null)} style={{ padding: '11px 20px', background: 'none', border: '1px solid #EAEAEA', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Close</motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Employees;

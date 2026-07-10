import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    GraduationCap, Users, TrendingUp, BookOpen, UserCheck, CalendarOff, AlertTriangle, 
    FileText, User, ShieldAlert, CreditCard, Clock, Activity, MapPin, Phone, Mail, Award,
    Check, X, FileUp, Download
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import AnimatedNumber from '../components/AnimatedNumber';
import { useToast } from '../contexts/ToastContext';
import { mockStudents, mockLeave } from '../mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const Students = () => {
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

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [detailsSubTab, setDetailsSubTab] = useState('profile');
    const [selectedClassFilter, setSelectedClassFilter] = useState('All');
    const [leavesList, setLeavesList] = useState(mockLeave);
    
    // Apply leave form state
    const [applyLeaveType, setApplyLeaveType] = useState('Sick Leave');
    const [applyLeaveFrom, setApplyLeaveFrom] = useState('');
    const [applyLeaveTo, setApplyLeaveTo] = useState('');
    const [applyLeaveReason, setApplyLeaveReason] = useState('');

    // ID Card & TC Modal State
    const [showIdCard, setShowIdCard] = useState(false);
    const [showTc, setShowTc] = useState(false);

    const filteredStudents = selectedClassFilter === 'All'
        ? mockStudents
        : mockStudents.filter(s => s.class === selectedClassFilter);
    
    // Add Student Form State
    const [formData, setFormData] = useState({
        name: '', class: 'CS-A', roll: '', gender: 'Male', parentName: '', parentPhone: '', parentEmail: '', address: ''
    });

    // Check for deep links from FAB or Global Search
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            if (location.state.tab === 'details' && location.state.studentId) {
                const stu = mockStudents.find(s => s.id === location.state.studentId);
                if (stu) {
                    setSelectedStudent(stu);
                    setDetailsSubTab('profile');
                }
            }
        }
    }, [location]);

    const handleRowClick = (student) => {
        setSelectedStudent(student);
        setActiveTab('details');
        setDetailsSubTab('profile');
        addToast({ type: 'info', title: 'Student Selected', message: `Opened Hub for ${student.name}` });
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddStudentSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.roll) {
            addToast({ type: 'error', title: 'Registration Failed', message: 'Please fill in all mandatory fields.' });
            return;
        }
        addToast({ type: 'success', title: 'Student Enrolled', message: `${formData.name} has been enrolled in ${formData.class} successfully!` });
        setActiveTab('directory');
        setFormData({ name: '', class: 'CS-A', roll: '', gender: 'Male', parentName: '', parentPhone: '', parentEmail: '', address: '' });
    };

    // Calculate Dashboard Overview stats
    const totalStudents = mockStudents.length;
    const presentToday = mockStudents.filter(s => s.status === 'Present').length;
    const lateToday = mockStudents.filter(s => s.status === 'Late').length;
    const leaveToday = mockStudents.filter(s => s.status === 'Leave').length;
    const avgAttendance = 88; // Institution average

    const mainTabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'directory', label: 'Student Directory' },
        ...(selectedStudent ? [{ id: 'details', label: `Details: ${selectedStudent.name}` }] : []),
        { id: 'add', label: 'Add Student' }
    ];

    const studentColumns = [
        { header: 'Student Profile', accessor: 'name', render: (row) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={row.avatar} alt={row.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '13px' }}>{row.name}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{row.id}</span>
                </div>
            </div>
        ) },
        { header: 'Class', accessor: 'class' },
        { header: 'Roll No', accessor: 'roll' },
        { header: 'Attendance Rate', accessor: 'attendance', render: (row) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: row.attendance < 75 ? 'var(--danger)' : 'var(--text-primary)' }}>{row.attendance}%</span>
                <div style={{ width: '50px', height: '4px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${row.attendance}%`, background: row.attendance < 75 ? 'var(--danger)' : 'var(--success)' }}></div>
                </div>
            </div>
        ) },
        { header: 'GPA', accessor: 'gpa', render: (row) => <span style={{ fontWeight: 600 }}>{row.gpa}</span> },
        { header: 'Today\'s Status', accessor: 'status', render: (row) => <Badge type={row.status === 'Late' ? 'Warning' : row.status === 'Leave' ? 'Leave' : row.status} text={row.status} /> }
    ];

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🎓</span> Students Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage student profiles, parent configurations, and perform cross-module lookups.
                    </p>
                </div>
                {activeTab !== 'add' && (
                    <button className="btn-primary" onClick={() => setActiveTab('add')}>
                        Add Student
                    </button>
                )}
            </div>

            {/* Segmented Main Navigation */}
            <SegmentedControl tabs={mainTabs} activeTab={activeTab} onTabChange={(tabId) => {
                setActiveTab(tabId);
                if (tabId !== 'details') setSelectedStudent(null);
            }} />

            {/* Tab Contents */}
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
                            {/* KPI Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <KPICard title="Total Students" value={totalStudents} icon={Users} color="#3B82F6" />
                                <KPICard title="Present Today" value={presentToday} icon={UserCheck} color="#22C55E" />
                                <KPICard title="Late Arrivals" value={lateToday} icon={Clock} color="#F59E0B" />
                                <KPICard title="On Leave" value={leaveToday} icon={CalendarOff} color="#8B5CF6" />
                            </div>

                            {/* Main split */}
                            <div className="responsive-split-grid">
                                {/* Left Side: Recent Admissions */}
                                <div className="card" style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Recent Admissions</h3>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                                    <th style={{ padding: '10px' }}>Student</th>
                                                    <th style={{ padding: '10px' }}>Class</th>
                                                    <th style={{ padding: '10px' }}>GPA</th>
                                                    <th style={{ padding: '10px' }}>Parent</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {mockStudents.slice(0, 5).map((stu, i) => (
                                                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => handleRowClick(stu)}>
                                                        <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <img src={stu.avatar} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                                                            <strong>{stu.name}</strong>
                                                        </td>
                                                        <td style={{ padding: '10px' }}>{stu.class}</td>
                                                        <td style={{ padding: '10px', fontWeight: 600 }}>{stu.gpa}</td>
                                                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{stu.parentName}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button className="btn-white" style={{ width: '100%', marginTop: '16px', fontSize: '13px' }} onClick={() => setActiveTab('directory')}>
                                        View Full Directory
                                    </button>
                                </div>

                                {/* Right Side: Actions & Performance */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className="card" style={{ padding: '20px' }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '14px' }}>Quick Student Actions</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <button className="btn-white" style={{ justifyContent: 'flex-start', padding: '10px 14px' }} onClick={() => setActiveTab('add')}>
                                                ➕ Enroll New Student
                                            </button>
                                            <button className="btn-white" style={{ justifyContent: 'flex-start', padding: '10px 14px' }} onClick={() => navigate('/leave', { state: { tab: 'apply' } })}>
                                                🏖️ Apply Student Leave
                                            </button>
                                            <button className="btn-white" style={{ justifyContent: 'flex-start', padding: '10px 14px' }} onClick={() => navigate('/attendance', { state: { tab: 'mark' } })}>
                                                ⏱️ Mark Daily Attendance
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card" style={{ padding: '20px' }}>
                                        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>Recent Student Activity</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                                            <div style={{ borderLeft: '2px solid var(--primary-green)', paddingLeft: '8px', fontSize: '12px' }}>
                                                <span style={{ fontWeight: 600, display: 'block' }}>Aarav Sharma checked in</span>
                                                <span style={{ color: 'var(--text-secondary)' }}>Today, 08:45 AM • CS-A</span>
                                            </div>
                                            <div style={{ borderLeft: '2px solid var(--warning)', paddingLeft: '8px', fontSize: '12px' }}>
                                                <span style={{ fontWeight: 600, display: 'block' }}>Priya Verma applied for Sick Leave</span>
                                                <span style={{ color: 'var(--text-secondary)' }}>Today, 09:08 AM • CS-B</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. DIRECTORY VIEW */}
                    {activeTab === 'directory' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: 'var(--bg-color)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter by Class:</span>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {['All', 'CS-A', 'CS-B', 'IT-A', 'IT-B', 'ECE-A', 'MECH-A'].map((cls) => (
                                        <button
                                            key={cls}
                                            onClick={() => setSelectedClassFilter(cls)}
                                            style={{
                                                padding: '6px 12px',
                                                fontSize: '12px',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '6px',
                                                background: selectedClassFilter === cls ? 'var(--primary-dark)' : 'var(--card-white)',
                                                color: selectedClassFilter === cls ? '#ffffff' : 'var(--text-primary)',
                                                fontWeight: selectedClassFilter === cls ? 600 : 500,
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <DataTable 
                                title={`${selectedClassFilter === 'All' ? 'All Classes' : `Class ${selectedClassFilter}`} Enrollment Directory`}
                                columns={studentColumns}
                                data={filteredStudents}
                                onRowClick={handleRowClick}
                                isLoading={false}
                            />
                        </div>
                    )}

                    {/* 3. STUDENT PROFILE HUB (SPLIT NOTION-STYLE LAYOUT) */}
                    {activeTab === 'details' && selectedStudent && (
                        <div className="enterprise-layout">
                            {/* Inner Notion Sidebar */}
                            <div className="enterprise-sidebar">
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'profile' ? 'active' : ''}`} onClick={() => setDetailsSubTab('profile')}>
                                    <User size={16} /> Basic Profile
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'attendance' ? 'active' : ''}`} onClick={() => setDetailsSubTab('attendance')}>
                                    <Clock size={16} /> Attendance Logs
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'leave' ? 'active' : ''}`} onClick={() => setDetailsSubTab('leave')}>
                                    <CalendarOff size={16} /> Leaves & Approvals
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'documents' ? 'active' : ''}`} onClick={() => setDetailsSubTab('documents')}>
                                    <FileText size={16} /> Documents Folder
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'performance' ? 'active' : ''}`} onClick={() => setDetailsSubTab('performance')}>
                                    <TrendingUp size={16} /> Academic Performance
                                </button>
                                <button className={`enterprise-sidebar-btn ${detailsSubTab === 'parent' ? 'active' : ''}`} onClick={() => setDetailsSubTab('parent')}>
                                    <Users size={16} /> Parent & Address
                                </button>
                                <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <button className="btn-white" style={{ fontSize: '12px', padding: '8px 10px', justifyContent: 'flex-start', gap: '6px', display: 'flex', alignItems: 'center' }} onClick={() => setShowIdCard(true)}>
                                        🪪 ID Card
                                    </button>
                                    <button className="btn-white" style={{ fontSize: '12px', padding: '8px 10px', justifyContent: 'flex-start', gap: '6px', display: 'flex', alignItems: 'center' }} onClick={() => setShowTc(true)}>
                                        📄 Transfer Certificate
                                    </button>
                                </div>
                            </div>

                            {/* Inner Content Area */}
                            <div className="enterprise-content">
                                <div className="card" style={{ padding: '24px' }}>
                                    
                                    {/* Selected Student Banner */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '18px', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <img src={selectedStudent.avatar} alt="avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--primary-green)', objectFit: 'cover' }} />
                                            <div>
                                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedStudent.name}</h2>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: {selectedStudent.id} • Class: {selectedStudent.class} • Roll No: {selectedStudent.roll}</span>
                                            </div>
                                        </div>
                                        <Badge type={selectedStudent.status === 'Late' ? 'Warning' : selectedStudent.status === 'Leave' ? 'Leave' : selectedStudent.status} text={selectedStudent.status} />
                                    </div>

                                    {/* Notion Inner Sub-views */}
                                    {detailsSubTab === 'profile' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                                                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Academic GPA</span>
                                                    <strong style={{ fontSize: '20px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                                        <Award size={18} /> {selectedStudent.gpa} / 10.0
                                                    </strong>
                                                </div>
                                                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Class Rank</span>
                                                    <strong style={{ fontSize: '20px', color: 'var(--text-primary)', display: 'block', marginTop: '4px' }}>
                                                        Rank #{selectedStudent.rank}
                                                    </strong>
                                                </div>
                                                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Attendance Rate</span>
                                                    <strong style={{ fontSize: '20px', color: selectedStudent.attendance < 75 ? 'var(--danger)' : 'var(--primary-green)', display: 'block', marginTop: '4px' }}>
                                                        {selectedStudent.attendance}%
                                                    </strong>
                                                </div>
                                            </div>

                                            {/* Quick Actions Shortcuts in Hub */}
                                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>Hub Quick Navigation</h4>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setDetailsSubTab('attendance')}>
                                                        ⏱️ View Attendance
                                                    </button>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setDetailsSubTab('leave')}>
                                                        🏖️ Apply Leave
                                                    </button>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => navigate('/finance', { state: { tab: 'duelist', search: selectedStudent.name } })}>
                                                        💸 View Fee Details
                                                    </button>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setDetailsSubTab('documents')}>
                                                        📂 Open Documents
                                                    </button>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setShowIdCard(true)}>
                                                        🪪 Print ID Card
                                                    </button>
                                                    <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => setShowTc(true)}>
                                                        📄 Generate TC
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Academic & Attendance Milestones */}
                                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>Activity Timeline</h4>
                                                <div className="timeline-container">
                                                    <div className="timeline-line"></div>
                                                    <div className="timeline-item">
                                                        <div className="timeline-dot"></div>
                                                        <div style={{ marginLeft: '12px' }}>
                                                            <strong style={{ fontSize: '12px', display: 'block' }}>Semester Mid-Term Exams</strong>
                                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>July 04, 2026 • Scored GPA {selectedStudent.gpa}</span>
                                                        </div>
                                                    </div>
                                                    <div className="timeline-item">
                                                        <div className="timeline-dot" style={{ background: 'var(--success)' }}></div>
                                                        <div style={{ marginLeft: '12px' }}>
                                                            <strong style={{ fontSize: '12px', display: 'block' }}>Full Week Attendance Milestone</strong>
                                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>June 30, 2026 • Completed 100% presence week</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'attendance' && (
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Detailed Attendance Log</h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                                                Attendance rate is currently <strong>{selectedStudent.attendance}%</strong>. Below is a simulation of past week logs.
                                            </p>
                                            <div style={{ display: 'grid', gap: '10px' }}>
                                                {['July 06', 'July 05', 'July 04', 'July 03', 'July 02'].map((day, idx) => {
                                                    const stat = idx === 3 ? 'Absent' : idx === 4 ? 'Late' : 'Present';
                                                    return (
                                                        <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <Clock size={16} color="var(--text-secondary)" />
                                                                <span style={{ fontWeight: 500 }}>{day}, 2026</span>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{stat === 'Present' ? 'In: 08:45 AM' : stat === 'Late' ? 'In: 09:15 AM' : '--'}</span>
                                                                <Badge type={stat} text={stat} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'leave' && (() => {
                                         const studentLeaves = leavesList.filter(
                                             l => l.role === 'Student' && l.name.toLowerCase() === selectedStudent.name.toLowerCase()
                                         );
                                         
                                         const handleStudentLeaveSubmit = () => {
                                             if (!applyLeaveFrom || !applyLeaveTo || !applyLeaveReason) {
                                                 addToast({ type: 'error', title: 'Submission Failed', message: 'Mandatory fields: Dates and Reason.' });
                                                 return;
                                             }
                                             const durationNum = Math.ceil((new Date(applyLeaveTo) - new Date(applyLeaveFrom)) / (1000 * 60 * 60 * 24)) + 1;
                                             const durationText = `${durationNum} ${durationNum > 1 ? 'Days' : 'Day'}`;
                                             const newLeave = {
                                                 id: `LV${String(mockLeave.length + 1).padStart(3, '0')}`,
                                                 avatar: selectedStudent.avatar,
                                                 name: selectedStudent.name,
                                                 role: 'Student',
                                                 classOrDept: selectedStudent.class,
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
                                             
                                             addToast({ type: 'success', title: 'Leave Applied', message: 'Leave request has been submitted to the Registrar.' });
                                         };

                                         return (
                                             <div>
                                                 <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Apply for Student Leave</h3>
                                                 <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '500px', marginBottom: '24px' }}>
                                                     <div>
                                                         <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Leave Type</label>
                                                         <select 
                                                             value={applyLeaveType}
                                                             onChange={(e) => setApplyLeaveType(e.target.value)}
                                                             style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                                         >
                                                             <option>Sick Leave</option>
                                                             <option>Casual Leave</option>
                                                             <option>Emergency Leave</option>
                                                         </select>
                                                     </div>
                                                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                         <div>
                                                             <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>From Date</label>
                                                             <input 
                                                                 type="date" 
                                                                 value={applyLeaveFrom}
                                                                 onChange={(e) => setApplyLeaveFrom(e.target.value)}
                                                                 style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} 
                                                             />
                                                         </div>
                                                         <div>
                                                             <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>To Date</label>
                                                             <input 
                                                                 type="date" 
                                                                 value={applyLeaveTo}
                                                                 onChange={(e) => setApplyLeaveTo(e.target.value)}
                                                                 style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} 
                                                             />
                                                         </div>
                                                     </div>
                                                     <div>
                                                         <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Reason</label>
                                                         <textarea 
                                                             rows={3} 
                                                             placeholder="Describe reason..." 
                                                             value={applyLeaveReason}
                                                             onChange={(e) => setApplyLeaveReason(e.target.value)}
                                                             style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                                         ></textarea>
                                                     </div>
                                                     <button className="btn-primary" onClick={handleStudentLeaveSubmit}>Submit Leave Application</button>
                                                 </div>
      
                                                 <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Leave History</h3>
                                                 {studentLeaves.length === 0 ? (
                                                     <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No leave history found for this student.</p>
                                                 ) : (
                                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                         {studentLeaves.map((leave) => (
                                                             <div key={leave.id} style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

                                    {detailsSubTab === 'documents' && (
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Student Documents Folder</h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                                {['Birth Certificate', 'Transfer Certificate', 'Previous Marksheet', 'Medical Certificate'].map((doc, idx) => (
                                                    <div key={idx} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'var(--bg-color)' }}>
                                                        <FileText size={24} color="var(--primary-dark)" />
                                                        <span style={{ fontSize: '12px', fontWeight: 500, textAlign: 'center' }}>{doc}</span>
                                                        <button className="btn-white" style={{ padding: '4px 8px', fontSize: '11px', width: '100%', marginTop: '6px' }} onClick={() => addToast({ type: 'info', title: 'File Downloaded', message: `${doc} downloaded.` })}>Download</button>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* File Upload Trigger */}
                                            <div style={{ border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer' }} onClick={() => addToast({ type: 'success', title: 'Document Uploaded', message: 'Document added to files.' })}>
                                                <FileUp size={24} color="var(--text-secondary)" style={{ margin: '0 auto 8px' }} />
                                                <span style={{ fontSize: '12px', display: 'block', fontWeight: 500 }}>Click to upload new document</span>
                                                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>PDF, PNG, JPG up to 10MB</span>
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'performance' && (
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Academic Performance Trend</h3>
                                            <div style={{ height: '240px', marginBottom: '20px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={[
                                                        { exam: 'Unit Test 1', gpa: parseFloat(selectedStudent.gpa) - 0.6 },
                                                        { exam: 'Quarterly', gpa: parseFloat(selectedStudent.gpa) - 0.2 },
                                                        { exam: 'Half-Yearly', gpa: parseFloat(selectedStudent.gpa) - 0.3 },
                                                        { exam: 'Model Exams', gpa: parseFloat(selectedStudent.gpa) }
                                                    ]}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                                        <XAxis dataKey="exam" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} domain={[0, 10]} />
                                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--glass-shadow)' }} />
                                                        <Line type="monotone" dataKey="gpa" stroke="var(--primary-dark)" strokeWidth={3} dot={{ r: 5, fill: 'var(--primary-dark)' }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    )}

                                    {detailsSubTab === 'parent' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                            <div>
                                                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={16} /> Parent / Guardian Information</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <div>
                                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Father / Guardian Name</span>
                                                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{selectedStudent.parentName}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>Mother Name</span>
                                                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{selectedStudent.motherName}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}><Phone size={12} style={{ marginRight: 4 }} /> Contact Phone</span>
                                                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{selectedStudent.parentPhone}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}><Mail size={12} style={{ marginRight: 4 }} /> Guardian Email</span>
                                                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{selectedStudent.parentEmail}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> Residential Address</h4>
                                                <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                                                    {selectedStudent.address}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. ADD STUDENT VIEW */}
                    {activeTab === 'add' && (
                        <div className="responsive-split-grid" style={{ gap: '24px' }}>
                            {/* Left Column: Manual Form */}
                            <div className="card" style={{ padding: '28px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>Student Admission Form</h3>
                                <form onSubmit={handleAddStudentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                                            <input type="text" name="name" placeholder="Enter student name" value={formData.name} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required />
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
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Class / Section *</label>
                                            <select name="class" value={formData.class} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                                <option>CS-A</option>
                                                <option>CS-B</option>
                                                <option>IT-A</option>
                                                <option>IT-B</option>
                                                <option>ECE-A</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Roll Number *</label>
                                            <input type="number" name="roll" placeholder="Roll No" value={formData.roll} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required />
                                        </div>
                                    </div>
                                    
                                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                        <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--primary-dark)' }}>Guardian Information</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                                            <div>
                                                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Father / Guardian Name</label>
                                                <input type="text" name="parentName" placeholder="Guardian Full Name" value={formData.parentName} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                            </div>
                                            <div>
                                                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Guardian Contact *</label>
                                                <input type="tel" name="parentPhone" placeholder="+91 XXXXX XXXXX" value={formData.parentPhone} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Residential Address</label>
                                            <textarea name="address" rows={2} placeholder="Full address details" value={formData.address} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}></textarea>
                                        </div>
                                    </div>

                                    <motion.button 
                                        type="submit" 
                                        className="btn-primary" 
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{ width: '100%', marginTop: '8px' }}
                                    >
                                        Complete Admission Registration
                                    </motion.button>
                                </form>
                            </div>

                            {/* Right Column: Bulk Ingestion */}
                            <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Roster Bulk Ingestion (CSV)</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                    Admit entire classroom cohorts or batches instantly by dragging and dropping a completed institution roster document.
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
                                    addToast({ type: 'success', title: 'Roster Uploaded', message: 'Successfully parsed and registered 42 student records from CSV!' });
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
                                            const file = new Blob(["Name,Gender,Class,RollNumber,GuardianName,GuardianPhone,Address\nRahul Sharma,Male,CS-A,55,Sanjay Sharma,+91 9876543210,123 Block A Noida"], {type: 'text/csv'});
                                            element.href = URL.createObjectURL(file);
                                            element.download = "student_roster_template.csv";
                                            document.body.appendChild(element);
                                            element.click();
                                            document.body.removeChild(element);
                                            addToast({ type: 'success', title: 'Template Downloaded', message: 'student_roster_template.csv saved to downloads.' });
                                        }}>
                                        <Download size={14} /> Download CSV Template
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* ── ID Card Modal ── */}
            <AnimatePresence>
                {showIdCard && selectedStudent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowIdCard(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }} transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '480px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', position: 'relative' }}>
                            <button onClick={() => setShowIdCard(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>✕</button>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1D1D1D', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>🪪 Student ID Card</h3>
                            {/* ID Card Design */}
                            <div id="id-card-print" style={{ background: 'linear-gradient(135deg, #1F5535 0%, #2d7a4f 60%, #A3D95C 100%)', borderRadius: '16px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden', marginBottom: '20px' }}>
                                <div style={{ position: 'absolute', top: -20, right: -20, width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                                <div style={{ position: 'absolute', bottom: -30, left: -10, width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
                                    <div>
                                        <div style={{ fontSize: '11px', opacity: 0.75, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>TITUS Institute of Technology</div>
                                        <div style={{ fontSize: '10px', opacity: 0.6 }}>2026-27 Academic Year</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>STUDENT</div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                                    <img src={selectedStudent.avatar} alt={selectedStudent.name} style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.5)', objectFit: 'cover' }} />
                                    <div>
                                        <div style={{ fontSize: '18px', fontWeight: 700 }}>{selectedStudent.name}</div>
                                        <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>Class: {selectedStudent.class} • Roll: {selectedStudent.roll}</div>
                                        <div style={{ fontSize: '11px', opacity: 0.65, marginTop: '2px' }}>ID: {selectedStudent.id}</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2, fontSize: '11px', opacity: 0.75 }}>
                                    <span>GPA: {selectedStudent.gpa}</span>
                                    <span>Valid: 2026-27</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => window.print()} style={{ flex: 1, padding: '11px', background: '#1F5535', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>🖨️ Print ID Card</motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowIdCard(false)} style={{ padding: '11px 20px', background: 'none', border: '1px solid #EAEAEA', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Close</motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Transfer Certificate Modal ── */}
            <AnimatePresence>
                {showTc && selectedStudent && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTc(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
                        <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }} transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'white', borderRadius: '20px', padding: '36px', maxWidth: '600px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', position: 'relative' }}>
                            <button onClick={() => setShowTc(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>✕</button>
                            <div style={{ textAlign: 'center', borderBottom: '2px solid #1F5535', paddingBottom: '16px', marginBottom: '24px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: '#1F5535', textTransform: 'uppercase' }}>TITUS Institute of Technology</div>
                                <div style={{ fontSize: '11px', color: '#587290', marginTop: '2px' }}>Accredited by NAAC Grade A+ • ISO 9001:2015</div>
                                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1D1D1D', margin: '12px 0 0' }}>Transfer Certificate</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                {[['TC Number', `TC-2026-${selectedStudent.id.slice(-3)}`], ['Date of Issue', new Date().toLocaleDateString('en-IN')], ['Student Name', selectedStudent.name], ['Date of Birth', '01-01-2004'], ['Class / Section', selectedStudent.class], ['Roll Number', selectedStudent.roll], ['Date of Admission', '01-07-2022'], ['Date of Leaving', '30-06-2026']].map(([label, val]) => (
                                    <div key={label}>
                                        <div style={{ fontSize: '10px', color: '#587290', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{label}</div>
                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1D1D1D' }}>{val}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: '#f8fafc', border: '1px solid #EAEAEA', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
                                <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#3d3d3d' }}>This is to certify that <strong>{selectedStudent.name}</strong>, bearing Roll No. <strong>{selectedStudent.roll}</strong>, was a bonafide student of this institution. The student's <strong>conduct and character were Good</strong> during the period of study. This certificate is issued upon request of the parent/guardian.</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', paddingTop: '8px' }}>
                                <div style={{ borderTop: '1px solid #1D1D1D', paddingTop: '8px', fontSize: '12px', color: '#587290' }}>Class Teacher Signature</div>
                                <div style={{ borderTop: '1px solid #1D1D1D', paddingTop: '8px', fontSize: '12px', color: '#587290', textAlign: 'right' }}>Principal Signature</div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => window.print()} style={{ flex: 1, padding: '11px', background: '#1F5535', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>🖨️ Print TC</motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowTc(false)} style={{ padding: '11px 20px', background: 'none', border: '1px solid #EAEAEA', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Close</motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Students;

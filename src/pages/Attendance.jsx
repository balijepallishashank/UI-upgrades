import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CalendarCheck, Users, Clock,
    Download, UserX, GraduationCap, CalendarOff,
    Palmtree, UserCircle, ChevronRight
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import DataTable from '../components/DataTable';
import Drawer from '../components/Drawer';
import Badge from '../components/Badge';
import AnimatedNumber from '../components/AnimatedNumber';
import { useToast } from '../contexts/ToastContext';
import { mockAttendance, weeklyAttendanceData, mockStudents, mockEmployees } from '../mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const KPICard = ({ title, value, icon: Icon, color, subtext }) => (
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
            {subtext && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtext}</p>}
        </div>
    </motion.div>
);

const reportTemplates = [
    {
        id: 'student_daily_classwise',
        title: 'Student Report',
        subtitle: 'Daily Classwise',
        desc: 'Class attendance log for a specific date, including check-in check-out punch timings.',
        icon: GraduationCap,
        color: '#3B82F6',
        type: 'Student',
        configFields: ['class', 'date', 'format']
    },
    {
        id: 'student_monthly_classwise',
        title: 'Student Report',
        subtitle: 'Monthly Classwise',
        desc: 'Cumulative monthly percentage and total days present/absent per class.',
        icon: GraduationCap,
        color: '#10B981',
        type: 'Student',
        configFields: ['class', 'month', 'format']
    },
    {
        id: 'student_att_day_time',
        title: 'Student Att Report',
        subtitle: 'Day with Time',
        desc: 'Detailed chronological checkout check-in times for all students.',
        icon: Palmtree,
        color: '#F59E0B',
        type: 'Student',
        configFields: ['class', 'date', 'format']
    },
    {
        id: 'student_daywise',
        title: 'Student Daywise',
        subtitle: 'Attendance Report',
        desc: 'Day-by-day attendance status grid for a class over a date range.',
        icon: CalendarOff,
        color: '#EC4899',
        type: 'Student',
        configFields: ['class', 'month', 'format']
    },
    {
        id: 'employee_daily_categorywise',
        title: 'Employee Report',
        subtitle: 'Daily Categorywise',
        desc: 'Daily check-in summary sorted by employee departments & categories.',
        icon: CalendarOff,
        color: '#8B5CF6',
        type: 'Employee',
        configFields: ['category', 'date', 'format']
    },
    {
        id: 'employee_monthly',
        title: 'Employee Report',
        subtitle: 'Employeewise Monthly',
        desc: 'Detailed calendar grid of monthly attendance for staff members.',
        icon: UserCircle,
        color: '#EF4444',
        type: 'Employee',
        configFields: ['dept', 'month', 'format']
    },
    {
        id: 'employee_att_day_time',
        title: 'Employee Att Report',
        subtitle: 'Day with Time',
        desc: 'Punch details including late arrivals and total active hours.',
        icon: UserCircle,
        color: '#14B8A6',
        type: 'Employee',
        configFields: ['dept', 'date', 'format']
    },
    {
        id: 'employee_daywise',
        title: 'Employee Daywise',
        subtitle: 'Attendance Report',
        desc: 'Comprehensive employee daily status tracking report.',
        icon: UserCircle,
        color: '#6B7280',
        type: 'Employee',
        configFields: ['dept', 'month', 'format']
    }
];

const Attendance = () => {
    const location = useLocation();
    const { addToast } = useToast();
    
    const [activeTab, setActiveTab] = useState('overview');
    
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const [selectedTarget, setSelectedTarget] = useState('Students');
    const [selectedClass, setSelectedClass] = useState('CS-A');
    const [selectedDept, setSelectedDept] = useState('Computer Science');
    const [statusFilter, setStatusFilter] = useState('All');
    
    // States for Attendance Reports Management
    const [selectedReport, setSelectedReport] = useState(null);
    const [reportConfig, setReportConfig] = useState({
        class: 'CS-A',
        dept: 'Computer Science',
        category: 'All Faculty',
        month: 'July 2026',
        date: '2026-07-06',
        format: 'xlsx'
    });
    
    // Roster grid for marking attendance
    const [markingList, setMarkingList] = useState([]);

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
        if (location.state?.filterStatus) {
            setActiveTab('records');
            setStatusFilter(location.state.filterStatus);
        }
    }, [location]);

    // Generate marking list on load or selection change
    useEffect(() => {
        let list = [];
        if (selectedTarget === 'Students') {
            list = mockStudents.filter(s => s.class === selectedClass).map(s => ({
                id: s.id, name: s.name, avatar: s.avatar, classOrDept: s.class, status: 'Present'
            }));
        } else {
            list = mockEmployees.filter(e => e.department === selectedDept).map(e => ({
                id: e.id, name: e.name, avatar: e.avatar, classOrDept: e.department, status: 'Present'
            }));
        }
        setMarkingList(list);
    }, [selectedTarget, selectedClass, selectedDept]);

    const handleMarkStatus = (id, status) => {
        setMarkingList(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    };

    const markAll = (status) => {
        setMarkingList(prev => prev.map(item => ({ ...item, status })));
        addToast({ type: 'info', title: 'Bulk Marking', message: `Marked all as ${status}.` });
    };

    const saveAttendance = () => {
        const todayStr = '2026-07-06';
        const newRecords = markingList.map(item => ({
            id: `ATT${String(mockAttendance.length + 1).padStart(3, '0')}`,
            name: item.name,
            avatar: item.avatar,
            role: selectedTarget === 'Students' ? 'Student' : 'Employee',
            classOrDept: item.classOrDept,
            timeIn: item.status === 'Present' ? '08:45 AM' : item.status === 'Late' ? '09:15 AM' : '--',
            timeOut: item.status === 'Absent' ? '--' : '04:30 PM',
            date: todayStr,
            status: item.status
        }));
        mockAttendance.unshift(...newRecords);
        addToast({ type: 'success', title: 'Register Saved', message: `Successfully recorded attendance for ${markingList.length} records.` });
        setActiveTab('records');
    };

    const mainTabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'mark', label: 'Mark Attendance' },
        { id: 'records', label: 'Records & Analytics' },
        { id: 'reports', label: 'Report Builder' }
    ];

    const recordsColumns = [
        { header: 'Name', accessor: 'name', render: (row) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={row.avatar} alt={row.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '13px' }}>{row.name}</strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{row.role}</span>
                </div>
            </div>
        ) },
        { header: 'Class / Dept', accessor: 'classOrDept' },
        { header: 'Check In', accessor: 'timeIn' },
        { header: 'Check Out', accessor: 'timeOut' },
        { header: 'Date', accessor: 'date' },
        { header: 'Status', accessor: 'status', render: (row) => <Badge type={row.status === 'Late' ? 'Warning' : row.status === 'Leave' ? 'Leave' : row.status} text={row.status} /> }
    ];

    return (
        <PageTransition>
            {/* Title */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>⏱️</span> Attendance Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Oversee institutional check-ins, record daily registers, and download sheets.
                    </p>
                </div>
                {activeTab !== 'mark' && (
                    <button className="btn-primary" onClick={() => setActiveTab('mark')}>
                        Mark Register
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
                            {/* Biometric Integration Sync Indicators */}
                            <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <motion.div 
                                        animate={{ opacity: [0.4, 1, 0.4] }} 
                                        transition={{ repeat: Infinity, duration: 1.8 }} 
                                        style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E' }} 
                                    />
                                    <div>
                                        <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>Biometric Gateway Status: ONLINE & ACTIVE</strong>
                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>All 4 main building gates synced. Last update: 3 mins ago • Active Devices: 8 units</span>
                                    </div>
                                </div>
                                <button className="btn-white" style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    onClick={() => addToast({ type: 'success', title: 'Sync Triggered', message: 'Re-polling local gate controllers... Biometric databases are up to date.' })}>
                                    ⚡ Manual Sync Gateway
                                </button>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <KPICard title="Attendance Rate" value="88%" icon={CalendarCheck} color="#22C55E" subtext="Institution average" />
                                <KPICard title="Present Today" value={215} icon={Users} color="#3B82F6" subtext="Strength: 250" />
                                <KPICard title="Late Arrivals" value={15} icon={Clock} color="#F59E0B" subtext="Action threshold met" />
                                <KPICard title="On Leave" value={20} icon={UserX} color="#EF4444" subtext="Approved applications" />
                            </div>

                            {/* Charts */}
                            <div className="responsive-split-grid" style={{ marginBottom: '24px' }}>
                                <div className="card" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Weekly Attendance Summary</h3>
                                    <div style={{ height: '240px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={weeklyAttendanceData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--glass-shadow)' }} />
                                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                                <Bar dataKey="present" name="Present" fill="var(--primary-dark)" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="absent" name="Absent" fill="var(--danger)" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="card" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Performance by Class</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {['CS-A', 'CS-B', 'IT-A', 'ECE-A'].map((cls, idx) => {
                                            const rates = [92, 85, 90, 84];
                                            return (
                                                <div key={idx}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                                        <span>Class {cls}</span>
                                                        <strong>{rates[idx]}%</strong>
                                                    </div>
                                                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-color)', borderRadius: '3px', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${rates[idx]}%`, background: rates[idx] < 86 ? 'var(--warning)' : 'var(--success)' }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. MARK ATTENDANCE */}
                    {activeTab === 'mark' && (
                        <div className="card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Audience:</span>
                                        <select 
                                            value={selectedTarget} 
                                            onChange={(e) => setSelectedTarget(e.target.value)}
                                            style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                                        >
                                            <option>Students</option>
                                            <option>Employees</option>
                                        </select>
                                    </div>

                                    {selectedTarget === 'Students' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Class:</span>
                                            <select 
                                                value={selectedClass} 
                                                onChange={(e) => setSelectedClass(e.target.value)}
                                                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                                            >
                                                <option>CS-A</option>
                                                <option>CS-B</option>
                                                <option>IT-A</option>
                                                <option>IT-B</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Select Department:</span>
                                            <select 
                                                value={selectedDept} 
                                                onChange={(e) => setSelectedDept(e.target.value)}
                                                style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, outline: 'none' }}
                                            >
                                                <option>Computer Science</option>
                                                <option>Information Technology</option>
                                                <option>Human Resources</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <button className="btn-white" style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 600 }} onClick={() => markAll('Present')}>All Present</button>
                                    <button className="btn-white" style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 600 }} onClick={() => markAll('Absent')}>All Absent</button>
                                    <button className="btn-primary" style={{ padding: '10px 18px', fontSize: '12px', fontWeight: 600 }} onClick={saveAttendance}>Save Register</button>
                                </div>
                            </div>

                            {/* Marking Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                {markingList.map((person, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-color)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={person.avatar} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                                            <div>
                                                <strong style={{ display: 'block', fontSize: '13px' }}>{person.name}</strong>
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{person.id}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {['Present', 'Late', 'Absent'].map(st => {
                                                const isActive = person.status === st;
                                                const bg = st === 'Present' ? 'var(--success)' : st === 'Late' ? 'var(--warning)' : 'var(--danger)';
                                                const emoji = st === 'Present' ? '🟢' : st === 'Late' ? '🟡' : '🔴';
                                                return (
                                                    <button 
                                                        key={st}
                                                        onClick={() => handleMarkStatus(person.id, st)}
                                                        style={{ 
                                                            padding: '6px 10px', 
                                                            fontSize: '11px', 
                                                            fontWeight: isActive ? 600 : 500,
                                                            border: '1px solid var(--border-color)', 
                                                            borderRadius: '20px', 
                                                            cursor: 'pointer',
                                                            background: isActive ? bg : 'var(--card-white)',
                                                            color: isActive ? 'white' : 'var(--text-secondary)',
                                                            boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                                                            transition: 'all 0.2s',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                    >
                                                        <span>{emoji}</span> {st}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. RECORDS & ANALYTICS */}
                    {activeTab === 'records' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Monthly Calendar View */}
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Monthly Register Heatmap (July 2026)</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', maxWidth: '600px' }}>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                        <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>{d}</div>
                                    ))}
                                    {Array.from({ length: 30 }, (_, i) => {
                                        const isWeekend = i % 7 === 0 || i % 7 === 6;
                                        const rate = isWeekend ? 0 : randomRange(75, 100);
                                        const bg = isWeekend ? 'transparent' : rate > 90 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)';
                                        const color = isWeekend ? 'var(--text-secondary)' : rate > 90 ? 'var(--success)' : 'var(--warning)';
                                        return (
                                            <div 
                                                key={i} 
                                                style={{ 
                                                    aspectRatio: '1', 
                                                    background: bg, 
                                                    border: isWeekend ? '1px dashed var(--border-color)' : '1px solid var(--border-color)', 
                                                    borderRadius: '6px', 
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center', 
                                                    cursor: 'pointer' 
                                                }}
                                                onClick={() => addToast({ type: 'info', title: `July ${i + 1}`, message: isWeekend ? 'Weekend' : `Attendance Rate: ${rate}%` })}
                                            >
                                                <span style={{ fontSize: '12px', fontWeight: 600, color }}>{i + 1}</span>
                                                {!isWeekend && <span style={{ fontSize: '9px', color }}>{rate}%</span>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Filter Pills */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                {['All', 'Present', 'Absent', 'Late', 'Leave'].map(st => (
                                    <button 
                                        key={st}
                                        onClick={() => setStatusFilter(st)}
                                        style={{
                                            padding: '6px 14px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            borderRadius: '20px',
                                            border: '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            background: statusFilter.toLowerCase() === st.toLowerCase() ? 'var(--primary-dark)' : 'var(--card-white)',
                                            color: statusFilter.toLowerCase() === st.toLowerCase() ? 'white' : 'var(--text-secondary)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>

                            {/* Logs list */}
                            <DataTable 
                                title={`${statusFilter === 'All' ? 'All Check-In' : statusFilter} Records`}
                                columns={recordsColumns}
                                data={mockAttendance.filter(log => {
                                    if (statusFilter === 'All') return true;
                                    return log.status.toLowerCase() === statusFilter.toLowerCase();
                                })}
                                isLoading={false}
                            />
                        </div>
                    )}

                    {/* 4. REPORT BUILDER */}
                    {activeTab === 'reports' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Attendance Report Management</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Choose a predefined report template below to customize, generate, and download data sheets.</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {reportTemplates.map((tpl) => {
                                    const Icon = tpl.icon;
                                    return (
                                        <motion.div
                                            key={tpl.id}
                                            className="card"
                                            whileHover={{ y: -6, scale: 1.01, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}
                                            style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '190px', cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s', border: '1px solid var(--border-color)', position: 'relative' }}
                                            onClick={() => setSelectedReport(tpl)}
                                        >
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${tpl.color}15`, color: tpl.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <Icon size={20} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{tpl.title}</span>
                                                    <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', marginBottom: '8px' }}>{tpl.subtitle}</h4>
                                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>{tpl.desc}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--primary-dark)' }}>
                                                    More info <ChevronRight size={14} />
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <Drawer
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                title={selectedReport ? `${selectedReport.title} Configuration` : 'Report Configuration'}
            >
                {selectedReport && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${selectedReport.color}15`, color: selectedReport.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {React.createElement(selectedReport.icon, { size: 18 })}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{selectedReport.subtitle}</h4>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{selectedReport.title}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {selectedReport.configFields.includes('class') && (
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Target Class</label>
                                    <select 
                                        value={reportConfig.class} 
                                        onChange={(e) => setReportConfig({ ...reportConfig, class: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                    >
                                        {['CS-A', 'CS-B', 'IT-A', 'IT-B', 'ECE-A', 'MECH-A'].map(cls => (
                                            <option key={cls} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedReport.configFields.includes('dept') && (
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Department</label>
                                    <select 
                                        value={reportConfig.dept} 
                                        onChange={(e) => setReportConfig({ ...reportConfig, dept: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                    >
                                        {['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Mechanical Engineering'].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedReport.configFields.includes('category') && (
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Employee Category</label>
                                    <select 
                                        value={reportConfig.category} 
                                        onChange={(e) => setReportConfig({ ...reportConfig, category: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                    >
                                        {['All Faculty', 'Teaching Staff', 'Non-Teaching Staff', 'Support Staff'].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedReport.configFields.includes('date') && (
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Target Date</label>
                                    <input 
                                        type="date" 
                                        value={reportConfig.date} 
                                        onChange={(e) => setReportConfig({ ...reportConfig, date: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} 
                                    />
                                </div>
                            )}

                            {selectedReport.configFields.includes('month') && (
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Target Month</label>
                                    <select 
                                        value={reportConfig.month} 
                                        onChange={(e) => setReportConfig({ ...reportConfig, month: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                    >
                                        {['July 2026', 'June 2026', 'May 2026', 'April 2026'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedReport.configFields.includes('format') && (
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Export Format</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {[
                                            { id: 'xlsx', label: 'Excel (.xlsx)' },
                                            { id: 'pdf', label: 'PDF Document' },
                                            { id: 'csv', label: 'CSV File' }
                                        ].map(f => (
                                            <button
                                                key={f.id}
                                                onClick={() => setReportConfig({ ...reportConfig, format: f.id })}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px 12px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    background: reportConfig.format === f.id ? 'var(--primary-dark)' : 'var(--card-white)',
                                                    color: reportConfig.format === f.id ? 'white' : 'var(--text-secondary)',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                                className="btn-primary"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                                onClick={() => {
                                    addToast({ 
                                        type: 'success', 
                                        title: 'Report Compiled', 
                                        message: `"${selectedReport.title} - ${selectedReport.subtitle}" has been successfully compiled and downloaded as ${reportConfig.format.toUpperCase()}.`
                                    });
                                    setSelectedReport(null);
                                }}
                            >
                                <Download size={16} /> Compile & Download Report
                            </button>
                            <button
                                className="btn-white"
                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => setSelectedReport(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </Drawer>
        </PageTransition>
    );
};

// Helper randomizer for mock rates
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default Attendance;

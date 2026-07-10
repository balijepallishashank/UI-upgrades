import React, { useState, useEffect } from 'react';
import { 
    Users, CalendarOff, Clock, FileText, Calendar, ClipboardCheck, 
    ArrowRight, Pin, EyeOff, Settings2, RefreshCw, Send, CheckCircle2,
    DollarSign, Package, UserX, AlertTriangle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Drawer from '../components/Drawer';
import AnimatedNumber from '../components/AnimatedNumber';
import PageTransition from '../components/PageTransition';
import { 
    mockStudents, mockEmployees, mockInventory, 
    mockFinanceDueList, mockFeeTransactions, mockAttendance, mockLeave,
    mockEvents, mockBirthdays, mockTimetableData
} from '../mockData';
import { useToast } from '../contexts/ToastContext';
import './Dashboard.css';

const attendanceData = [
  { name: 'Present', value: 88, color: '#22C55E' },
  { name: 'Absent', value: 8, color: '#EF4444' },
  { name: 'On Leave', value: 4, color: '#F59E0B' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const QuickAccessBtn = ({ title, desc, icon: Icon, colorClass, onClick }) => {
    return (
        <motion.div 
            className="qa-item" 
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className={`qa-icon ${colorClass}`}>
                <Icon size={20} />
            </div>
            <div className="qa-info">
                <h4 style={{ margin: 0 }}>{title}</h4>
                <p style={{ margin: 0 }}>{desc}</p>
            </div>
        </motion.div>
    );
};

const SummaryItem = ({ label, value, type, icon: Icon, delay }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay / 1000, duration: 0.3 }}
            className="summary-item"
        >
            <div className={`summary-header ${type}`}>
                <Icon size={16} />
                <span>{label}</span>
            </div>
            <div className="summary-value" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                <AnimatedNumber value={value} />
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    
    // Layout Personalization State
    const defaultWidgets = [
        { id: 'overview', title: 'Attendance Overview', visible: true, pinned: false },
        { id: 'summary', title: "Today's Summary", visible: true, pinned: false },
        { id: 'ai_assistant', title: '✨ Spark AI Assistant', visible: true, pinned: true },
        { id: 'activity_feed', title: 'Activity Feed', visible: true, pinned: false },
        { id: 'quick_access', title: 'Quick Access Modules', visible: true, pinned: false },
        { id: 'announcement', title: 'Institution Announcement', visible: true, pinned: false },
        { id: 'timetable', title: "📅 Today's Timetable", visible: true, pinned: false },
        { id: 'birthdays', title: '🎂 Birthdays & Anniversaries', visible: true, pinned: false },
        { id: 'events', title: '🗓️ Upcoming Events', visible: true, pinned: false },
    ];
    
    const [widgets, setWidgets] = useState(() => {
        const saved = localStorage.getItem('dashboard_layout');
        return saved ? JSON.parse(saved) : defaultWidgets;
    });
    
    const [showConfig, setShowConfig] = useState(false);
    
    // AI Assistant State
    const [aiQuery, setAiQuery] = useState('');
    const [aiResponse, setAiResponse] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    // Save layout to localstorage
    const saveLayout = (updatedWidgets) => {
        setWidgets(updatedWidgets);
        localStorage.setItem('dashboard_layout', JSON.stringify(updatedWidgets));
    };

    const toggleVisibility = (id) => {
        const updated = widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w);
        saveLayout(updated);
        addToast({ type: 'info', title: 'Layout Updated', message: 'Widget visibility modified.' });
    };

    const togglePin = (id) => {
        const updated = widgets.map(w => w.id === id ? { ...w, pinned: !w.pinned } : w);
        // Sort: pinned widgets first
        const sorted = [...updated].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
        saveLayout(sorted);
        addToast({ type: 'success', title: 'Widget Pinned', message: 'Pinned widgets are locked at the top.' });
    };

    const resetLayout = () => {
        saveLayout(defaultWidgets);
        addToast({ type: 'info', title: 'Layout Reset', message: 'Dashboard layout restored to default.' });
    };

    // AI Assistant Processing
    const handleAiSubmit = (queryText) => {
        const q = queryText || aiQuery;
        if (!q.trim()) return;

        setAiLoading(true);
        setAiResponse(null);

        setTimeout(() => {
            const cleanQ = q.toLowerCase();
            let resultData = null;
            let resultType = 'text';

            if (cleanQ.includes('absent') || cleanQ.includes('absentees')) {
                // Today's absentees
                const absStudents = mockStudents.filter(s => s.status === 'Absent').slice(0, 5);
                resultData = {
                    title: "Today's Absent Students (First 5)",
                    items: absStudents.map(s => `${s.name} (${s.class}) - Roll ${s.roll}`),
                    type: 'list'
                };
                resultType = 'data';
            } else if (cleanQ.includes('fee') || cleanQ.includes('unpaid') || cleanQ.includes('defaulters')) {
                // Outstanding dues
                const unpaid = mockFinanceDueList.filter(f => f.status === 'Overdue').slice(0, 5);
                resultData = {
                    title: "Top Defaulters (Overdue)",
                    items: unpaid.map(f => `${f.student} (${f.class}) - Due: ${f.amount}`),
                    type: 'list'
                };
                resultType = 'data';
            } else if (cleanQ.includes('stock') || cleanQ.includes('inventory') || cleanQ.includes('threshold')) {
                // Low stock inventory
                const lowStock = mockInventory.filter(i => i.stock < 15).slice(0, 5);
                resultData = {
                    title: "Items Below Threshold (<15 Units)",
                    items: lowStock.map(i => `${i.item} (${i.category}) - ${i.stock} units remaining`),
                    type: 'list'
                };
                resultType = 'data';
            } else if (cleanQ.includes('report') || cleanQ.includes('attendance report')) {
                // Attendance Summary
                resultData = {
                    title: "Today's Attendance Summary",
                    items: [
                        `Total Strength: 250 (150 Students, 60 Employees, 40 Staff)`,
                        `Present Today: 215 (86% Attendance Rate)`,
                        `Late Arrivals: 15`,
                        `Approved Leaves: 20`
                    ],
                    type: 'list'
                };
                resultType = 'data';
            } else {
                resultData = "I'm sorry, I didn't recognize that command. Try clicking one of the preset filters below!";
                resultType = 'text';
            }

            setAiResponse({ query: q, type: resultType, data: resultData });
            setAiLoading(false);
            addToast({ type: 'success', title: 'AI Assistant Response', message: 'Calculated query from live database.' });
        }, 800);
    };

    // Sorted list of visible widgets
    const visibleWidgets = widgets.filter(w => w.visible);

    // Predefined AI Actions
    const aiPresets = [
        { label: "Show today's absentees", icon: UserX },
        { label: "Students with unpaid fees", icon: DollarSign },
        { label: "Inventory below threshold", icon: AlertTriangle },
        { label: "Generate attendance report", icon: ClipboardCheck }
    ];

    // Activity Feed Logs (Chronological Log)
    const activities = [
        { time: '09:10 AM', event: 'Aarav Sharma marked Present', sub: 'Class CS-A • Check-in: 08:45 AM', type: 'present', icon: Users },
        { time: '09:08 AM', event: 'Priya Verma submitted Leave Application', sub: 'Sick Leave • 2 Days • Pending Approval', type: 'leave', icon: CalendarOff },
        { time: '09:01 AM', event: 'Inventory Stock Restocked', sub: 'Dell Latitude Laptop (+10 units) • Electronics', type: 'inventory', icon: Package },
        { time: '08:55 AM', event: 'Fee Payment Received', sub: '₹45,000 from Rohan Verma for Semester I Tuition Fee', type: 'finance', icon: DollarSign },
        { time: '08:30 AM', event: 'Amit Gupta checked in Late', sub: 'Class IT-B • Check-in: 09:15 AM', type: 'late', icon: Clock }
    ];

    return (
        <PageTransition>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span>🏛️</span> Institution Control Dashboard
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                            Enterprise Command Center. Current Session: 2026-27.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            className="btn-white" 
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => setShowConfig(!showConfig)}
                        >
                            <Settings2 size={16} /> Customize Dashboard
                        </button>
                    </div>
                </div>

                {/* Dashboard Personalization Controls Bar */}
                <AnimatePresence>
                    {showConfig && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="card"
                            style={{ padding: '20px', marginTop: '16px', overflow: 'hidden' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Toggle & Pin Dashboard Widgets</h4>
                                <button className="btn-white" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={resetLayout}>
                                    <RefreshCw size={12} style={{ marginRight: 6 }} /> Reset Layout
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {widgets.map(w => (
                                    <div 
                                        key={w.id} 
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            background: w.visible ? 'rgba(163, 217, 92, 0.1)' : 'var(--bg-color)',
                                            border: `1px solid ${w.visible ? 'rgba(163, 217, 92, 0.3)' : 'var(--border-color)'}`,
                                            padding: '8px 12px', 
                                            borderRadius: '8px' 
                                        }}
                                    >
                                        <span style={{ fontSize: '13px', fontWeight: 500, color: w.visible ? 'var(--primary-dark)' : 'var(--text-secondary)' }}>{w.title}</span>
                                        <button 
                                            onClick={() => toggleVisibility(w.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: w.visible ? 'var(--primary-dark)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                                            title={w.visible ? "Hide from Dashboard" : "Show on Dashboard"}
                                        >
                                            <EyeOff size={14} />
                                        </button>
                                        <button 
                                            onClick={() => togglePin(w.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: w.pinned ? 'var(--warning)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                                            title={w.pinned ? "Unpin widget" : "Pin widget to top"}
                                        >
                                            <Pin size={14} fill={w.pinned ? "var(--warning)" : "none"} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Dashboard Content Grid */}
            <motion.div 
                className="dashboard-grid" 
                variants={containerVariants} 
                initial="hidden" 
                animate="show"
            >
                {/* Left Column (Core Metrics) */}
                <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} variants={containerVariants}>
                    {/* Render Pinned & Visible Left Items */}
                    {visibleWidgets.filter(w => ['overview', 'quick_access', 'ai_assistant', 'timetable'].includes(w.id)).map(widget => {
                        if (widget.id === 'overview') {
                            return (
                                <motion.div key={widget.id} variants={itemVariants} className="card overview-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 className="card-title" style={{ margin: 0 }}>Attendance Statistics</h3>
                                        <button 
                                            onClick={() => togglePin('overview')}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: widget.pinned ? 'var(--warning)' : 'var(--text-secondary)' }}
                                        >
                                            <Pin size={14} fill={widget.pinned ? "var(--warning)" : "none"} />
                                        </button>
                                    </div>
                                    <div className="overview-content">
                                        <div className="chart-wrapper">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={attendanceData}
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={2}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {attendanceData.map((entry, index) => (
                                                            <Cell 
                                                                key={`cell-${index}`} 
                                                                fill={entry.color} 
                                                                style={{ cursor: 'pointer', outline: 'none' }}
                                                                onClick={() => {
                                                                    const statusMap = {
                                                                        'Present': 'Present',
                                                                        'Absent': 'Absent',
                                                                        'On Leave': 'Leave'
                                                                    };
                                                                    const statusFilter = statusMap[entry.name] || 'All';
                                                                    navigate('/attendance', { state: { filterStatus: statusFilter } });
                                                                    addToast({ 
                                                                        type: 'info', 
                                                                        title: 'Drilling Down', 
                                                                        message: `Viewing students with status: ${entry.name}` 
                                                                    });
                                                                }}
                                                            />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="chart-center-text">
                                                <h3>88%</h3>
                                                <p>Attendance Rate</p>
                                            </div>
                                        </div>
                                        
                                        <div className="legend-list">
                                            <div className="legend-item">
                                                <div className="legend-label"><span className="dot present"></span> Present Today</div>
                                                <span className="legend-value"><AnimatedNumber value={215} /> / 250</span>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-label"><span className="dot absent"></span> Absentees</div>
                                                <span className="legend-value"><AnimatedNumber value={15} /></span>
                                            </div>
                                            <div className="legend-item">
                                                <div className="legend-label"><span className="dot leave"></span> On Approved Leave</div>
                                                <span className="legend-value"><AnimatedNumber value={20} /></span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        }

                        if (widget.id === 'ai_assistant') {
                            return (
                                <motion.div key={widget.id} variants={itemVariants} className="ai-assistant-card card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                                            ✨ Spark AI Enterprise Assistant
                                        </h3>
                                        <button 
                                            onClick={() => togglePin('ai_assistant')}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: widget.pinned ? 'var(--warning)' : 'var(--text-secondary)' }}
                                        >
                                            <Pin size={14} fill={widget.pinned ? "var(--warning)" : "none"} />
                                        </button>
                                    </div>
                                    
                                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                        Query the institutional database instantly. Click a quick pill below or write custom queries.
                                    </p>

                                    {/* AI Chat Window */}
                                    <div style={{ background: 'var(--card-white)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '16px', minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                        {aiLoading ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                                                <RefreshCw size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> Processing query against live database...
                                            </div>
                                        ) : aiResponse ? (
                                            <div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                                                    Query: "{aiResponse.query}"
                                                </div>
                                                {aiResponse.type === 'data' ? (
                                                    <div>
                                                        <strong style={{ fontSize: '13px', color: 'var(--primary-dark)', display: 'block', marginBottom: '8px' }}>{aiResponse.data.title}</strong>
                                                        <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: 'var(--text-primary)' }}>
                                                            {aiResponse.data.items.map((item, idx) => (
                                                                <li key={idx}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{aiResponse.data}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px' }}>
                                                Ask me anything or select a prompt pill below.
                                            </div>
                                        )}
                                    </div>

                                    {/* Input controls */}
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Ask Spark AI..." 
                                            value={aiQuery}
                                            onChange={(e) => setAiQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
                                            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '13px' }}
                                        />
                                        <button className="btn-primary" style={{ padding: '10px' }} onClick={() => handleAiSubmit()}>
                                            <Send size={16} />
                                        </button>
                                    </div>

                                    {/* AI Presets */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {aiPresets.map((preset, idx) => (
                                            <motion.button 
                                                key={idx}
                                                className="ai-query-pill"
                                                onClick={() => handleAiSubmit(preset.label)}
                                                whileHover={{ scale: 1.03, background: 'var(--border-color)' }}
                                                whileTap={{ scale: 0.97 }}
                                                style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', border: '1px solid var(--border-color)', outline: 'none' }}
                                            >
                                                <preset.icon size={12} /> {preset.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        }

                        if (widget.id === 'timetable') {
                            const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                            const today = days[new Date().getDay()];
                            const todaySchedule = mockTimetableData['CS-A']?.[today] || [];
                            const periods = ['08:00','09:00','10:00','11:00','12:00','01:00'];
                            return (
                                <motion.div key={widget.id} variants={itemVariants} className="card" style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            📅 Today's Timetable
                                            <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-secondary)', background: 'var(--bg-color)', padding: '2px 8px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>CS-A • {today}</span>
                                        </h3>
                                        <button onClick={() => togglePin('timetable')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: widget.pinned ? 'var(--warning)' : 'var(--text-secondary)' }}>
                                            <Pin size={14} fill={widget.pinned ? "var(--warning)" : "none"} />
                                        </button>
                                    </div>
                                    {todaySchedule.length === 0 || !todaySchedule.some(p => p.subject) ? (
                                        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                            🎉 No classes scheduled today!
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {todaySchedule.map((period, idx) => period.subject ? (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)' }}
                                                >
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', minWidth: '44px', fontFamily: 'monospace' }}>{periods[idx]} PM</span>
                                                    <div style={{ width: '3px', height: '32px', borderRadius: '2px', background: idx === 0 ? '#22C55E' : idx === 1 ? '#3B82F6' : idx === 2 ? '#8B5CF6' : idx === 3 ? '#F59E0B' : idx === 4 ? '#EC4899' : '#14B8A6' }} />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{period.subject}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{period.teacher}</div>
                                                    </div>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--card-white)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>P{idx + 1}</span>
                                                </motion.div>
                                            ) : null)}
                                        </div>
                                    )}
                                    <button onClick={() => navigate('/timetable')} style={{ marginTop: '14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-dark)', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Full Timetable <ArrowRight size={13} />
                                    </button>
                                </motion.div>
                            );
                        }

                        if (widget.id === 'quick_access') {
                            return (
                                <motion.div key={widget.id} variants={itemVariants} className="card quick-access-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 className="card-title" style={{ margin: 0 }}>Workflow Centers</h3>
                                        <button 
                                            onClick={() => togglePin('quick_access')}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: widget.pinned ? 'var(--warning)' : 'var(--text-secondary)' }}
                                        >
                                            <Pin size={14} fill={widget.pinned ? "var(--warning)" : "none"} />
                                        </button>
                                    </div>
                                    <div className="quick-access-grid">
                                        <QuickAccessBtn title="Students" desc="Directory & profiles" icon={Users} colorClass="green" onClick={() => navigate('/students')} />
                                        <QuickAccessBtn title="Employees" desc="Faculty list & departments" icon={Users} colorClass="green" onClick={() => navigate('/employees')} />
                                        <QuickAccessBtn title="Attendance" desc="Check-ins & daily registers" icon={Clock} colorClass="orange" onClick={() => navigate('/attendance')} />
                                        <QuickAccessBtn title="Leave Center" desc="Submit & review leaves" icon={CalendarOff} colorClass="orange" onClick={() => navigate('/leave')} />
                                        <QuickAccessBtn title="Holidays" desc="Organizational calendar" icon={Calendar} colorClass="orange" onClick={() => navigate('/holidays')} />
                                        <QuickAccessBtn title="Finance Hub" desc="Dues ledger & structure" icon={DollarSign} colorClass="green" onClick={() => navigate('/finance')} />
                                        <QuickAccessBtn title="Inventory" desc="Asset logs & restocks" icon={Package} colorClass="green" onClick={() => navigate('/inventory')} />
                                        <QuickAccessBtn title="Report Center" desc="Export spreadsheets" icon={FileText} colorClass="green" onClick={() => navigate('/reports')} />
                                    </div>
                                </motion.div>
                            );
                        }
                        return null;
                    })}
                </motion.div>

                {/* Right Column */}
                <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} variants={containerVariants}>
                    {visibleWidgets.filter(w => ['summary', 'activity_feed', 'announcement', 'birthdays', 'events'].includes(w.id)).map(widget => {
                        if (widget.id === 'summary') {
                            return (
                                <motion.div key={widget.id} variants={itemVariants} className="card summary-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 className="card-title" style={{ margin: 0 }}>Today's Summary</h3>
                                        <button onClick={() => togglePin('summary')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: widget.pinned ? 'var(--warning)' : 'var(--text-secondary)' }}>
                                            <Pin size={14} fill={widget.pinned ? "var(--warning)" : "none"} />
                                        </button>
                                    </div>
                                    <div className="summary-grid">
                                        <SummaryItem label="Present" value={215} type="present" icon={Users} delay={100} />
                                        <SummaryItem label="Absent" value={15} type="absent" icon={Users} delay={200} />
                                        <SummaryItem label="On Leave" value={20} type="leave" icon={Users} delay={300} />
                                        <SummaryItem label="Late Arrivals" value={15} type="late" icon={Users} delay={400} />
                                    </div>
                                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/attendance'); }} className="view-full-report">
                                        Open Attendance Center <ArrowRight size={14} style={{marginLeft: 4, verticalAlign: 'middle'}}/>
                                    </a>
                                </motion.div>
                            );
                        }

                        if (widget.id === 'activity_feed') {
                            return (
                                <motion.div key={widget.id} variants={itemVariants} className="card" style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 className="card-title" style={{ margin: 0 }}>Real-Time Activity Feed</h3>
                                        <button onClick={() => togglePin('activity_feed')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: widget.pinned ? 'var(--warning)' : 'var(--text-secondary)' }}>
                                            <Pin size={14} fill={widget.pinned ? "var(--warning)" : "none"} />
                                        </button>
                                    </div>
                                    <div className="timeline-container">
                                        <div className="timeline-line"></div>
                                        {activities.map((act, index) => (
                                            <div className="timeline-item" key={index}>
                                                <div className="timeline-dot" style={{ background: act.type === 'present' ? 'var(--success)' : act.type === 'leave' ? 'var(--warning)' : act.type === 'finance' ? 'var(--primary-dark)' : act.type === 'inventory' ? '#EC4899' : 'var(--danger)' }}></div>
                                                <div style={{ marginLeft: '12px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                                                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{act.event}</span>
                                                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{act.time}</span>
                                                    </div>
                                                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{act.sub}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        }

                        if (widget.id === 'announcement') {
                            return (
                                <motion.div key={widget.id} variants={itemVariants} className="card announcement-card">
                                    <div className="announcement-bg"></div>
                                    <div className="announcement-content">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', zIndex: 3 }}>
                                            <h3>Institution Announcement</h3>
                                            <button onClick={() => togglePin('announcement')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: widget.pinned ? 'var(--warning)' : 'rgba(255,255,255,0.6)' }}>
                                                <Pin size={14} fill={widget.pinned ? "var(--warning)" : "none"} />
                                            </button>
                                        </div>
                                        <h4>Annual Day & Cultural Meet</h4>
                                        <p>The annual day and cultural meet will be held on 24th May 2026. All students and support staff are requested to prepare programs.</p>
                                        <motion.button className="btn-white" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addToast({ type: 'info', title: 'Announcement details', message: 'Announcements logs are loaded in settings.' })}>
                                            Read Circular
                                        </motion.button>
                                        <div className="interested-users">
                                            <div className="user-avatars">
                                                <img src="https://i.pravatar.cc/100?img=4" alt="user" />
                                                <img src="https://i.pravatar.cc/100?img=5" alt="user" />
                                                <img src="https://i.pravatar.cc/100?img=6" alt="user" />
                                            </div>
                                            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>78 people interested</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        }



                        // ── NEW: Birthdays & Anniversaries Widget ──
                        if (widget.id === 'birthdays') {
                            const todayBirthdays = mockBirthdays.filter(b => b.dob === new Date().toISOString().split('T')[0] || b.dob.endsWith('-07-06') || b.dob.endsWith('-07-07'));
                            return (
                                <motion.div key={widget.id} variants={itemVariants} className="card" style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 className="card-title" style={{ margin: 0 }}>🎂 Birthdays & Anniversaries</h3>
                                        <button onClick={() => togglePin('birthdays')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: widget.pinned ? 'var(--warning)' : 'var(--text-secondary)' }}>
                                            <Pin size={14} fill={widget.pinned ? "var(--warning)" : "none"} />
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {mockBirthdays.map((person, idx) => (
                                            <motion.div
                                                key={person.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.07 }}
                                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', background: person.type === 'Birthday' ? 'rgba(251,191,36,0.06)' : 'rgba(163,217,92,0.08)', border: `1px solid ${person.type === 'Birthday' ? 'rgba(251,191,36,0.2)' : 'rgba(163,217,92,0.2)'}` }}
                                            >
                                                <img src={person.avatar} alt={person.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{person.name}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{person.role} • {person.department}</div>
                                                </div>
                                                <span style={{ fontSize: '18px' }}>{person.type === 'Birthday' ? '🎂' : '🏆'}</span>
                                                {person.type === 'Work Anniversary' && <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-dark)', background: 'rgba(163,217,92,0.2)', padding: '2px 8px', borderRadius: '20px' }}>{person.years}Y</span>}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        }

                        // ── NEW: Upcoming Events Widget ──
                        if (widget.id === 'events') {
                            const eventColors = { Sports: '#22C55E', Academic: '#3B82F6', Exam: '#8B5CF6', 'National Holiday': '#F59E0B', Cultural: '#EC4899' };
                            return (
                                <motion.div key={widget.id} variants={itemVariants} className="card" style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 className="card-title" style={{ margin: 0 }}>🗓️ Upcoming Events</h3>
                                        <button onClick={() => togglePin('events')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: widget.pinned ? 'var(--warning)' : 'var(--text-secondary)' }}>
                                            <Pin size={14} fill={widget.pinned ? "var(--warning)" : "none"} />
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {mockEvents.map((ev, idx) => {
                                            const daysLeft = Math.ceil((new Date(ev.date) - new Date()) / (1000*60*60*24));
                                            const color = eventColors[ev.type] || '#6B7280';
                                            return (
                                                <motion.div
                                                    key={ev.id}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.06 }}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }}
                                                >
                                                    <span style={{ fontSize: '22px' }}>{ev.icon}</span>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{ev.title}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{ev.venue} • {ev.date}</div>
                                                    </div>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: color, background: `${color}15`, padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                                                        {daysLeft <= 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d`}
                                                    </span>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            );
                        }

                    })}
                </motion.div>
            </motion.div>
        </PageTransition>
    );
};

export default Dashboard;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, CheckCircle, AlertCircle, Plus, FileText
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import KPICard from '../components/KPICard';
import Badge from '../components/Badge';
import DataTable from '../components/DataTable';
import { useToast } from '../contexts/ToastContext';
import { mockHomework, mockClasses } from '../mockData';

const Homework = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [homeworkList, setHomeworkList] = useState(mockHomework);
    const [filterClass, setFilterClass] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // Add Homework Form
    const [form, setForm] = useState({
        class: 'CS-A', subject: '', title: '', description: '',
        dueDate: '', assignedBy: 'Dr. Anita Rao'
    });

    const mainTabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'assign', label: 'Assign Homework' },
        { id: 'track', label: 'Track Submissions' },
    ];

    const activeCount = homeworkList.filter(h => h.status === 'Active').length;
    const overdueCount = homeworkList.filter(h => h.status === 'Overdue').length;
    const completedCount = homeworkList.filter(h => h.status === 'Completed').length;
    const totalSubmissions = homeworkList.reduce((a, h) => a + h.submissions, 0);

    const filtered = homeworkList.filter(h => {
        const classMatch = filterClass === 'All' || h.class === filterClass;
        const statusMatch = filterStatus === 'All' || h.status === filterStatus;
        return classMatch && statusMatch;
    });

    const handleAssign = (e) => {
        e.preventDefault();
        if (!form.subject || !form.title || !form.dueDate) {
            addToast({ type: 'error', title: 'Missing Fields', message: 'Please fill in Subject, Title, and Due Date.' });
            return;
        }
        const newHW = {
            id: `HW${String(homeworkList.length + 1).padStart(3, '0')}`,
            ...form,
            assignedDate: new Date().toISOString().slice(0, 10),
            status: 'Active',
            submissions: 0,
            total: mockClasses.find(c => c.name === form.class)?.students || 40
        };
        setHomeworkList(prev => [newHW, ...prev]);
        setForm({ class: 'CS-A', subject: '', title: '', description: '', dueDate: '', assignedBy: 'Dr. Anita Rao' });
        addToast({ type: 'success', title: 'Homework Assigned', message: `"${newHW.title}" assigned to ${newHW.class} successfully.` });
        setActiveTab('track');
    };

    const trackColumns = [
        { header: 'Class', accessor: 'class', render: r => <strong>{r.class}</strong> },
        { header: 'Subject', accessor: 'subject' },
        { header: 'Title', accessor: 'title', render: r => <span style={{ fontSize: '13px', fontWeight: 500 }}>{r.title}</span> },
        { header: 'Assigned By', accessor: 'assignedBy' },
        { header: 'Due Date', accessor: 'dueDate', render: r => <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{r.dueDate}</span> },
        { header: 'Submissions', accessor: 'submissions', render: r => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>{r.submissions}/{r.total}</span>
                <div style={{ height: '4px', borderRadius: '4px', background: 'var(--border-color)', overflow: 'hidden', width: '80px' }}>
                    <div style={{ height: '100%', borderRadius: '4px', background: r.status === 'Overdue' ? '#EF4444' : 'var(--primary-green)', width: `${Math.round(r.submissions / r.total * 100)}%` }} />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{Math.round(r.submissions / r.total * 100)}%</span>
            </div>
        )},
        { header: 'Status', accessor: 'status', render: r => (
            <Badge type={r.status === 'Active' ? 'Success' : r.status === 'Overdue' ? 'Absent' : 'Warning'} text={r.status} />
        )},
    ];

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📝</span> Homework Manager
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Assign, track, and review homework across all classes and subjects.
                    </p>
                </div>
                {activeTab !== 'assign' && (
                    <button className="btn-primary" onClick={() => setActiveTab('assign')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Plus size={15} /> Assign Homework
                    </button>
                )}
            </div>

            <SegmentedControl tabs={mainTabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

                    {/* OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <KPICard title="Active Assignments" value={activeCount} icon={BookOpen} color="#3B82F6" subtext="Currently open" />
                                <KPICard title="Overdue" value={overdueCount} icon={AlertCircle} color="#EF4444" subtext="Past due date" />
                                <KPICard title="Completed" value={completedCount} icon={CheckCircle} color="#22C55E" subtext="Fully submitted" />
                                <KPICard title="Total Submissions" value={totalSubmissions} icon={FileText} color="#8B5CF6" subtext="Across all homework" />
                            </div>

                            {/* Recent Homework Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                                {homeworkList.slice(0, 6).map((hw, idx) => (
                                    <motion.div key={hw.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                        className="card" style={{ padding: '18px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                            <div>
                                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-green)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '4px' }}>{hw.class} • {hw.subject}</span>
                                                <h4 style={{ fontSize: '14px', fontWeight: 700, marginTop: '6px', marginBottom: '0' }}>{hw.title}</h4>
                                            </div>
                                            <Badge type={hw.status === 'Active' ? 'Success' : hw.status === 'Overdue' ? 'Absent' : 'Warning'} text={hw.status} />
                                        </div>
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>{hw.description.slice(0, 80)}...</p>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                                            <span>📅 Due: {hw.dueDate}</span>
                                            <span>👤 {hw.assignedBy}</span>
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Submissions</span>
                                                <span style={{ fontSize: '11px', fontWeight: 700 }}>{hw.submissions}/{hw.total} ({Math.round(hw.submissions / hw.total * 100)}%)</span>
                                            </div>
                                            <div style={{ height: '6px', borderRadius: '4px', background: 'var(--border-color)', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', borderRadius: '4px', background: hw.status === 'Overdue' ? '#EF4444' : hw.status === 'Completed' ? '#22C55E' : 'var(--primary-green)', width: `${Math.round(hw.submissions / hw.total * 100)}%`, transition: 'width 0.6s ease' }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ASSIGN */}
                    {activeTab === 'assign' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="responsive-split-grid-alt">
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Plus size={18} /> New Homework Assignment
                                </h3>
                                <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Class / Section *</label>
                                            <select value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }}>
                                                {mockClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Subject *</label>
                                            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Data Structures"
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Homework Title *</label>
                                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Binary Tree Traversal Problems"
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} required />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Description / Instructions</label>
                                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4}
                                            placeholder="Detailed instructions for students..."
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Due Date *</label>
                                            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Assigned By</label>
                                            <input value={form.assignedBy} onChange={e => setForm(f => ({ ...f, assignedBy: e.target.value }))}
                                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}>
                                        <Plus size={16} /> Assign to {form.class}
                                    </button>
                                </form>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="card" style={{ padding: '20px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px' }}>📊 Submission Summary</h4>
                                    {homeworkList.slice(0, 4).map((hw, idx) => (
                                        <div key={idx} style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: idx < 3 ? '1px solid var(--border-color)' : 'none' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 600 }}>{hw.title.slice(0, 30)}{hw.title.length > 30 ? '...' : ''}</span>
                                                <Badge type={hw.status === 'Active' ? 'Success' : hw.status === 'Overdue' ? 'Absent' : 'Warning'} text={hw.status} />
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{hw.class} • Due {hw.dueDate}</div>
                                            <div style={{ height: '5px', borderRadius: '4px', background: 'var(--border-color)' }}>
                                                <div style={{ height: '100%', borderRadius: '4px', background: hw.status === 'Overdue' ? '#EF4444' : '#22C55E', width: `${Math.round(hw.submissions / hw.total * 100)}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="card" style={{ padding: '20px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>⚠️ Overdue Assignments</h4>
                                    {homeworkList.filter(h => h.status === 'Overdue').map((hw, idx) => (
                                        <div key={idx} style={{ padding: '10px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', marginBottom: '8px' }}>
                                            <strong style={{ fontSize: '12px', color: '#EF4444' }}>{hw.class} — {hw.subject}</strong>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{hw.title} • Was due {hw.dueDate}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TRACK */}
                    {activeTab === 'track' && (
                        <div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
                                    style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px', cursor: 'pointer' }}>
                                    <option value="All">All Classes</option>
                                    {mockClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                                    style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px', cursor: 'pointer' }}>
                                    <option value="All">All Statuses</option>
                                    <option value="Active">Active</option>
                                    <option value="Overdue">Overdue</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-secondary)', alignSelf: 'center' }}>{filtered.length} records</span>
                            </div>
                            <DataTable title="Homework Tracker" columns={trackColumns} data={filtered} isLoading={false} />
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </PageTransition>
    );
};

export default Homework;

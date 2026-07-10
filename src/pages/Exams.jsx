import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trophy, BookOpen, Calendar, Clock, Plus, Users, 
    CheckCircle, FileText, TrendingUp, Edit2, Trash2, AlertCircle
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import KPICard from '../components/KPICard';
import Badge from '../components/Badge';
import DataTable from '../components/DataTable';
import { useToast } from '../contexts/ToastContext';
import { mockExams, mockExamResults, mockClasses } from '../mockData';

const GRADE_COLORS = { 'A+': '#22C55E', 'A': '#3B82F6', 'B': '#8B5CF6', 'C': '#F59E0B', 'D': '#F97316', 'F': '#EF4444' };

const Exams = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [examsList, setExamsList] = useState(mockExams);
    const [resultsList, setResultsList] = useState(mockExamResults);
    const [filterClass, setFilterClass] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Admit Card & Report Card Printing State
    const [selectedAdmitCard, setSelectedAdmitCard] = useState(null);
    const [selectedReportCard, setSelectedReportCard] = useState(null);

    const [form, setForm] = useState({
        name: '', type: 'Unit Test', class: 'CS-A', subject: '',
        date: '', time: '10:00 AM', duration: '2 Hours', room: 'Hall A', maxMarks: 50, examiner: ''
    });

    const mainTabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'schedule', label: 'Exam Schedule' },
        { id: 'results', label: 'Results & Grades' },
    ];

    const upcoming = examsList.filter(e => e.status === 'Upcoming').length;
    const completed = examsList.filter(e => e.status === 'Completed').length;
    const avgMarks = resultsList.length ? Math.round(resultsList.reduce((a, r) => a + (r.marksObtained / r.maxMarks * 100), 0) / resultsList.length) : 0;
    const passRate = resultsList.length ? Math.round(resultsList.filter(r => r.grade !== 'F').length / resultsList.length * 100) : 0;

    const filteredExams = examsList.filter(e => {
        const classMatch = filterClass === 'All' || e.class === filterClass;
        const typeMatch = filterType === 'All' || e.type === filterType;
        return classMatch && typeMatch;
    });

    const handleAddExam = (e) => {
        e.preventDefault();
        const newExam = {
            id: `EX${String(examsList.length + 1).padStart(3, '0')}`,
            ...form,
            status: 'Upcoming'
        };
        setExamsList(prev => [...prev, newExam]);
        setShowAddModal(false);
        setForm({ name: '', type: 'Unit Test', class: 'CS-A', subject: '', date: '', time: '10:00 AM', duration: '2 Hours', room: 'Hall A', maxMarks: 50, examiner: '' });
        addToast({ type: 'success', title: 'Exam Scheduled', message: `${newExam.name} scheduled for ${newExam.class} on ${newExam.date}.` });
    };

    const scheduleColumns = [
        { header: 'Exam', accessor: 'name', render: r => <strong style={{ fontSize: '13px' }}>{r.name}</strong> },
        { header: 'Class', accessor: 'class', render: r => <span style={{ fontWeight: 700, color: 'var(--primary-green)' }}>{r.class}</span> },
        { header: 'Subject', accessor: 'subject' },
        { header: 'Type', accessor: 'type', render: r => <Badge type="Warning" text={r.type} /> },
        { header: 'Date', accessor: 'date', render: r => <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{r.date}</span> },
        { header: 'Time', accessor: 'time', render: r => <span style={{ fontSize: '12px' }}>{r.time}</span> },
        { header: 'Duration', accessor: 'duration' },
        { header: 'Room', accessor: 'room' },
        { header: 'Max Marks', accessor: 'maxMarks', render: r => <strong>{r.maxMarks}</strong> },
        { header: 'Examiner', accessor: 'examiner' },
        { header: 'Status', accessor: 'status', render: r => <Badge type={r.status === 'Upcoming' ? 'Success' : 'Warning'} text={r.status} /> },
        { header: 'Admit Card', accessor: 'action', render: r => r.status === 'Upcoming' ? (
            <button className="btn-white" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => setSelectedAdmitCard(r)}>
                Admit Card
            </button>
        ) : <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>N/A (Ended)</span> }
    ];

    const resultsColumns = [
        { header: 'Student', accessor: 'studentName', render: r => <strong style={{ fontSize: '13px' }}>{r.studentName}</strong> },
        { header: 'Class', accessor: 'class' },
        { header: 'Subject', accessor: 'subject' },
        { header: 'Marks', accessor: 'marksObtained', render: r => <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{r.marksObtained}/{r.maxMarks}</span> },
        { header: 'Percentage', accessor: 'percentage', render: r => {
            const pct = Math.round(r.marksObtained / r.maxMarks * 100);
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ height: '6px', borderRadius: '4px', background: 'var(--border-color)', width: '60px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '4px', background: GRADE_COLORS[r.grade] || '#3B82F6', width: `${pct}%` }} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700 }}>{pct}%</span>
                </div>
            );
        }},
        { header: 'Grade', accessor: 'grade', render: r => (
            <span style={{ fontWeight: 800, fontSize: '14px', color: GRADE_COLORS[r.grade] || '#666' }}>{r.grade}</span>
        )},
        { header: 'Remarks', accessor: 'remarks', render: r => <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{r.remarks}</span> },
        { header: 'Report Card', accessor: 'reportCard', render: r => (
            <button className="btn-white" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => setSelectedReportCard(r)}>
                🖨️ Print
            </button>
        ) }
    ];

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🏆</span> Exams & Results
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Schedule examinations, enter marks, compute grades, and export report cards.
                    </p>
                </div>
                {activeTab !== 'results' && (
                    <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Plus size={15} /> Schedule Exam
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
                                <KPICard title="Upcoming Exams" value={upcoming} icon={Calendar} color="#3B82F6" subtext="Scheduled this term" />
                                <KPICard title="Completed Exams" value={completed} icon={CheckCircle} color="#22C55E" subtext="Results available" />
                                <KPICard title="Avg Score" value={`${avgMarks}%`} icon={TrendingUp} color="#8B5CF6" subtext="Across all results" />
                                <KPICard title="Pass Rate" value={`${passRate}%`} icon={Trophy} color="#F59E0B" subtext="Students passed" />
                            </div>

                            <div className="responsive-split-grid">
                                {/* Upcoming Exams List */}
                                <div className="card" style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Calendar size={17} /> Upcoming Exam Schedule
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {examsList.filter(e => e.status === 'Upcoming').map((exam, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-color)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <strong style={{ fontSize: '13px' }}>{exam.subject}</strong>
                                                        <Badge type="Warning" text={exam.type} />
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                                                        {exam.class} • {exam.room} • {exam.time}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}>{exam.date}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{exam.duration}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Grade Distribution */}
                                <div className="card" style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Trophy size={17} /> Grade Distribution
                                    </h3>
                                    {Object.entries(GRADE_COLORS).map(([grade, color]) => {
                                        const count = resultsList.filter(r => r.grade === grade).length;
                                        const pct = resultsList.length ? Math.round(count / resultsList.length * 100) : 0;
                                        return (
                                            <div key={grade} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                <span style={{ fontWeight: 800, fontSize: '13px', color, minWidth: '28px' }}>{grade}</span>
                                                <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'var(--border-color)', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', borderRadius: '4px', background: color, width: `${pct}%`, transition: 'width 0.8s ease' }} />
                                                </div>
                                                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', minWidth: '50px', textAlign: 'right' }}>{count} ({pct}%)</span>
                                            </div>
                                        );
                                    })}
                                    <div style={{ marginTop: '16px', padding: '12px', background: passRate >= 80 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderRadius: '8px', border: `1px solid ${passRate >= 80 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: passRate >= 80 ? '#22C55E' : '#EF4444' }}>
                                            {passRate >= 80 ? '✅' : '⚠️'} Overall Pass Rate: {passRate}%
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                            {resultsList.filter(r => r.grade !== 'F').length} passed out of {resultsList.length} students
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SCHEDULE */}
                    {activeTab === 'schedule' && (
                        <div>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                <select value={filterClass} onChange={e => setFilterClass(e.target.value)}
                                    style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px', cursor: 'pointer' }}>
                                    <option value="All">All Classes</option>
                                    {mockClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                                    style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px', cursor: 'pointer' }}>
                                    <option value="All">All Types</option>
                                    <option value="Unit Test">Unit Test</option>
                                    <option value="Mid-Sem">Mid-Sem</option>
                                    <option value="Practical">Practical</option>
                                    <option value="Viva">Viva</option>
                                </select>
                            </div>
                            <DataTable title="Examination Schedule" columns={scheduleColumns} data={filteredExams} isLoading={false} />
                        </div>
                    )}

                    {/* RESULTS */}
                    {activeTab === 'results' && (
                        <div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                                <button className="btn-primary" onClick={() => addToast({ type: 'success', title: 'Report Cards Generated', message: 'PDF report cards generated for all students.' })}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '9px 16px' }}>
                                    <FileText size={14} /> Generate Report Cards
                                </button>
                                <button className="btn-white" onClick={() => addToast({ type: 'info', title: 'Exporting...', message: 'Results exported to Excel.' })}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '9px 16px' }}>
                                    📊 Export to Excel
                                </button>
                            </div>
                            <DataTable title="Student Results" columns={resultsColumns} data={resultsList} isLoading={false} />
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>

            {/* Add Exam Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="glass-modal-overlay" onClick={() => setShowAddModal(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-modal-content"
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '17px', fontWeight: 700 }}>📅 Schedule New Examination</h2>
                                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><Trophy size={20} /></button>
                            </div>
                            <form onSubmit={handleAddExam}>
                                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Exam Name *</label>
                                            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Unit Test I"
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Exam Type</label>
                                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }}>
                                                <option>Unit Test</option>
                                                <option>Mid-Sem</option>
                                                <option>End-Sem</option>
                                                <option>Practical</option>
                                                <option>Viva</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Class *</label>
                                            <select value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))}
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }}>
                                                {mockClasses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Subject *</label>
                                            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Data Structures"
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Date *</label>
                                            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Time</label>
                                            <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Room</label>
                                            <input value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))}
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Max Marks</label>
                                            <input type="number" value={form.maxMarks} onChange={e => setForm(f => ({ ...f, maxMarks: +e.target.value }))}
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Examiner</label>
                                        <input value={form.examiner} onChange={e => setForm(f => ({ ...f, examiner: e.target.value }))} placeholder="Invigilator / Examiner name"
                                            style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} />
                                    </div>
                                </div>
                                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button type="button" className="btn-white" onClick={() => setShowAddModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Schedule Exam</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Admit Card Printable Modal */}
            <AnimatePresence>
                {selectedAdmitCard && (
                    <div className="glass-modal-overlay" onClick={() => setSelectedAdmitCard(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '15px', fontWeight: 700 }}>🪪 Printable Examination Admit Card</h2>
                                <button onClick={() => setSelectedAdmitCard(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '18px' }}>✕</button>
                            </div>
                            <div id="admit-card-print-area" style={{ padding: '32px', background: 'white', color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}>
                                <div style={{ border: '2px solid #1F5535', borderRadius: '12px', padding: '20px', position: 'relative' }}>
                                    {/* Watermark */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '48px', fontWeight: 800, color: 'rgba(31, 85, 53, 0.05)', pointerEvents: 'none', userSelect: 'none', letterSpacing: '2px' }}>TITUS SECURE</div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1F5535', paddingBottom: '12px', marginBottom: '16px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1F5535', margin: 0 }}>TITUS INSTITUTE OF TECHNOLOGY</h3>
                                            <span style={{ fontSize: '10px', color: '#666', fontWeight: 500 }}>ACADEMIC YEAR: 2026-2027</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ background: '#1F5535', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}>HALL TICKET</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', marginBottom: '16px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 12px', fontSize: '12px' }}>
                                            <span style={{ color: '#555', fontWeight: 600 }}>Candidate:</span>
                                            <strong style={{ color: '#1D1D1D' }}>Student (Demo Candidate)</strong>
                                            <span style={{ color: '#555', fontWeight: 600 }}>Class / Div:</span>
                                            <strong>{selectedAdmitCard.class}</strong>
                                            <span style={{ color: '#555', fontWeight: 600 }}>Roll Number:</span>
                                            <strong style={{ fontFamily: 'monospace' }}>TIT-2026-042</strong>
                                            <span style={{ color: '#555', fontWeight: 600 }}>Subject:</span>
                                            <strong style={{ color: '#1F5535' }}>{selectedAdmitCard.subject}</strong>
                                        </div>
                                        <div style={{ width: '80px', height: '80px', border: '1px solid #1F5535', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAF8' }}>
                                            <span style={{ fontSize: '24px' }}>🎓</span>
                                        </div>
                                    </div>

                                    <div style={{ border: '1px solid #EAEAEA', borderRadius: '6px', background: '#F8FAF8', padding: '12px', marginBottom: '16px', fontSize: '11px', lineHeight: '1.4' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                                            <div><strong>Date:</strong> {selectedAdmitCard.date}</div>
                                            <div><strong>Time:</strong> {selectedAdmitCard.time}</div>
                                            <div><strong>Duration:</strong> {selectedAdmitCard.duration}</div>
                                            <div><strong>Room Center:</strong> {selectedAdmitCard.room}</div>
                                            <div><strong>Invigilator:</strong> {selectedAdmitCard.examiner || 'Invigilator A'}</div>
                                            <div><strong>Exam Type:</strong> {selectedAdmitCard.type}</div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', fontSize: '11px' }}>
                                        <div style={{ textAlign: 'center', width: '120px' }}>
                                            <div style={{ borderBottom: '1px solid #D2D2D2', paddingBottom: '30px' }}></div>
                                            <div style={{ marginTop: '4px', color: '#666', fontSize: '9px' }}>Candidate Signature</div>
                                        </div>
                                        <div style={{ textAlign: 'center', width: '120px' }}>
                                            <div style={{ borderBottom: '1px solid #D2D2D2', paddingBottom: '30px', fontWeight: 600, color: '#1F5535', fontSize: '10px' }}>Dr. A. Rao</div>
                                            <div style={{ marginTop: '4px', color: '#666', fontSize: '9px' }}>Controller of Exams</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" className="btn-white" onClick={() => setSelectedAdmitCard(null)}>Close</button>
                                <button type="button" className="btn-primary" onClick={() => window.print()}>🖨️ Print Admit Card</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Report Card Printable Modal */}
            <AnimatePresence>
                {selectedReportCard && (
                    <div className="glass-modal-overlay" onClick={() => setSelectedReportCard(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '15px', fontWeight: 700 }}>📄 Printable Academic Report Card</h2>
                                <button onClick={() => setSelectedReportCard(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '18px' }}>✕</button>
                            </div>
                            <div id="report-card-print-area" style={{ padding: '32px', background: 'white', color: '#1D1D1D', fontFamily: 'Inter, sans-serif' }}>
                                <div style={{ border: '2px solid #3B82F6', borderRadius: '12px', padding: '24px', position: 'relative' }}>
                                    {/* Watermark */}
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)', fontSize: '48px', fontWeight: 800, color: 'rgba(59, 130, 246, 0.05)', pointerEvents: 'none', userSelect: 'none', letterSpacing: '2px' }}>TITUS GRADE REPORT</div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #3B82F6', paddingBottom: '12px', marginBottom: '20px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#3B82F6', margin: 0 }}>TITUS INSTITUTE OF TECHNOLOGY</h3>
                                            <span style={{ fontSize: '10px', color: '#666', fontWeight: 500 }}>ACADEMIC TRANSCRIPT • OFFICIAL GRADE CARD</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ background: '#3B82F6', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>TERM REPORT</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: '12px', marginBottom: '24px', background: '#F8FAFC', padding: '14px', borderRadius: '8px' }}>
                                        <div><span style={{ color: '#555' }}>Student Name:</span> <strong>{selectedReportCard.studentName}</strong></div>
                                        <div><span style={{ color: '#555' }}>Class ID:</span> <strong>{selectedReportCard.class}</strong></div>
                                        <div><span style={{ color: '#555' }}>Roll ID:</span> <strong style={{ fontFamily: 'monospace' }}>TIT-2026-{selectedReportCard.id?.slice(-3) || '078'}</strong></div>
                                        <div><span style={{ color: '#555' }}>Date of Issue:</span> <strong>{new Date().toLocaleDateString('en-IN')}</strong></div>
                                    </div>

                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '20px' }}>
                                        <thead>
                                            <tr style={{ background: '#3B82F615', color: '#3B82F6', fontWeight: 700 }}>
                                                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #3B82F630' }}>Subject Component</th>
                                                <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #3B82F630' }}>Max Marks</th>
                                                <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #3B82F630' }}>Marks Obtained</th>
                                                <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #3B82F630' }}>Letter Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid #EAEAEA' }}>
                                                <td style={{ padding: '8px', fontWeight: 600 }}>{selectedReportCard.subject}</td>
                                                <td style={{ padding: '8px', textAlign: 'center' }}>{selectedReportCard.maxMarks}</td>
                                                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 700 }}>{selectedReportCard.marksObtained}</td>
                                                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 800, color: '#3B82F6' }}>{selectedReportCard.grade}</td>
                                            </tr>
                                            {/* Mock supplementary subjects */}
                                            <tr style={{ borderBottom: '1px solid #EAEAEA' }}>
                                                <td style={{ padding: '8px', fontWeight: 600 }}>Practical & Lab Viva</td>
                                                <td style={{ padding: '8px', textAlign: 'center' }}>50</td>
                                                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 700 }}>45</td>
                                                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 800, color: '#3B82F6' }}>A+</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #EAEAEA' }}>
                                                <td style={{ padding: '8px', fontWeight: 600 }}>Research Project & Seminar</td>
                                                <td style={{ padding: '8px', textAlign: 'center' }}>100</td>
                                                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 700 }}>88</td>
                                                <td style={{ padding: '8px', textAlign: 'center', fontWeight: 800, color: '#3B82F6' }}>A</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '12px', fontSize: '11px', marginBottom: '24px' }}>
                                        <strong>Class Teacher Remarks:</strong>
                                        <p style={{ margin: '4px 0 0', color: '#555', fontStyle: 'italic' }}>"{selectedReportCard.remarks || 'Excellent academic focus. Active participant in laboratory experiments. Keep up the high standard.'}"</p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', fontSize: '11px' }}>
                                        <div style={{ textAlign: 'center', width: '130px' }}>
                                            <div style={{ borderBottom: '1px solid #D2D2D2', paddingBottom: '30px' }}></div>
                                            <div style={{ marginTop: '4px', color: '#666', fontSize: '9px' }}>Class Teacher Signature</div>
                                        </div>
                                        <div style={{ textAlign: 'center', width: '130px' }}>
                                            <div style={{ borderBottom: '1px solid #D2D2D2', paddingBottom: '30px', fontWeight: 600, color: '#3B82F6', fontSize: '10px' }}>Prof. S. Kumar</div>
                                            <div style={{ marginTop: '4px', color: '#666', fontSize: '9px' }}>Principal & Dean</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" className="btn-white" onClick={() => setSelectedReportCard(null)}>Close</button>
                                <button type="button" className="btn-primary" onClick={() => window.print()}>🖨️ Print Report Card</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Exams;

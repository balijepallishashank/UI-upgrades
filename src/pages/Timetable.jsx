import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CalendarDays, Users, BookOpen, AlertTriangle, Save, Copy, 
    Printer, FileDown, Plus, Trash2, ChevronDown, CheckCircle2
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import KPICard from '../components/KPICard';
import Drawer from '../components/Drawer';
import { useToast } from '../contexts/ToastContext';
import { mockClasses, mockTimetableData, mockEmployees } from '../mockData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIOD_COLORS = [
    'rgba(67,97,238,0.08)', 'rgba(6,214,160,0.08)', 'rgba(247,37,133,0.08)',
    'rgba(255,209,102,0.08)', 'rgba(123,47,247,0.08)', 'rgba(0,150,199,0.08)',
    'rgba(239,35,60,0.08)', 'rgba(67,97,238,0.08)'
];

const Timetable = () => {
    const { addToast } = useToast();
    const [selectedClass, setSelectedClass] = useState('CS-A');
    const [selectedYear, setSelectedYear] = useState('2026-27');
    const [numPeriods, setNumPeriods] = useState(6);
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [copyTarget, setCopyTarget] = useState(null);
    
    // Active editing cell state
    const [activeEditCell, setActiveEditCell] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);

    // Build initial timetable state from mockData
    const buildEmpty = () => DAYS.map(day => Array.from({ length: numPeriods }, () => ({ subject: '', teacher: '', alt: '' })));

    const initTimetable = () => {
        const data = mockTimetableData[selectedClass];
        if (data) {
            return DAYS.map(day => {
                const dayData = data[day] || [];
                return Array.from({ length: numPeriods }, (_, pi) => dayData[pi] || { subject: '', teacher: '', alt: '' });
            });
        }
        return buildEmpty();
    };

    const [timetable, setTimetable] = useState(initTimetable);

    const teachers = mockEmployees.slice(0, 12).map(e => e.name);

    const updateCell = (dayIdx, periodIdx, field, value) => {
        setTimetable(prev => {
            const updated = prev.map(row => [...row.map(cell => ({ ...cell }))]);
            updated[dayIdx][periodIdx][field] = value;
            return updated;
        });
    };

    // Conflict detection: same teacher in 2+ periods on same day
    const hasConflict = (dayIdx, periodIdx) => {
        const cell = timetable[dayIdx][periodIdx];
        if (!cell.teacher) return false;
        const dayRow = timetable[dayIdx];
        const matches = dayRow.filter((c, pi) => pi !== periodIdx && c.teacher === cell.teacher && c.teacher !== '');
        return matches.length > 0;
    };

    const conflicts = DAYS.reduce((acc, _, di) => {
        for (let pi = 0; pi < numPeriods; pi++) {
            if (hasConflict(di, pi)) acc++;
        }
        return acc;
    }, 0) / 2; // divide by 2 since each conflict pair counts twice

    const filledCells = timetable.flat().filter(c => c.subject).length;
    const uniqueSubjects = new Set(timetable.flat().map(c => c.subject).filter(Boolean)).size;
    const assignedTeachers = new Set(timetable.flat().map(c => c.teacher).filter(Boolean)).size;

    const addPeriod = () => {
        if (numPeriods >= 10) return;
        setNumPeriods(p => p + 1);
        setTimetable(prev => prev.map(row => [...row, { subject: '', teacher: '', alt: '' }]));
    };

    const deletePeriod = (periodIdx) => {
        if (numPeriods <= 1) return;
        setNumPeriods(p => p - 1);
        setTimetable(prev => prev.map(row => row.filter((_, i) => i !== periodIdx)));
    };

    const handleSave = () => {
        addToast({ type: 'success', title: 'Timetable Saved', message: `Timetable for ${selectedClass} (${selectedYear}) saved successfully.` });
    };

    const handleExportPDF = () => {
        addToast({ type: 'info', title: 'PDF Export', message: `Generating PDF timetable for ${selectedClass}...` });
    };

    const handleCopy = () => {
        if (!copyTarget) return;
        addToast({ type: 'success', title: 'Timetable Copied', message: `Timetable copied from ${copyTarget} to ${selectedClass}.` });
        setShowCopyModal(false);
        setCopyTarget(null);
    };

    const handleClassChange = (cls) => {
        setSelectedClass(cls);
        const data = mockTimetableData[cls];
        if (data) {
            setTimetable(DAYS.map(day => {
                const dayData = data[day] || [];
                return Array.from({ length: numPeriods }, (_, pi) => dayData[pi] || { subject: '', teacher: '', alt: '' });
            }));
        } else {
            setTimetable(buildEmpty());
        }
    };

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📅</span> Timetable Manager
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Design and manage weekly class schedules, assign teachers per period, detect conflicts.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn-white" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', fontSize: '13px' }} onClick={() => setShowCopyModal(true)}>
                        <Copy size={15} /> Copy from Class
                    </button>
                    <button className="btn-white" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', fontSize: '13px' }} onClick={handleExportPDF}>
                        <FileDown size={15} /> Export PDF
                    </button>
                    <button className="btn-white" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', fontSize: '13px' }} onClick={() => window.print()}>
                        <Printer size={15} /> Print
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', fontSize: '13px' }} onClick={handleSave}>
                        <Save size={15} /> Save Timetable
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <KPICard title="Periods Filled" value={filledCells} icon={CalendarDays} color="#3B82F6" subtext={`of ${DAYS.length * numPeriods} total slots`} />
                <KPICard title="Unique Subjects" value={uniqueSubjects} icon={BookOpen} color="#22C55E" subtext="Across all periods" />
                <KPICard title="Teachers Assigned" value={assignedTeachers} icon={Users} color="#8B5CF6" subtext="Unique allocations" />
                <KPICard title="Conflicts" value={Math.floor(conflicts)} icon={AlertTriangle} color={conflicts > 0 ? '#EF4444' : '#22C55E'} subtext={conflicts > 0 ? 'Same teacher double-booked' : 'No conflicts detected'} />
            </div>

            {/* Control Bar */}
            <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Year</label>
                        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
                            style={{ padding: '9px 14px', borderRadius: '8px', border: '2px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px', fontWeight: 600, minWidth: '130px', cursor: 'pointer' }}>
                            <option>2026-27</option>
                            <option>2025-26</option>
                            <option>2024-25</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Class / Section</label>
                        <select value={selectedClass} onChange={e => handleClassChange(e.target.value)}
                            style={{ padding: '9px 14px', borderRadius: '8px', border: '2px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px', fontWeight: 600, minWidth: '130px', cursor: 'pointer' }}>
                            {mockClasses.map(cls => (
                                <option key={cls.id} value={cls.name}>{cls.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Periods per day:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-color)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border-color)' }}>
                            <button onClick={() => numPeriods > 1 && setNumPeriods(p => { setTimetable(prev => prev.map(r => r.slice(0, p - 1))); return p - 1; })}
                                style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'var(--card-white)', cursor: 'pointer', fontWeight: 700, fontSize: '16px' }}>−</button>
                            <span style={{ fontSize: '15px', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{numPeriods}</span>
                            <button onClick={addPeriod}
                                style={{ width: '28px', height: '28px', borderRadius: '6px', border: 'none', background: 'var(--primary-green)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '16px' }}>+</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timetable Grid */}
            <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700 }}>📅 Weekly Timetable</span>
                        <span style={{ background: 'var(--primary-light)', color: 'var(--primary-green)', fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px' }}>{selectedClass} • {selectedYear}</span>
                        {conflicts > 0 && (
                            <span style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={12} /> {Math.floor(conflicts)} Conflict{conflicts !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <button onClick={addPeriod} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', border: '1.5px dashed var(--border-color)', background: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--primary-green)' }}>
                        <Plus size={14} /> Add Period
                    </button>
                </div>
                <div style={{ overflowX: 'auto', padding: '16px 20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '100px', textAlign: 'left', padding: '10px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'linear-gradient(135deg, var(--primary-green), var(--primary-dark))', color: '#fff', borderRadius: '10px 0 0 0' }}>Day</th>
                                {Array.from({ length: numPeriods }, (_, pi) => (
                                    <th key={pi} style={{ padding: '8px 6px', textAlign: 'center', background: '#f7f9ff' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--primary-green), var(--primary-dark))', color: '#fff', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>
                                                P{pi + 1}
                                            </span>
                                            <button onClick={() => deletePeriod(pi)}
                                                style={{ fontSize: '10px', fontWeight: 700, color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}>
                                                ✕ Del
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {DAYS.map((day, di) => (
                                <tr key={day} style={{ borderBottom: di < DAYS.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                    <td style={{ padding: '8px 6px', verticalAlign: 'middle' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--primary-light)', borderRadius: '10px', padding: '10px 8px', minWidth: '80px' }}>
                                            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary-green)' }}>{day.slice(0, 3).toUpperCase()}</span>
                                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>{day.slice(3)}</span>
                                        </div>
                                    </td>
                                    {Array.from({ length: numPeriods }, (_, pi) => {
                                        const cell = timetable[di]?.[pi] || { subject: '', teacher: '', alt: '' };
                                        const conflict = hasConflict(di, pi);
                                        const hasData = cell.subject || cell.teacher;
                                        return (
                                            <td key={pi} style={{ padding: '6px' }}>
                                                <div 
                                                    onClick={() => {
                                                        setActiveEditCell({
                                                            dayIdx: di,
                                                            periodIdx: pi,
                                                            subject: cell.subject,
                                                            teacher: cell.teacher,
                                                            alt: cell.alt
                                                        });
                                                        setShowDrawer(true);
                                                    }}
                                                    style={{
                                                        background: conflict ? 'rgba(239,68,68,0.06)' : hasData ? PERIOD_COLORS[pi % PERIOD_COLORS.length] : 'var(--bg-color)',
                                                        border: `1.5px solid ${conflict ? '#EF4444' : hasData ? 'rgba(163,217,92,0.4)' : 'var(--border-color)'}`,
                                                        borderRadius: '12px', 
                                                        padding: '12px', 
                                                        minWidth: '148px', 
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '6px',
                                                        minHeight: '86px',
                                                        justifyContent: 'center'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-green)'}
                                                    onMouseLeave={e => e.currentTarget.style.borderColor = conflict ? '#EF4444' : hasData ? 'rgba(163,217,92,0.4)' : 'var(--border-color)'}
                                                >
                                                    {conflict && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#EF4444', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>
                                                            <AlertTriangle size={10} /> Conflict
                                                        </div>
                                                    )}
                                                    {cell.subject ? (
                                                        <>
                                                            <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cell.subject}</strong>
                                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                👤 {cell.teacher || 'No Teacher'}
                                                            </span>
                                                            {cell.alt && (
                                                                <span style={{ fontSize: '9px', background: '#faf5ff', color: '#6d28d9', padding: '2px 6px', borderRadius: '4px', alignSelf: 'flex-start', fontWeight: 700, border: '1px solid #e9d5ff' }}>
                                                                    Alt: {cell.alt}
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                                                            ➕ Add Slot
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Legend:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(163,217,92,0.3)', border: '1px solid rgba(163,217,92,0.5)' }} />
                    Period filled
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }} />
                    Teacher conflict
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#faf5ff', border: '1.5px dashed #c4b5fd' }} />
                    Alt / Substitute
                </div>
            </div>

            {/* Copy Timetable Modal */}
            <AnimatePresence>
                {showCopyModal && (
                    <div className="glass-modal-overlay" onClick={() => setShowCopyModal(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-modal-content"
                            style={{ maxWidth: '460px' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
                                <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Copy Timetable from Another Class</h2>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Select a class to copy its timetable into <strong>{selectedClass}</strong></p>
                            </div>
                            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {mockClasses.filter(c => c.name !== selectedClass).map(cls => (
                                    <div key={cls.id} onClick={() => setCopyTarget(cls.name)}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', border: `2px solid ${copyTarget === cls.name ? 'var(--primary-green)' : 'var(--border-color)'}`, background: copyTarget === cls.name ? 'var(--primary-light)' : 'var(--bg-color)', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <div>
                                            <strong style={{ fontSize: '14px' }}>{cls.name}</strong>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{cls.stream} • CT: {cls.teacher}</div>
                                        </div>
                                        {copyTarget === cls.name && <CheckCircle2 size={18} color="var(--primary-green)" />}
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button className="btn-white" onClick={() => setShowCopyModal(false)}>Cancel</button>
                                <button className="btn-primary" onClick={handleCopy} disabled={!copyTarget}>Copy Timetable</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Configure Period Drawer */}
            <Drawer 
                isOpen={showDrawer} 
                onClose={() => {
                    setShowDrawer(false);
                    setActiveEditCell(null);
                }} 
                title={`Configure Period Slot`}
            >
                {activeEditCell && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 4px' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Slot Reference</span>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', background: 'var(--bg-color)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                {DAYS[activeEditCell.dayIdx]} • Period {activeEditCell.periodIdx + 1} ({selectedClass})
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Subject Name</label>
                            <input 
                                type="text"
                                placeholder="e.g. Mathematics, Physics, Chemistry..."
                                value={activeEditCell.subject}
                                onChange={e => setActiveEditCell(prev => ({ ...prev, subject: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--card-white)', fontSize: '13px', color: 'var(--text-primary)', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Primary Teacher</label>
                            <select 
                                value={activeEditCell.teacher}
                                onChange={e => setActiveEditCell(prev => ({ ...prev, teacher: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--card-white)', fontSize: '13px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                            >
                                <option value="">— Assign Teacher —</option>
                                {teachers.map((t, ti) => <option key={ti} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Substitute / Alternate Teacher (Optional)</label>
                            <select 
                                value={activeEditCell.alt}
                                onChange={e => setActiveEditCell(prev => ({ ...prev, alt: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--card-white)', fontSize: '13px', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
                            >
                                <option value="">— No Substitute —</option>
                                {teachers.map((t, ti) => <option key={ti} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button 
                                className="btn-white"
                                onClick={() => {
                                    // Clear slot
                                    updateCell(activeEditCell.dayIdx, activeEditCell.periodIdx, 'subject', '');
                                    updateCell(activeEditCell.dayIdx, activeEditCell.periodIdx, 'teacher', '');
                                    updateCell(activeEditCell.dayIdx, activeEditCell.periodIdx, 'alt', '');
                                    setShowDrawer(false);
                                    setActiveEditCell(null);
                                    addToast({ type: 'info', title: 'Slot Cleared', message: 'The timetable period has been cleared.' });
                                }}
                                style={{ flex: 1, padding: '12px', borderColor: '#EF4444', color: '#EF4444', background: 'rgba(239,68,68,0.04)' }}
                            >
                                Clear Period
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={() => {
                                    // Save changes
                                    updateCell(activeEditCell.dayIdx, activeEditCell.periodIdx, 'subject', activeEditCell.subject);
                                    updateCell(activeEditCell.dayIdx, activeEditCell.periodIdx, 'teacher', activeEditCell.teacher);
                                    updateCell(activeEditCell.dayIdx, activeEditCell.periodIdx, 'alt', activeEditCell.alt);
                                    setShowDrawer(false);
                                    setActiveEditCell(null);
                                    addToast({ type: 'success', title: 'Period Configured', message: 'Successfully updated the slot schedule.' });
                                }}
                                style={{ flex: 2, padding: '12px' }}
                            >
                                Save Period
                            </button>
                        </div>
                    </div>
                )}
            </Drawer>
        </PageTransition>
    );
};

export default Timetable;

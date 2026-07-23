import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    School, Users, BookOpen, Plus, Edit2, 
    Trash2, TrendingUp, X
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import KPICard from '../components/KPICard';
import { useToast } from '../contexts/ToastContext';
import { mockClasses } from '../mockData';

const Classes = () => {
    const { addToast } = useToast();
    const [classes, setClasses] = useState(mockClasses);
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState({ name: '', section: 'A', stream: '', teacher: '', students: 0, performance: '80%' });



    const totalStudents = classes.reduce((a, c) => a + c.students, 0);
    const avgPerformance = classes.length ? Math.round(classes.reduce((a, c) => a + parseInt(c.performance), 0) / classes.length) : 0;

    const openEdit = (cls) => {
        setEditTarget(cls);
        setForm({ name: cls.name, section: cls.section, stream: cls.stream, teacher: cls.teacher, students: cls.students, performance: cls.performance });
        setShowModal(true);
    };

    const openAdd = () => {
        setEditTarget(null);
        setForm({ name: '', section: 'A', stream: '', teacher: '', students: 0, performance: '80%' });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        setClasses(prev => prev.filter(c => c.id !== id));
        addToast({ type: 'success', title: 'Class Removed', message: 'Class has been deleted.' });
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!form.name || !form.stream || !form.teacher) {
            addToast({ type: 'error', title: 'Missing Fields', message: 'Please fill in Name, Stream, and Class Teacher.' });
            return;
        }
        if (editTarget) {
            setClasses(prev => prev.map(c => c.id === editTarget.id ? { ...c, ...form } : c));
            addToast({ type: 'success', title: 'Class Updated', message: `${form.name} updated successfully.` });
        } else {
            const newClass = {
                id: `C${String(classes.length + 1).padStart(2, '0')}`,
                ...form,
                subjects: []
            };
            setClasses(prev => [...prev, newClass]);
            addToast({ type: 'success', title: 'Class Created', message: `${form.name} added successfully.` });
        }
        setShowModal(false);
    };

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🏫</span> Classes & Sections
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Manage class structure, assign class teachers, and view section-wise performance.
                    </p>
                </div>
                <button className="btn-primary" onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={15} /> Add New Class
                </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <KPICard title="Total Classes" value={classes.length} icon={School} color="#3B82F6" subtext="Active sections" />
                <KPICard title="Total Students" value={totalStudents} icon={Users} color="#22C55E" subtext="Enrolled across all" />
                <KPICard title="Avg Performance" value={`${avgPerformance}%`} icon={TrendingUp} color="#8B5CF6" subtext="Class average" />
                <KPICard title="Subjects Mapped" value={classes.reduce((a, c) => a + (c.subjects?.length || 0), 0)} icon={BookOpen} color="#F59E0B" subtext="Total subject slots" />
            </div>

            {/* Class Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
                {classes.map((cls, idx) => (
                    <motion.div key={cls.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                        className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        {/* Card Header */}
                        <div style={{ background: 'linear-gradient(135deg, var(--primary-green), var(--primary-dark))', padding: '16px 20px', color: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>{cls.name}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '2px' }}>{cls.stream} • Section {cls.section}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button onClick={() => openEdit(cls)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(cls.id)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer' }}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div style={{ padding: '16px 20px' }}>
                            {/* Stats Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                                <div style={{ textAlign: 'center', padding: '10px 6px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 800 }}>{cls.students}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>STUDENTS</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '10px 6px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 800 }}>{cls.subjects?.length || 0}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>SUBJECTS</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: '10px 6px', background: 'var(--bg-color)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '20px', fontWeight: 800, color: parseInt(cls.performance) >= 85 ? '#22C55E' : parseInt(cls.performance) >= 70 ? '#F59E0B' : '#EF4444' }}>{cls.performance}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>PERFORMANCE</div>
                                </div>
                            </div>

                            {/* Class Teacher */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'var(--bg-color)', borderRadius: '8px', marginBottom: '12px' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-green), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                                    {cls.teacher.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{cls.teacher}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Class Teacher</div>
                                </div>
                            </div>

                            {/* Subjects */}
                            {cls.subjects && cls.subjects.length > 0 && (
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Subjects</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {cls.subjects.map((subj, si) => (
                                            <span key={si} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', background: 'var(--primary-light)', color: 'var(--primary-green)', borderRadius: '4px' }}>{subj}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Add New Card */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: classes.length * 0.05 }}
                    onClick={openAdd}
                    style={{ border: '2px dashed var(--border-color)', borderRadius: '14px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '10px', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-green)'; e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary-green)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                    <Plus size={28} />
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Add New Class</span>
                </motion.div>
            </div>

            {/* Add / Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="glass-modal-overlay" onClick={() => setShowModal(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-modal-content"
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '17px', fontWeight: 700 }}>{editTarget ? `✏️ Edit ${editTarget.name}` : '🏫 Add New Class'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Class Name *</label>
                                            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. CS-A"
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Section</label>
                                            <select value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }}>
                                                {['A','B','C','D'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Stream / Department *</label>
                                            <input value={form.stream} onChange={e => setForm(f => ({ ...f, stream: e.target.value }))} placeholder="e.g. Computer Science"
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} required />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Class Teacher *</label>
                                            <input value={form.teacher} onChange={e => setForm(f => ({ ...f, teacher: e.target.value }))} placeholder="Full name of class teacher"
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} required />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Student Strength</label>
                                            <input type="number" value={form.students} onChange={e => setForm(f => ({ ...f, students: +e.target.value }))}
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Performance %</label>
                                            <input value={form.performance} onChange={e => setForm(f => ({ ...f, performance: e.target.value }))} placeholder="e.g. 88%"
                                                style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px' }} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button type="button" className="btn-white" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">{editTarget ? 'Save Changes' : 'Create Class'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Classes;

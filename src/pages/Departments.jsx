import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Briefcase, Trash2, X, Plus } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { mockDepartments, mockEmployees } from '../mockData';
import AnimatedNumber from '../components/AnimatedNumber';
import { useToast } from '../contexts/ToastContext';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const CircularProgress = ({ percentage, color }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx="40" cy="40" r={radius}
                    stroke="var(--border-color)"
                    strokeWidth="6"
                    fill="transparent"
                />
                <motion.circle
                    cx="40" cy="40" r={radius}
                    stroke={color}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div style={{ position: 'absolute', fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                <AnimatedNumber value={percentage} />%
            </div>
        </div>
    );
};

const DepartmentCard = ({ dept, onViewDetails }) => (
    <motion.div 
        variants={itemVariants}
        className="card"
        style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
        whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{dept.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} /> {dept.employees || 0} Employees
                </p>
            </div>
            <CircularProgress percentage={dept.performance || 80} color="var(--primary-green)" />
        </div>

        <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Head of Department</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {dept.head ? dept.head.charAt(0) : 'D'}
                </div>
                <strong style={{ color: 'var(--text-primary)' }}>{dept.head || 'Not Assigned'}</strong>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={14} /> {dept.openPositions || 0} Open Positions
            </span>
            <button className="btn-white" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => onViewDetails(dept)}>View Details</button>
        </div>
    </motion.div>
);

const Departments = () => {
    const { addToast } = useToast();
    const [depts, setDepts] = useState(mockDepartments);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);

    // Form state
    const [form, setForm] = useState({
        name: '',
        head: '',
        employees: 5,
        performance: 90,
        openPositions: 0
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.head) {
            addToast({ type: 'error', title: 'Incomplete Form', message: 'Department Name and HOD are required.' });
            return;
        }

        const newDept = {
            id: `D${String(depts.length + 1).padStart(2, '0')}`,
            ...form,
            performance: parseInt(form.performance) || 85,
            employees: parseInt(form.employees) || 0,
            openPositions: parseInt(form.openPositions) || 0
        };

        setDepts(prev => [...prev, newDept]);
        setShowAddModal(false);
        setForm({ name: '', head: '', employees: 5, performance: 90, openPositions: 0 });
        addToast({ type: 'success', title: 'Department Created', message: `${newDept.name} added successfully.` });
    };

    const handleDeleteDept = (id, name) => {
        setDepts(prev => prev.filter(d => d.id !== id));
        setSelectedDept(null);
        addToast({ type: 'success', title: 'Department Deleted', message: `${name} has been removed from organization register.` });
    };

    // Filter employees belonging to the selected department
    const getDeptEmployees = (deptName) => {
        if (!deptName) return [];
        return mockEmployees.filter(emp => emp.department && emp.department.toLowerCase().includes(deptName.toLowerCase()));
    };

    return (
        <PageTransition>
            <div className="dashboard-header" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>🏢</span> Departments
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        Manage organizational structure and departmental performance.
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} /> Add Department
                </button>
            </div>
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}
            >
                {depts.map((dept) => (
                    <DepartmentCard key={dept.id} dept={dept} onViewDetails={setSelectedDept} />
                ))}
            </motion.div>

            {/* Add Department Modal Overlay */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)}
                        className="glass-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={e => e.stopPropagation()}
                            className="glass-modal-content" style={{ background: 'var(--card-white)', borderRadius: '20px', padding: '36px', maxWidth: '500px', width: '100%', boxShadow: 'var(--glass-shadow)', position: 'relative' }}>
                            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}>✕</button>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>🏢 Create New Department</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Define organizational parameters for the new institutional department.</p>
                            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Department Name *</label>
                                    <input type="text" placeholder="e.g. Mechanical Engineering" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Head of Department (HOD) *</label>
                                    <input type="text" placeholder="HOD Full Name" value={form.head} onChange={e => setForm({...form, head: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Open Positions</label>
                                        <input type="number" placeholder="0" value={form.openPositions} onChange={e => setForm({...form, openPositions: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Performance Rating (%)</label>
                                        <input type="number" min="0" max="100" placeholder="90" value={form.performance} onChange={e => setForm({...form, performance: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>Create Department</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Department Details Modal Overlay */}
            <AnimatePresence>
                {selectedDept && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDept(null)}
                        className="glass-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={e => e.stopPropagation()}
                            className="glass-modal-content" style={{ background: 'var(--card-white)', borderRadius: '20px', padding: '36px', maxWidth: '550px', width: '100%', boxShadow: 'var(--glass-shadow)', position: 'relative' }}>
                            <button onClick={() => setSelectedDept(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}>✕</button>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>🏢 {selectedDept.name}</h3>
                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Department Code: {selectedDept.id}</span>
                                </div>
                                <button className="btn-white" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                                    onClick={() => handleDeleteDept(selectedDept.id, selectedDept.name)}>
                                    <Trash2 size={13} /> Delete Department
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                                <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>HOD Leader</span>
                                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{selectedDept.head}</strong>
                                </div>
                                <div style={{ background: 'var(--bg-color)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>Open Vacancies</span>
                                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{selectedDept.openPositions} Positions</strong>
                                </div>
                            </div>

                            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>Simulated Employee Roster ({getDeptEmployees(selectedDept.name).length})</h4>
                            <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                                {getDeptEmployees(selectedDept.name).length > 0 ? (
                                    getDeptEmployees(selectedDept.name).map((emp, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={emp.avatar} alt={emp.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                                                <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{emp.name}</strong>
                                            </div>
                                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{emp.role}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px', padding: '20px 0' }}>No specific staff assigned to this department node yet.</div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Departments;

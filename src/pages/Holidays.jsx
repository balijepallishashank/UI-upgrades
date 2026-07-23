import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { mockHolidays } from '../mockData';
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

const HolidayCard = ({ holiday, onDelete }) => (
    <motion.div 
        variants={itemVariants}
        className="card"
        style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', background: 'rgba(255, 255, 255, 0.4)', position: 'relative' }}
        whileHover={{ y: -5, scale: 1.02, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', background: 'rgba(255, 255, 255, 0.8)' }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ fontSize: '48px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))' }}>
                {holiday.icon || '📅'}
            </div>
            <div>
                <p style={{ color: 'var(--primary-dark)', fontWeight: 700, fontSize: '14px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {holiday.date}
                </p>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {holiday.name}
                </h3>
                <span style={{ fontSize: '12px', padding: '4px 8px', background: 'var(--primary-green)', color: 'var(--card-white)', borderRadius: '20px', fontWeight: 500 }}>
                    {holiday.type}
                </span>
            </div>
        </div>
        
        <button 
            style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'var(--danger)', 
                opacity: 0.7,
                transition: 'opacity 0.2s',
                padding: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
            onClick={() => onDelete(holiday.id, holiday.name)}
            title="Remove Holiday"
        >
            <Trash2 size={18} />
        </button>
    </motion.div>
);

const Holidays = () => {
    const { addToast } = useToast();
    const [holidays, setHolidays] = useState(mockHolidays);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form inputs state
    const [form, setForm] = useState({
        date: '',
        name: '',
        type: 'Public Holiday',
        icon: '🏖️'
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!form.date || !form.name) {
            addToast({ type: 'error', title: 'Fields Missing', message: 'Date and Holiday Name are mandatory.' });
            return;
        }

        const newHoliday = {
            id: `H${String(holidays.length + 1).padStart(2, '0')}`,
            ...form,
            // Format date nicely if selected via date picker
            date: form.date.includes('-') 
                ? new Date(form.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                : form.date
        };

        setHolidays(prev => [...prev, newHoliday]);
        setShowAddModal(false);
        setForm({ date: '', name: '', type: 'Public Holiday', icon: '🏖️' });
        addToast({ type: 'success', title: 'Holiday Added', message: `"${newHoliday.name}" scheduled successfully.` });
    };

    const handleDelete = (id, name) => {
        setHolidays(prev => prev.filter(h => h.id !== id));
        addToast({ type: 'success', title: 'Holiday Deleted', message: `"${name}" removed from organizational calendar.` });
    };

    return (
        <PageTransition>
            <div className="dashboard-header" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>🏖️</span> Academic Holidays
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        Upcoming public and national holidays for 2026.
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} /> Add Holiday
                </button>
            </div>
            
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}
            >
                {holidays.map((holiday) => (
                    <HolidayCard key={holiday.id} holiday={holiday} onDelete={handleDelete} />
                ))}
            </motion.div>

            {/* Add Holiday Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)}
                        className="glass-modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={e => e.stopPropagation()}
                            className="glass-modal-content" style={{ background: 'var(--card-white)', borderRadius: '20px', padding: '36px', maxWidth: '460px', width: '100%', boxShadow: 'var(--glass-shadow)', position: 'relative' }}>
                            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}>✕</button>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>🏖️ Add Academic Holiday</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Register a public, national, or regional holiday on the calendar.</p>
                            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Holiday Name *</label>
                                    <input type="text" placeholder="e.g. Eid-ul-Fitr" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Holiday Date *</label>
                                        <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Representative Icon</label>
                                        <select value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                            {['🏖️', '🇮🇳', '🪔', '🎄', '🍂', '🎉', '🕌', '☸️', '🌸'].map(emoji => (
                                                <option key={emoji} value={emoji}>{emoji}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Holiday Type</label>
                                    <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                        <option>Public Holiday</option>
                                        <option>National Holiday</option>
                                        <option>Restricted Holiday</option>
                                        <option>Observance Day</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>Add Holiday</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Holidays;

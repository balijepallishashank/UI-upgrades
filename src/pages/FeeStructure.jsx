import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Save } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useToast } from '../contexts/ToastContext';

const FeeStructure = () => {
    const { addToast } = useToast();

    // 1. Tuition Fee State
    const [tuitionFees, setTuitionFees] = useState([
        { id: 'T1', class: '10TH', amount: 1500 },
        { id: 'T2', class: '9TH', amount: 1400 },
        { id: 'T3', class: 'LKG', amount: 1000 }
    ]);
    const [tuitionForm, setTuitionForm] = useState({ class: '10TH', amount: '' });
    const [editingTuitionId, setEditingTuitionId] = useState(null);

    // 2. Transport Fee State
    const [transportFees, setTransportFees] = useState([
        { id: 'TR1', location: 'BADIMAHISHOTHA', amount: 700 },
        { id: 'TR2', location: 'MEHMA', amount: 600 },
        { id: 'TR3', location: 'ARARIA', amount: 500 }
    ]);
    const [transportForm, setTransportForm] = useState({ location: '', amount: '' });
    const [editingTransportId, setEditingTransportId] = useState(null);

    // 3. Hostel Fee State
    const [hostelFees, setHostelFees] = useState([
        { id: 'H1', class: 'UKG', amount: 4000 },
        { id: 'H2', class: 'LKG', amount: 4000 },
        { id: 'H3', class: '1ST', amount: 4200 }
    ]);
    const [hostelForm, setHostelForm] = useState({ class: 'UKG', amount: '' });
    const [editingHostelId, setEditingHostelId] = useState(null);

    const classesList = ['LKG', 'UKG', '1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH', '9TH', '10TH', 'CS-A', 'CS-B', 'IT-A', 'IT-B'];

    // Tuition Actions
    const handleSaveTuition = (e) => {
        e.preventDefault();
        if (!tuitionForm.amount) return;
        const amountNum = parseFloat(tuitionForm.amount);

        if (editingTuitionId) {
            setTuitionFees(prev => prev.map(f => f.id === editingTuitionId ? { ...f, class: tuitionForm.class, amount: amountNum } : f));
            addToast({ type: 'success', title: 'Tuition Fee Updated', message: `Class ${tuitionForm.class} tuition fee adjusted to ₹${amountNum.toFixed(2)}.` });
            setEditingTuitionId(null);
        } else {
            if (tuitionFees.some(f => f.class === tuitionForm.class)) {
                addToast({ type: 'error', title: 'Duplicate Class', message: `Tuition fee for Class ${tuitionForm.class} already exists. Edit the existing one.` });
                return;
            }
            const newFee = { id: `T${Date.now()}`, class: tuitionForm.class, amount: amountNum };
            setTuitionFees(prev => [...prev, newFee]);
            addToast({ type: 'success', title: 'Tuition Fee Configured', message: `Class ${tuitionForm.class} tuition fee set to ₹${amountNum.toFixed(2)}.` });
        }
        setTuitionForm({ class: '10TH', amount: '' });
    };

    const handleEditTuition = (fee) => {
        setEditingTuitionId(fee.id);
        setTuitionForm({ class: fee.class, amount: fee.amount });
    };

    const handleDeleteTuition = (id, className) => {
        setTuitionFees(prev => prev.filter(f => f.id !== id));
        addToast({ type: 'info', title: 'Fee Deleted', message: `Tuition fee for Class ${className} removed.` });
    };

    // Transport Actions
    const handleSaveTransport = (e) => {
        e.preventDefault();
        if (!transportForm.location || !transportForm.amount) return;
        const amountNum = parseFloat(transportForm.amount);
        const locUpper = transportForm.location.trim().toUpperCase();

        if (editingTransportId) {
            setTransportFees(prev => prev.map(f => f.id === editingTransportId ? { ...f, location: locUpper, amount: amountNum } : f));
            addToast({ type: 'success', title: 'Transport Fee Updated', message: `Location ${locUpper} fee adjusted to ₹${amountNum.toFixed(2)}.` });
            setEditingTransportId(null);
        } else {
            if (transportFees.some(f => f.location.toUpperCase() === locUpper)) {
                addToast({ type: 'error', title: 'Duplicate Location', message: `Transport fee for ${locUpper} already exists.` });
                return;
            }
            const newFee = { id: `TR${Date.now()}`, location: locUpper, amount: amountNum };
            setTransportFees(prev => [...prev, newFee]);
            addToast({ type: 'success', title: 'Transport Fee Configured', message: `Location ${locUpper} fee set to ₹${amountNum.toFixed(2)}.` });
        }
        setTransportForm({ location: '', amount: '' });
    };

    const handleEditTransport = (fee) => {
        setEditingTransportId(fee.id);
        setTransportForm({ location: fee.location, amount: fee.amount });
    };

    const handleDeleteTransport = (id, locationName) => {
        setTransportFees(prev => prev.filter(f => f.id !== id));
        addToast({ type: 'info', title: 'Fee Deleted', message: `Transport fee for ${locationName} removed.` });
    };

    // Hostel Actions
    const handleSaveHostel = (e) => {
        e.preventDefault();
        if (!hostelForm.amount) return;
        const amountNum = parseFloat(hostelForm.amount);

        if (editingHostelId) {
            setHostelFees(prev => prev.map(f => f.id === editingHostelId ? { ...f, class: hostelForm.class, amount: amountNum } : f));
            addToast({ type: 'success', title: 'Hostel Fee Updated', message: `Class ${hostelForm.class} hostel fee adjusted to ₹${amountNum.toFixed(2)}.` });
            setEditingHostelId(null);
        } else {
            if (hostelFees.some(f => f.class === hostelForm.class)) {
                addToast({ type: 'error', title: 'Duplicate Class', message: `Hostel fee for Class ${hostelForm.class} already exists.` });
                return;
            }
            const newFee = { id: `H${Date.now()}`, class: hostelForm.class, amount: amountNum };
            setHostelFees(prev => [...prev, newFee]);
            addToast({ type: 'success', title: 'Hostel Fee Configured', message: `Class ${hostelForm.class} hostel fee set to ₹${amountNum.toFixed(2)}.` });
        }
        setHostelForm({ class: 'UKG', amount: '' });
    };

    const handleEditHostel = (fee) => {
        setEditingHostelId(fee.id);
        setHostelForm({ class: fee.class, amount: fee.amount });
    };

    const handleDeleteHostel = (id, className) => {
        setHostelFees(prev => prev.filter(f => f.id !== id));
        addToast({ type: 'info', title: 'Fee Deleted', message: `Hostel fee for Class ${className} removed.` });
    };

    return (
        <PageTransition>
            <div className="dashboard-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>💳</span> Fee Structure Management
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Adjust and configure class-wise tuition fees, transport location dues, and hostel fee settings.
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                
                {/* 1. Tuition Fee Card */}
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--primary-dark)', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', margin: 0 }}>
                        Tuition Fee Management
                    </h2>
                    
                    <form onSubmit={handleSaveTuition} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Select Class</label>
                            <select 
                                value={tuitionForm.class}
                                onChange={e => setTuitionForm({ ...tuitionForm, class: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', outline: 'none' }}
                            >
                                {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Monthly Tuition Fee (₹)</label>
                            <input 
                                type="number" 
                                placeholder="Enter amount (e.g. 1500)"
                                value={tuitionForm.amount}
                                onChange={e => setTuitionForm({ ...tuitionForm, amount: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', outline: 'none' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Save size={14} /> {editingTuitionId ? 'Update Tuition Fee' : 'Save Tuition Fee'}
                        </button>
                    </form>

                    <div>
                        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Existing Tuition Fees</h3>
                        <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                        <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>Class</th>
                                        <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>Monthly Fee</th>
                                        <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tuitionFees.map(fee => (
                                        <tr key={fee.id} style={{ borderBottom: '1px solid var(--border-color)', hover: { background: 'var(--bg-color)' } }}>
                                            <td style={{ padding: '10px 14px', fontWeight: 600 }}>{fee.class}</td>
                                            <td style={{ padding: '10px 14px' }}>₹{fee.amount.toFixed(2)}</td>
                                            <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleEditTuition(fee)} style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', cursor: 'pointer', padding: '4px' }}><Edit size={14} /></button>
                                                    <button onClick={() => handleDeleteTuition(fee.id, fee.class)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 2. Transport Fee Card */}
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--primary-dark)', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', margin: 0 }}>
                        Transport Fee Management
                    </h2>
                    
                    <form onSubmit={handleSaveTransport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>City/Village Name</label>
                            <input 
                                type="text"
                                placeholder="Enter location name"
                                value={transportForm.location}
                                onChange={e => setTransportForm({ ...transportForm, location: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Monthly Transport Fee (₹)</label>
                            <input 
                                type="number" 
                                placeholder="Enter transport fee"
                                value={transportForm.amount}
                                onChange={e => setTransportForm({ ...transportForm, amount: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', outline: 'none' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Save size={14} /> {editingTransportId ? 'Update Transport Fee' : 'Save Transport Fee'}
                        </button>
                    </form>

                    <div>
                        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Existing Transport Fees</h3>
                        <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                        <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>City/Village</th>
                                        <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>Monthly Fee</th>
                                        <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transportFees.map(fee => (
                                        <tr key={fee.id} style={{ borderBottom: '1px solid var(--border-color)', hover: { background: 'var(--bg-color)' } }}>
                                            <td style={{ padding: '10px 14px', fontWeight: 600 }}>{fee.location}</td>
                                            <td style={{ padding: '10px 14px' }}>₹{fee.amount.toFixed(2)}</td>
                                            <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleEditTransport(fee)} style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', cursor: 'pointer', padding: '4px' }}><Edit size={14} /></button>
                                                    <button onClick={() => handleDeleteTransport(fee.id, fee.location)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 3. Hostel Fee Card */}
                <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--primary-dark)', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', margin: 0 }}>
                        Hostel Fee Management
                    </h2>
                    
                    <form onSubmit={handleSaveHostel} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Select Class</label>
                            <select 
                                value={hostelForm.class}
                                onChange={e => setHostelForm({ ...hostelForm, class: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', outline: 'none' }}
                            >
                                {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Monthly Hostel Fee (₹)</label>
                            <input 
                                type="number" 
                                placeholder="Enter hostel fee"
                                value={hostelForm.amount}
                                onChange={e => setHostelForm({ ...hostelForm, amount: e.target.value })}
                                required
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', outline: 'none' }}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Save size={14} /> {editingHostelId ? 'Update Hostel Fee' : 'Save Hostel Fee'}
                        </button>
                    </form>

                    <div>
                        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Existing Hostel Fees</h3>
                        <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                        <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>Class</th>
                                        <th style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>Monthly Fee</th>
                                        <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hostelFees.map(fee => (
                                        <tr key={fee.id} style={{ borderBottom: '1px solid var(--border-color)', hover: { background: 'var(--bg-color)' } }}>
                                            <td style={{ padding: '10px 14px', fontWeight: 600 }}>{fee.class}</td>
                                            <td style={{ padding: '10px 14px' }}>₹{fee.amount.toFixed(2)}</td>
                                            <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => handleEditHostel(fee)} style={{ background: 'none', border: 'none', color: 'var(--primary-dark)', cursor: 'pointer', padding: '4px' }}><Edit size={14} /></button>
                                                    <button onClick={() => handleDeleteHostel(fee.id, fee.class)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </PageTransition>
    );
};

export default FeeStructure;

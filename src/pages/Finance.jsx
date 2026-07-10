import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    IndianRupee, TrendingUp, Users, AlertCircle, Edit, Trash2, 
    Download, Filter, Search, RefreshCw, Send, ClipboardCheck, ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import DataTable from '../components/DataTable';
import AnimatedNumber from '../components/AnimatedNumber';
import Badge from '../components/Badge';
import { useToast } from '../contexts/ToastContext';
import { mockFinanceDueList, mockFeeStructure, mockFeeTransactions, collectionTrendData, mockScholarships } from '../mockData';

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

const Finance = () => {
    const location = useLocation();
    const { addToast } = useToast();
    
    const [activeTab, setActiveTab] = useState('overview');
    const [ledgerSearch, setLedgerSearch] = useState('');
    const [duesSearch, setDuesSearch] = useState('');
    const [showCollectModal, setShowCollectModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(null);
    const [collectForm, setCollectForm] = useState({ student: '', class: '', category: 'Tuition Fee', amount: '', method: 'Cash' });

    useEffect(() => {
        if (location.state?.tab) {
            let targetTab = location.state.tab;
            if (targetTab === 'duelist') {
                targetTab = 'dues';
            }
            setActiveTab(targetTab);
            if (location.state.search) {
                if (targetTab === 'dues') {
                    setDuesSearch(location.state.search);
                } else if (targetTab === 'ledger') {
                    setLedgerSearch(location.state.search);
                }
            }
        }
    }, [location]);

    const sendReminder = (student, amount) => {
        addToast({ 
            type: 'success', 
            title: 'SMS Sent', 
            message: `Defaulter notice dispatched to parent of ${student} for ${amount}.` 
        });
    };

    const mainTabs = [
        { id: 'overview', label: '📊 Overview' },
        { id: 'ledger', label: '📋 Transactions' },
        { id: 'dues', label: '⚠️ Fee Dues' },
        { id: 'analytics', label: '📈 Analytics' }
    ];

    const handleCollectSubmit = (e) => {
        e.preventDefault();
        if (!collectForm.student || !collectForm.amount) { addToast({ type: 'error', title: 'Incomplete', message: 'Fill all required fields.' }); return; }
        const receipt = { ...collectForm, id: `RCT-${Date.now().toString().slice(-6)}`, date: new Date().toLocaleDateString('en-IN'), status: 'Paid' };
        setShowCollectModal(false);
        setShowReceiptModal(receipt);
        addToast({ type: 'success', title: 'Payment Recorded', message: `₹${collectForm.amount} collected from ${collectForm.student}. Receipt generated.` });
        setCollectForm({ student: '', class: '', category: 'Tuition Fee', amount: '', method: 'Cash' });
    };

    const duesColumns = [
        { header: 'Invoice ID', accessor: 'id' },
        { header: 'Student Name', accessor: 'student', render: (row) => <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{row.student}</strong> },
        { header: 'Class', accessor: 'class' },
        { header: 'Fee Category', accessor: 'category' },
        { header: 'Amount Due', accessor: 'amount', render: (row) => <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{row.amount}</span> },
        { header: 'Due Date', accessor: 'dueDate' },
        { header: 'Status', accessor: 'status', render: (row) => <Badge type={row.status === 'Pending' ? 'Warning' : row.status === 'Overdue' ? 'Absent' : 'Success'} text={row.status} /> },
        { header: 'Actions', accessor: 'action', render: (row) => (
            <button className="btn-white" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => sendReminder(row.student, row.amount)}>
                Remind
            </button>
        ) }
    ];

    const transactionColumns = [
        { header: 'Transaction ID', accessor: 'id' },
        { header: 'Student Name', accessor: 'student', render: (row) => <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{row.student}</strong> },
        { header: 'Class', accessor: 'class' },
        { header: 'Description', accessor: 'desc' },
        { header: 'Amount Paid', accessor: 'amount', render: (row) => <span style={{ color: 'var(--primary-green)', fontWeight: 600 }}>₹{row.amount.toLocaleString('en-IN')}</span> },
        { header: 'Gateway Method', accessor: 'method' },
        { header: 'Payment Date', accessor: 'date' }
    ];

    // Filtered data based on search params
    const filteredDues = mockFinanceDueList.filter(d => 
        d.student.toLowerCase().includes(duesSearch.toLowerCase())
    );

    const filteredLedger = mockFeeTransactions.filter(t => 
        t.student.toLowerCase().includes(ledgerSearch.toLowerCase())
    );

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>💰</span> Finance Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Record offline collections, adjust institutional fee structures, audit ledgers, and trigger automated reminders.
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setShowCollectModal(true)}>
                    💳 Collect Fee
                </button>
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
                            {/* KPI Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <KPICard title="Outstanding Amount" value="₹4.2L" icon={AlertCircle} color="#EF4444" subtext="152 Defaulters outstanding" />
                                <KPICard title="Collected Today" value="₹82,500" icon={IndianRupee} color="#22C55E" subtext="Reconciled via 4 gateways" />
                                <KPICard title="Total Transactions" value={1240} icon={TrendingUp} color="#3B82F6" subtext="Academic Year 2026-27" />
                                <KPICard title="Monthly Revenue Goal" value="₹18.4L" icon={Users} color="#8B5CF6" subtext="92% of target collected" />
                            </div>

                             {/* Charts split */}
                             <div className="responsive-split-grid">
                                {/* Area Chart */}
                                <div className="card" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Collection Trend (July 2026)</h3>
                                    <div style={{ height: '240px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={collectionTrendData}>
                                                <defs>
                                                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                                                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--glass-shadow)' }} />
                                                <Area type="monotone" dataKey="amount" name="Collections (₹)" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Mini Table Recent Transactions */}
                                <div className="card" style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Recent Payments</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {mockFeeTransactions.slice(0, 4).map((tx, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: idx < 3 ? '1px solid var(--border-color)' : 'none' }}>
                                                <div>
                                                    <strong style={{ display: 'block', fontSize: '12px' }}>{tx.student}</strong>
                                                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{tx.desc}</span>
                                                </div>
                                                <span style={{ fontWeight: 600, color: 'var(--primary-green)', fontSize: '12px' }}>+₹{tx.amount.toLocaleString('en-IN')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. TRANSACTIONS & LEDGER */}
                    {activeTab === 'ledger' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Search Filter Bar */}
                            <div className="card" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Search size={18} color="var(--text-secondary)" />
                                <input 
                                    type="text" 
                                    placeholder="Filter by Student Name..." 
                                    value={ledgerSearch} 
                                    onChange={(e) => setLedgerSearch(e.target.value)}
                                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: 'var(--text-primary)' }}
                                />
                                {ledgerSearch && (
                                    <button onClick={() => setLedgerSearch('')} style={{ padding: '4px 8px', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>Clear</button>
                                )}
                            </div>

                            <DataTable 
                                title="Transaction Ledger Stream"
                                columns={transactionColumns}
                                data={filteredLedger}
                                isLoading={false}
                            />
                        </div>
                    )}

                    {/* 3. FEE DUES & STRUCTURE */}
                    {activeTab === 'dues' && (
                         <div className="responsive-split-grid">
                            {/* Dues List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="card" style={{ padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <Search size={18} color="var(--text-secondary)" />
                                    <input 
                                        type="text" 
                                        placeholder="Search Defaulter Name..." 
                                        value={duesSearch} 
                                        onChange={(e) => setDuesSearch(e.target.value)}
                                        style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '13px' }}
                                    />
                                    {duesSearch && (
                                        <button onClick={() => setDuesSearch('')} style={{ padding: '4px 8px', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>Clear</button>
                                    )}
                                </div>
                                <DataTable 
                                    title="Student Outstanding Dues"
                                    columns={duesColumns}
                                    data={filteredDues}
                                    isLoading={false}
                                />
                            </div>

                            {/* Fee Structure */}
                            <div className="card" style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Configured Fee Categories</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {mockFeeStructure.map((fee, idx) => (
                                        <div key={idx} style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-color)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <strong style={{ fontSize: '13px' }}>{fee.category}</strong>
                                                <Badge type={fee.mandatory ? 'Success' : 'Warning'} text={fee.mandatory ? 'Mandatory' : 'Optional'} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary-dark)' }}>{fee.amount}</span>
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{fee.frequency}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. REPORTS & ANALYTICS + SCHOLARSHIPS */}
                    {activeTab === 'analytics' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Expected vs Actual Fee Collections (Last 6 Months)</h3>
                                <div style={{ height: '240px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { month: 'Jan', Expected: 120000, Actual: 110000 },
                                            { month: 'Feb', Expected: 150000, Actual: 145000 },
                                            { month: 'Mar', Expected: 180000, Actual: 180000 },
                                            { month: 'Apr', Expected: 200000, Actual: 190000 },
                                            { month: 'May', Expected: 220000, Actual: 215000 },
                                            { month: 'Jun', Expected: 250000, Actual: 248000 }
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--glass-shadow)' }} />
                                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                                            <Bar dataKey="Expected" fill="var(--primary-dark)" radius={[3, 3, 0, 0]} />
                                            <Bar dataKey="Actual" fill="var(--primary-green)" radius={[3, 3, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Scholarships Section */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600 }}>🎓 Scholarship Programs</h3>
                                    <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }} onClick={() => addToast({ type: 'success', title: 'Scholarship Saved', message: 'New scholarship scheme added.' })}>
                                        + New Scholarship
                                    </button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                    {mockScholarships.map((sch, idx) => (
                                        <motion.div key={sch.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                            className="card" style={{ padding: '18px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>{sch.name}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{sch.category} • {sch.fundingBody}</div>
                                                </div>
                                                <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: sch.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: sch.status === 'Active' ? '#22C55E' : '#F59E0B' }}>{sch.status}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary-dark)' }}>{sch.amount}</span>
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{sch.recipients} recipients</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn-white" style={{ flex: 1, fontSize: '12px', padding: '6px' }} onClick={() => addToast({ type: 'info', title: sch.name, message: `Viewing ${sch.recipients} active recipients.` })}>Recipients</button>
                                                <button className="btn-white" style={{ flex: 1, fontSize: '12px', padding: '6px' }} onClick={() => addToast({ type: 'success', title: 'Disbursed', message: `${sch.amount} disbursed to ${sch.recipients} students.` })}>Disburse</button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* ── Receipt Modal ── */}
            <AnimatePresence>
                {showReceiptModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReceiptModal(null)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }} onClick={e => e.stopPropagation()}
                            style={{ background: 'white', borderRadius: '20px', padding: '36px', maxWidth: '480px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', position: 'relative' }}>
                            <button onClick={() => setShowReceiptModal(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>✕</button>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{ fontSize: '28px', marginBottom: '8px' }}>🧾</div>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F5535', textTransform: 'uppercase', letterSpacing: '1px' }}>TITUS Institute of Technology</div>
                                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1D1D1D', margin: '6px 0 0' }}>Payment Receipt</h2>
                                <div style={{ fontSize: '12px', color: '#587290', marginTop: '2px' }}>Receipt No: {showReceiptModal.id}</div>
                            </div>
                            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '18px', marginBottom: '24px' }}>
                                {[['Student Name', showReceiptModal.student], ['Class', showReceiptModal.class], ['Fee Category', showReceiptModal.category], ['Payment Mode', showReceiptModal.method], ['Date', showReceiptModal.date], ['Status', '✔ Paid']].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #EAEAEA', fontSize: '13px' }}>
                                        <span style={{ color: '#587290' }}>{k}</span>
                                        <span style={{ fontWeight: 600, color: k === 'Status' ? '#22C55E' : '#1D1D1D' }}>{v}</span>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', fontSize: '16px', fontWeight: 800, color: '#1F5535' }}>
                                    <span>Amount Paid</span><span>₹{showReceiptModal.amount}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => window.print()} style={{ flex: 1, padding: '11px', background: '#1F5535', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>🖨️ Print Receipt</motion.button>
                                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowReceiptModal(null)} style={{ padding: '11px 20px', background: 'none', border: '1px solid #EAEAEA', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Close</motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Collect Fee Modal ── */}
            <AnimatePresence>
                {showCollectModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCollectModal(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }} transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'white', borderRadius: '20px', padding: '36px', maxWidth: '560px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', position: 'relative' }}>
                            <button onClick={() => setShowCollectModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>✕</button>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1D1D1D', marginBottom: '6px' }}>💳 Record Student Fee Collection</h3>
                            <p style={{ fontSize: '13px', color: '#587290', marginBottom: '24px' }}>Record cash or other offline fee collections and generate a receipt.</p>
                            <form onSubmit={handleCollectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#587290', display: 'block', marginBottom: '4px' }}>Student Name *</label>
                                        <input type="text" placeholder="Enter student name" value={collectForm.student} onChange={e => setCollectForm(f => ({...f, student: e.target.value}))} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #EAEAEA', color: '#1D1D1D' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#587290', display: 'block', marginBottom: '4px' }}>Class</label>
                                        <select value={collectForm.class} onChange={e => setCollectForm(f => ({...f, class: e.target.value}))} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #EAEAEA', color: '#1D1D1D' }}>
                                            {['CS-A','CS-B','IT-A','IT-B','ECE-A'].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#587290', display: 'block', marginBottom: '4px' }}>Fee Category</label>
                                        <select value={collectForm.category} onChange={e => setCollectForm(f => ({...f, category: e.target.value}))} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #EAEAEA', color: '#1D1D1D' }}>
                                            {['Tuition Fee','Exam Fee','Library Fee','Lab Fee','Transport Fee','Hostel Fee'].map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#587290', display: 'block', marginBottom: '4px' }}>Amount (₹) *</label>
                                        <input type="number" placeholder="Enter amount" value={collectForm.amount} onChange={e => setCollectForm(f => ({...f, amount: e.target.value}))} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #EAEAEA', color: '#1D1D1D' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#587290', display: 'block', marginBottom: '4px' }}>Payment Method</label>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        {['Cash', 'UPI', 'Cheque', 'NEFT', 'DD'].map(m => (
                                            <button key={m} type="button" onClick={() => setCollectForm(f => ({...f, method: m}))} style={{ padding: '8px 18px', borderRadius: '20px', border: `1px solid ${collectForm.method === m ? '#1F5535' : '#EAEAEA'}`, background: collectForm.method === m ? '#1F5535' : 'transparent', color: collectForm.method === m ? 'white' : '#1D1D1D', fontSize: '13px', cursor: 'pointer', fontWeight: collectForm.method === m ? 600 : 400 }}>{m}</button>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>🧾 Record & Generate Receipt</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Finance;

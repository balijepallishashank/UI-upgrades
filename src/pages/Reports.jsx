import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Download, Eye, Loader, BarChart2, Users, 
    IndianRupee, Package, Clock, AlertTriangle, ShieldCheck, X
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Badge from '../components/Badge';
import { useToast } from '../contexts/ToastContext';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { mockScheduledReports } from '../mockData';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const Reports = () => {
    const { addToast } = useToast();
    const [generatingId, setGeneratingId] = useState(null);
    const [previewingReport, setPreviewingReport] = useState(null);
    
    // Custom Date Range Filters
    const [startDate, setStartDate] = useState('2026-07-01');
    const [endDate, setEndDate] = useState('2026-07-07');

    // Scheduled Reports state
    const [schedules, setSchedules] = useState(mockScheduledReports);
    const handleToggleSchedule = (idx) => {
        setSchedules(prev => prev.map((s, i) => i === idx ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s));
        addToast({ type: 'success', title: 'Schedule Updated', message: 'Automated report dispatch settings adjusted.' });
    };
    const [generationProgress, setGenerationProgress] = useState(0);

    const reportCards = [
        {
            id: 'attendance',
            title: "Daily Attendance Register",
            desc: "Present, absent, and late-arrival statistics across all student sections and employees.",
            size: "1.2 MB",
            icon: Clock,
            color: "#3B82F6",
            mockData: [
                { name: 'CS-A', present: '94%', late: '2%', absent: '4%' },
                { name: 'CS-B', present: '89%', late: '5%', absent: '6%' },
                { name: 'IT-A', present: '91%', late: '4%', absent: '5%' }
            ]
        },
        {
            id: 'gpa',
            title: "GPA & Grade Distribution",
            desc: "Comparative summary of academic averages, ranks, and class-wise GPAs.",
            size: "2.4 MB",
            icon: Users,
            color: "#10B981",
            mockData: [
                { name: 'Dr. Anita Rao', avgGPA: '8.4', class: 'CS-A' },
                { name: 'Prof. S. Kumar', avgGPA: '7.9', class: 'IT-A' },
                { name: 'Mrs. Priya Sen', avgGPA: '8.1', class: 'ECE-B' }
            ]
        },
        {
            id: 'dues',
            title: "Defaulters Outstanding Ledger",
            desc: "India Rupee (₹) audit of overdue fees, unpaid semesters, and aging invoice metrics.",
            size: "840 KB",
            icon: IndianRupee,
            color: "#EF4444",
            mockData: [
                { name: 'Rohan Verma', class: 'CS-A', due: '₹45,000', daysOverdue: '12 Days' },
                { name: 'Asha Sharma', class: 'IT-B', due: '₹35,000', daysOverdue: '8 Days' },
                { name: 'Vikram Singh', class: 'CS-B', due: '₹22,000', daysOverdue: '15 Days' }
            ]
        },
        {
            id: 'inventory',
            title: "Asset Valuation Ledger",
            desc: "Depreciation calculations, inbound stock reconciliations, and low stock warnings.",
            size: "1.5 MB",
            icon: Package,
            color: "#F59E0B",
            mockData: [
                { name: 'Dell Latitude Laptops', stock: '8 units', valuation: '₹4,80,000', warning: 'Low Stock' },
                { name: 'Office Ergonomic Chairs', stock: '25 units', valuation: '₹1,50,000', warning: 'Normal' },
                { name: 'Dry Erase Board markers', stock: '0 units', valuation: '₹0', warning: 'Out of Stock' }
            ]
        },
        {
            id: 'faculty',
            title: "Faculty Feedback & Evaluation",
            desc: "Student feedback scores, publications count index, and annual performance indices.",
            size: "920 KB",
            icon: BarChart2,
            color: "#8B5CF6",
            mockData: [
                { name: 'Dr. Anita Rao', rating: '96%', papers: '8', status: 'Excellent' },
                { name: 'Prof. S. Kumar', rating: '88%', papers: '5', status: 'Very Good' },
                { name: 'Mrs. Priya Sen', rating: '91%', papers: '3', status: 'Excellent' }
            ]
        },
        {
            id: 'roster',
            title: "Roster Shift Allocations",
            desc: " Roster schedules, support staff areas duty logs, and swap details.",
            size: "620 KB",
            icon: ShieldCheck,
            color: "#EC4899",
            mockData: [
                { name: 'Amit Gupta', role: 'Security Guard', shift: 'Morning Shift', area: 'Gate 1' },
                { name: 'Rani Patel', role: 'Janitor', shift: 'Evening Shift', area: 'Block A' },
                { name: 'Sunil Verma', role: 'Bus Driver', shift: 'Full Day Shift', area: 'Route 4' }
            ]
        },
        {
            id: 'security',
            title: "Security & System Audit Log",
            desc: "Chronological audit timeline of IP addresses, login errors, and admin alterations.",
            size: "3.1 MB",
            icon: AlertTriangle,
            color: "#6B7280",
            mockData: [
                { user: 'admin@institution.edu', action: 'Modified Fee Structure', ip: '192.168.1.15', time: '10:04 AM' },
                { user: 'registrar@institution.edu', action: 'Approved Leave Request', ip: '192.168.1.22', time: '09:08 AM' },
                { user: 'system_bot', action: 'Backups Completed Successfully', ip: '127.0.0.1', time: '04:00 AM' }
            ]
        }
    ];

    const triggerGenerateReport = (report) => {
        if (generatingId) return;
        setGeneratingId(report.id);
        setGenerationProgress(0);

        const interval = setInterval(() => {
            setGenerationProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setGeneratingId(null);
                        addToast({ 
                            type: 'success', 
                            title: 'Report Compiled', 
                            message: `${report.title} downloaded to your downloads folder.` 
                        });
                    }, 200);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);
    };

    return (
        <PageTransition>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>📊</span> Report Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        Compile spreadsheet reports, preview institutional registers, and download verified PDFs.
                    </p>
                </div>
            </div>

            {/* Custom Date Range Filter */}
            <div className="card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>📅</span>
                    <div>
                        <strong style={{ fontSize: '14px', display: 'block', color: 'var(--text-primary)' }}>Custom Date Range Filter</strong>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Restrict all exports and generated summaries to this time scope.</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>START DATE</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>END DATE</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', fontSize: '13px', color: 'var(--text-primary)' }} />
                    </div>
                    <button className="btn-white" style={{ marginTop: '16px', padding: '8px 16px', fontSize: '12px' }} onClick={() => addToast({ type: 'info', title: 'Filter Applied', message: `Data ranges set from ${startDate} to ${endDate}.` })}>
                        Apply Filter
                    </button>
                </div>
            </div>

            {/* 7 Cards Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {reportCards.map((report) => {
                    const isGenerating = generatingId === report.id;
                    return (
                        <motion.div 
                            key={report.id} 
                            variants={itemVariants}
                            initial="hidden"
                            animate="show"
                            className="card"
                            style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}
                            whileHover={{ y: -4, boxShadow: 'var(--glass-shadow)' }}
                        >
                            {/* Generator Loading Bar overlay */}
                            {isGenerating && (
                                <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', background: 'var(--primary-dark)', width: `${generationProgress}%`, transition: 'width 0.15s ease' }}></div>
                            )}

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', background: `${report.color}15`, color: report.color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <report.icon size={20} />
                                    </div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>{report.size}</span>
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{report.title}</h3>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '20px' }}>{report.desc}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                <button 
                                    className="btn-white" 
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}
                                    onClick={() => setPreviewingReport(report)}
                                >
                                    <Eye size={14} /> Preview
                                </button>
                                <button 
                                    className="btn-primary" 
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px' }}
                                    disabled={isGenerating}
                                    onClick={() => triggerGenerateReport(report)}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader size={14} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> Generating ({generationProgress}%)
                                        </>
                                    ) : (
                                        <>
                                            <Download size={14} /> Generate
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Scheduled Reports Management */}
            <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={20} color="var(--primary-dark)" /> Scheduled & Automated Report Dispatch
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
                    Automate sheet generation and dispatch PDF compilations directly to administrative inbox channels.
                </p>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px 10px' }}>Report Name</th>
                                <th style={{ padding: '10px' }}>Frequency</th>
                                <th style={{ padding: '10px' }}>Format</th>
                                <th style={{ padding: '10px' }}>Recipients</th>
                                <th style={{ padding: '10px' }}>Next Run</th>
                                <th style={{ padding: '10px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((sch, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>{sch.name}</td>
                                    <td style={{ padding: '10px' }}><Badge type="Warning" text={sch.frequency} /></td>
                                    <td style={{ padding: '10px', fontWeight: 700, color: 'var(--primary-dark)' }}>{sch.format}</td>
                                    <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{sch.recipients}</td>
                                    <td style={{ padding: '10px', fontFamily: 'monospace' }}>{sch.nextRun}</td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <Badge type={sch.status === 'Active' ? 'Success' : 'Warning'} text={sch.status} />
                                    </td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <button className="btn-white" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => handleToggleSchedule(idx)}>
                                            {sch.status === 'Active' ? 'Pause' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Glassmorphic Preview Modal */}
            <AnimatePresence>
                {previewingReport && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-modal-overlay"
                        onClick={() => setPreviewingReport(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            className="glass-modal-content"
                            style={{ maxWidth: '650px', width: '90%', padding: '24px' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <previewingReport.icon size={20} color={previewingReport.color} />
                                    <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{previewingReport.title} - Live Preview</h3>
                                </div>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setPreviewingReport(null)}>
                                    <X size={18} />
                                </button>
                            </div>

                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                Rendered query summary compiled from database tables. Size basis: {previewingReport.size}.
                            </p>

                            {/* Mock Data Table Preview */}
                            <div style={{ overflowX: 'auto', marginBottom: '20px', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                            {Object.keys(previewingReport.mockData[0]).map(key => (
                                                <th key={key} style={{ padding: '10px', textTransform: 'capitalize' }}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewingReport.mockData.map((row, idx) => (
                                            <tr key={idx} style={{ borderBottom: idx < previewingReport.mockData.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                                {Object.values(row).map((val, cellIdx) => (
                                                    <td key={cellIdx} style={{ padding: '10px', fontWeight: cellIdx === 0 ? 600 : 500 }}>{val}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button className="btn-white" onClick={() => setPreviewingReport(null)}>Close Preview</button>
                                <button className="btn-primary" onClick={() => {
                                    setPreviewingReport(null);
                                    triggerGenerateReport(previewingReport);
                                }}>Download Spreadsheet</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
};

export default Reports;

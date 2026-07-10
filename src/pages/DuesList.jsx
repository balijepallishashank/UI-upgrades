import React, { useState } from 'react';
import { Search, IndianRupee, AlertCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Badge from '../components/Badge';
import { mockStudents } from '../mockData';

const DuesList = () => {
    // Exact records from screenshot + mapping of mockStudents for full directory coverage
    const initialLedgers = [
        {
            name: "MD.RAYAN RAZA",
            class: "1ST",
            parent: "RAJAUL ARFIN",
            phone: "9341772168",
            paidMonths: "Apr '26",
            lastPayment: "28 Jun 2026, 12:17",
            mode: "Cash",
            hasDues: false
        },
        {
            name: "MOHAMMAD ARSALAN",
            class: "UKG",
            parent: "MD RASHID ANWAR",
            phone: "8969575004",
            paidMonths: "-",
            lastPayment: "-",
            mode: "-",
            hasDues: true
        },
        {
            name: "AADITYA KUMAR",
            class: "7TH",
            parent: "MUKESH KUMAR",
            phone: "7766819604",
            paidMonths: "-",
            lastPayment: "-",
            mode: "-",
            hasDues: true
        },
        {
            name: "AADRSH",
            class: "LKG",
            parent: "DAULAT SINGH",
            phone: "9113135287",
            paidMonths: "-",
            lastPayment: "-",
            mode: "-",
            hasDues: true
        },
        // Spread standard mock students as unpaid/paid for realistic listing
        ...mockStudents.map((s, idx) => ({
            name: s.name.toUpperCase(),
            class: s.class,
            parent: s.parentName ? s.parentName.toUpperCase() : "PARENT NAME",
            phone: s.parentPhone || "9999999999",
            paidMonths: idx % 3 === 0 ? "Jun '26" : "-",
            lastPayment: idx % 3 === 0 ? "05 Jul 2026, 10:30" : "-",
            mode: idx % 3 === 0 ? "UPI" : "-",
            hasDues: idx % 3 !== 0
        }))
    ];

    const [ledgers, setLedgers] = useState(initialLedgers);
    const [selectedClass, setSelectedClass] = useState("All Classes");
    const [duesFilter, setDuesFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const classesList = ["All Classes", "LKG", "UKG", "1ST", "2ND", "3RD", "4TH", "5TH", "6TH", "7TH", "8TH", "9TH", "10TH", "CS-A", "CS-B", "IT-A", "IT-B"];

    const filteredLedgers = ledgers.filter(item => {
        // Class Filter
        if (selectedClass !== "All Classes" && item.class !== selectedClass) return false;

        // Dues Filter
        if (duesFilter === "unpaid" && !item.hasDues) return false;
        if (duesFilter === "paid" && item.hasDues) return false;

        // Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (
                item.name.toLowerCase().includes(query) ||
                item.parent.toLowerCase().includes(query) ||
                item.phone.includes(query)
            );
        }

        return true;
    });

    return (
        <PageTransition>
            <div className="dashboard-header" style={{ marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📊</span> Fee Payments / Student Ledger
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Search students, filter tracking records, and click rows to see full history.
                    </p>
                </div>
            </div>

            {/* Filter Control Panel */}
            <div className="card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '180px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter by Class</span>
                    <select 
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
                    >
                        {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '240px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter by Remaining Dues</span>
                    <select 
                        value={duesFilter}
                        onChange={e => setDuesFilter(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
                    >
                        <option value="All">All Students (Show Everyone)</option>
                        <option value="unpaid">Only Students with Unpaid Dues</option>
                        <option value="paid">Fully Paid Students (Free & Clear)</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '260px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Search Query</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--card-white)' }}>
                        <Search size={16} color="var(--text-secondary)" />
                        <input 
                            type="text"
                            placeholder="Search by Name, Father's Name, Phone..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: 'var(--text-primary)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Student Ledger Stream</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>S.No</th>
                                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Student</th>
                                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Class</th>
                                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Parent (Father)</th>
                                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Paid Months</th>
                                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Last Payment</th>
                                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLedgers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                        No student ledger records match the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredLedgers.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', hover: { background: 'var(--bg-color)' } }}>
                                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{idx + 1}</td>
                                        <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</td>
                                        <td style={{ padding: '14px 16px', fontWeight: 500 }}>{item.class}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.parent}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--primary-dark)', fontWeight: 500, marginTop: '2px' }}>({item.phone})</div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            {item.paidMonths !== "-" ? (
                                                <span style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500 }}>
                                                    {item.paidMonths}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--text-secondary)' }}>-</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                                            {item.lastPayment}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            {item.mode !== "-" ? (
                                                <Badge type="Success" text={item.mode} />
                                            ) : (
                                                <span style={{ 
                                                    display: 'inline-block', 
                                                    width: '24px', 
                                                    height: '24px', 
                                                    borderRadius: '50%', 
                                                    background: 'rgba(59, 130, 246, 0.1)', 
                                                    color: 'var(--primary-dark)', 
                                                    textAlign: 'center', 
                                                    lineHeight: '24px',
                                                    fontSize: '11px',
                                                    fontWeight: 700
                                                }}>-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageTransition>
    );
};

export default DuesList;

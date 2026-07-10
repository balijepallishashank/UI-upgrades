import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, GraduationCap, Users, CalendarCheck, Box, IndianRupee, 
    Shield, Settings, FileText, ChevronRight, UserCircle, CalendarOff, MessageSquare
} from 'lucide-react';
import { mockStudents, mockEmployees, mockInventory, mockFinanceDueList, mockStaff } from '../mockData';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // Toggle on Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Listen for custom open event
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-command-palette', handleOpen);
        return () => window.removeEventListener('open-command-palette', handleOpen);
    }, []);

    // Focus input when palette opens
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const routes = [
        { name: 'Dashboard Overview', path: '/dashboard', icon: CalendarCheck, type: 'Nav' },
        { name: 'Student Directory', path: '/students', icon: GraduationCap, type: 'Nav', tab: 'directory' },
        { name: 'Employee Directory', path: '/employees', icon: Users, type: 'Nav', tab: 'directory' },
        { name: 'Staff Management', path: '/staff', icon: UserCircle, type: 'Nav', tab: 'directory' },
        { name: 'Attendance Register', path: '/attendance', icon: CalendarCheck, type: 'Nav', tab: 'records' },
        { name: 'Leave Center', path: '/leave', icon: CalendarOff, type: 'Nav', tab: 'requests' },
        { name: 'Finance Center', path: '/finance', icon: IndianRupee, type: 'Nav', tab: 'overview' },
        { name: 'Inventory Assets', path: '/inventory', icon: Box, type: 'Nav', tab: 'stock' },
        { name: 'Communication Hub', path: '/communication', icon: MessageSquare, type: 'Nav' },
        { name: 'Report Generator', path: '/reports', icon: FileText, type: 'Nav' },
        { name: 'System Audit Logs', path: '/audit', icon: Shield, type: 'Nav' },
        { name: 'Account Settings', path: '/settings', icon: Settings, type: 'Nav' }
    ];

    // Search Logic
    let navResults = [];
    let studentResults = [];
    let employeeResults = [];
    let staffResults = [];
    let inventoryResults = [];
    let financeResults = [];

    if (query.trim() !== '') {
        const cleanQuery = query.toLowerCase();

        // 1. Navigation
        navResults = routes.filter(r => r.name.toLowerCase().includes(cleanQuery)).slice(0, 4);

        // 2. Students
        studentResults = mockStudents.filter(s => 
            s.name.toLowerCase().includes(cleanQuery) || 
            s.id.toLowerCase().includes(cleanQuery)
        ).map(s => ({
            id: s.id,
            name: s.name,
            sub: `Roll ${s.roll} • Class ${s.class} (Student)`,
            icon: GraduationCap,
            action: () => navigate('/students', { state: { tab: 'details', studentId: s.id } })
        })).slice(0, 4);

        // 3. Employees
        employeeResults = mockEmployees.filter(e => 
            e.name.toLowerCase().includes(cleanQuery) || 
            e.id.toLowerCase().includes(cleanQuery)
        ).map(e => ({
            id: e.id,
            name: e.name,
            sub: `${e.role} • ${e.department} (Employee)`,
            icon: Users,
            action: () => navigate('/employees', { state: { tab: 'details', employeeId: e.id } })
        })).slice(0, 4);

        // 3.5 Support Staff
        staffResults = mockStaff.filter(sf => 
            sf.name.toLowerCase().includes(cleanQuery) || 
            sf.id.toLowerCase().includes(cleanQuery)
        ).map(sf => ({
            id: sf.id,
            name: sf.name,
            sub: `${sf.role} • Shift ${sf.shift} (Support Staff)`,
            icon: UserCircle,
            action: () => navigate('/staff', { state: { tab: 'details', staffId: sf.id } })
        })).slice(0, 4);

        // 4. Inventory
        inventoryResults = mockInventory.filter(i => 
            i.item.toLowerCase().includes(cleanQuery)
        ).map(inv => ({
            id: inv.id,
            name: inv.item,
            sub: `${inv.stock} Units • ${inv.category} (${inv.status})`,
            icon: Box,
            action: () => navigate('/inventory', { state: { tab: 'stock', search: inv.item } })
        })).slice(0, 4);

        // 5. Finance
        financeResults = mockFinanceDueList.filter(f => 
            f.student.toLowerCase().includes(cleanQuery) || 
            f.id.toLowerCase().includes(cleanQuery)
        ).map(f => ({
            id: f.id,
            name: `Invoice for ${f.student}`,
            sub: `${f.category} • ${f.amount} • Due ${f.dueDate} (${f.status})`,
            icon: IndianRupee,
            action: () => navigate('/finance', { state: { tab: 'dues', search: f.student } })
        })).slice(0, 4);
    } else {
        // Default suggestions
        navResults = routes.slice(0, 6);
    }

    const hasResults = navResults.length > 0 || studentResults.length > 0 || employeeResults.length > 0 || staffResults.length > 0 || inventoryResults.length > 0 || financeResults.length > 0;

    const handleSelect = (result) => {
        if (result.action) {
            result.action();
        } else if (result.path) {
            navigate(result.path, { state: result.tab ? { tab: result.tab } : null });
        }
        setIsOpen(false);
        setQuery('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                            zIndex: 9999, display: 'flex', justifyContent: 'center', paddingTop: '10vh'
                        }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: -20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'var(--card-white)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '16px',
                                width: '100%',
                                maxWidth: '650px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                maxHeight: '70vh'
                            }}
                        >
                            {/* Search Input Bar */}
                            <div style={{ display: 'flex', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--border-color)' }}>
                                <Search size={22} color="var(--text-secondary)" />
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search anything... (e.g. Priya, Projector, Invoice)"
                                    style={{
                                        width: '100%', border: 'none', outline: 'none', background: 'transparent',
                                        fontSize: '16px', marginLeft: '12px', color: 'var(--text-primary)'
                                    }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-color)', padding: '3px 6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>ESC</span>
                                </div>
                            </div>

                            {/* Search Results Area */}
                            <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
                                {hasResults ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {/* 1. Navigation Section */}
                                        {navResults.length > 0 && (
                                            <div>
                                                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Modules & Actions</p>
                                                {navResults.map((r, idx) => (
                                                    <div 
                                                        key={`nav-${idx}`}
                                                        onClick={() => handleSelect(r)}
                                                        className="dropdown-item"
                                                        style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <r.icon size={16} color="var(--primary-dark)" />
                                                            <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{r.name}</span>
                                                        </div>
                                                        <ChevronRight size={14} color="var(--text-secondary)" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* 2. Students Section */}
                                        {studentResults.length > 0 && (
                                            <div>
                                                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Students</p>
                                                {studentResults.map((s, idx) => (
                                                    <div 
                                                        key={`stu-${idx}`}
                                                        onClick={() => handleSelect(s)}
                                                        className="dropdown-item"
                                                        style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <GraduationCap size={16} color="#3B82F6" />
                                                            <div>
                                                                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, display: 'block' }}>{s.name}</span>
                                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.sub}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={14} color="var(--text-secondary)" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* 3. Employees Section */}
                                        {employeeResults.length > 0 && (
                                            <div>
                                                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Faculty</p>
                                                {employeeResults.map((e, idx) => (
                                                    <div 
                                                        key={`emp-${idx}`}
                                                        onClick={() => handleSelect(e)}
                                                        className="dropdown-item"
                                                        style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <Users size={16} color="#8B5CF6" />
                                                            <div>
                                                                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, display: 'block' }}>{e.name}</span>
                                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{e.sub}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={14} color="var(--text-secondary)" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* 3.5 Support Staff Section */}
                                        {staffResults.length > 0 && (
                                            <div>
                                                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Support Staff</p>
                                                {staffResults.map((sf, idx) => (
                                                    <div 
                                                        key={`sf-${idx}`}
                                                        onClick={() => handleSelect(sf)}
                                                        className="dropdown-item"
                                                        style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <UserCircle size={16} color="#EC4899" />
                                                            <div>
                                                                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, display: 'block' }}>{sf.name}</span>
                                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{sf.sub}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={14} color="var(--text-secondary)" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* 4. Inventory Section */}
                                        {inventoryResults.length > 0 && (
                                            <div>
                                                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inventory</p>
                                                {inventoryResults.map((i, idx) => (
                                                    <div 
                                                        key={`inv-${idx}`}
                                                        onClick={() => handleSelect(i)}
                                                        className="dropdown-item"
                                                        style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <Box size={16} color="#EC4899" />
                                                            <div>
                                                                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, display: 'block' }}>{i.name}</span>
                                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{i.sub}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={14} color="var(--text-secondary)" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* 5. Finance Section */}
                                        {financeResults.length > 0 && (
                                            <div>
                                                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Finance & Fees</p>
                                                {financeResults.map((f, idx) => (
                                                    <div 
                                                        key={`fin-${idx}`}
                                                        onClick={() => handleSelect(f)}
                                                        className="dropdown-item"
                                                        style={{ padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <IndianRupee size={16} color="#22C55E" />
                                                            <div>
                                                                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, display: 'block' }}>{f.name}</span>
                                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{f.sub}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight size={14} color="var(--text-secondary)" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No results found for "<strong>{query}</strong>"
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;

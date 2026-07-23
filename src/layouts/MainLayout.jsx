import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
    LayoutDashboard, Users, CalendarCheck, CalendarOff, Settings, LogOut,
    PieChart, Search, ChevronDown, ChevronRight, ChevronLeft, ChevronUp,
    GraduationCap, UserCircle, School, Calendar, Bell,
    MessageSquare, User, Menu, Moon, Sun, Shield, Box, IndianRupee,
    Trophy, NotebookPen, Lock, AlertCircle, Building2
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../contexts/ToastContext';
import FloatingFAB from '../components/FloatingFAB';
import CommandPalette from '../components/CommandPalette';
import './MainLayout.css';

const SidebarGroup = ({ title, icon: Icon, children, sidebarOpen, currentPath }) => {
    const hasActiveChild = React.Children.toArray(children).some(child => {
        return child.props.to === currentPath;
    });

    const [isOpen, setIsOpen] = useState(hasActiveChild);

    useEffect(() => {
        if (hasActiveChild) {
            setIsOpen(true);
        }
    }, [currentPath, hasActiveChild]);

    return (
        <div className="sidebar-group" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button
                className={`sidebar-group-btn ${isOpen ? 'open' : ''} ${hasActiveChild ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    color: hasActiveChild ? 'var(--primary-dark)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '13px',
                    transition: 'all 0.2s',
                    background: hasActiveChild ? 'rgba(163, 217, 92, 0.08)' : 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={18} />
                    {sidebarOpen && <span>{title}</span>}
                </div>
                {sidebarOpen && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
            </button>
            <AnimatePresence>
                {isOpen && sidebarOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NavItem = ({ to, icon: Icon, label, sidebarOpen, currentPath }) => {
    const isActive = currentPath === to;

    return (
        <NavLink to={to} className="nav-item">
            {isActive && (
                <motion.div
                    layoutId="active-sidebar-indicator"
                    className="nav-item-active-bg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
            <div className="nav-item-content">
                <motion.div
                    className="nav-item-icon"
                    whileHover={{ scale: 1.1, rotate: [-5, 5, -5, 0] }}
                    transition={{ duration: 0.2 }}
                >
                    <Icon size={20} />
                </motion.div>
                {sidebarOpen && <span className="nav-item-label">{label}</span>}
            </div>
        </NavLink>
    );
};

const DropdownMenu = ({ isOpen, items }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, y: -10, filter: 'blur(10px)' }}
                transition={{ duration: 0.2 }}
                className="glass-dropdown"
            >
                {items.map((item, idx) => (
                    <div key={idx} className="dropdown-item" onClick={item.onClick}>
                        {item.icon && <item.icon size={16} />}
                        <div className="dropdown-item-text">
                            <span className="dropdown-item-title">{item.label}</span>
                            {item.subtext && <span className="dropdown-item-sub">{item.subtext}</span>}
                        </div>
                    </div>
                ))}
            </motion.div>
        )}
    </AnimatePresence>
);

const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
        days.push(d);
    }
    return days;
};

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToast();
    const { isDarkMode, toggleTheme } = useTheme();
    const scrollContainerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: scrollContainerRef });
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const theme = isDarkMode ? 'dark' : 'light';
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifDrawer, setShowNotifDrawer] = useState(false);
    const [showCalendarPopup, setShowCalendarPopup] = useState(false);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [isScrolled, setIsScrolled] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Fee Payment Received', desc: 'Rahul Sharma paid ₹15,000 via UPI.', time: '10m ago', unread: true },
        { id: 2, title: 'New Leave Request', desc: 'Prof. Anita Roy requested 2 days casual leave.', time: '1h ago', unread: true },
        { id: 3, title: 'Attendance Alert', desc: '3 staff members flagged for late arrival.', time: '2h ago', unread: false }
    ]);
    const hasUnread = notifications.some(n => n.unread);

    // Lock screen states
    const [isLocked, setIsLocked] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState(false);

    // Check authentication synchronously
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const auth = localStorage.getItem('isAuthenticated');
        if (auth === null) {
            localStorage.setItem('isAuthenticated', 'true');
            return true;
        }
        return auth === 'true';
    });

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(isAuth);
        if (!isAuth) {
            navigate('/login', { replace: true });
        }
    }, [navigate, location.pathname]); // Run on mount & navigate change

    const handlePinInput = useCallback((num) => {
        setPin(prevPin => {
            if (prevPin.length < 4) {
                const newPin = prevPin + num;
                if (newPin.length === 4) {
                    if (newPin === '1234') {
                        setIsLocked(false);
                        addToast({ type: 'success', title: 'Session Unlocked', message: 'Welcome back! Your dashboard session is now active.' });
                        return '';
                    } else {
                        setPinError(true);
                        setTimeout(() => {
                            setPinError(false);
                            setPin('');
                        }, 600);
                        addToast({ type: 'error', title: 'Access Denied', message: 'Incorrect PIN. Try again.' });
                    }
                }
                return newPin;
            }
            return prevPin;
        });
    }, [addToast]);

    const handleBackspace = useCallback(() => {
        setPin(prev => prev.slice(0, -1));
    }, []);

    const handleClear = useCallback(() => {
        setPin('');
    }, []);

    // Listen to physical keyboard typing when lock screen is open
    useEffect(() => {
        if (!isLocked) return;
        const handleKeyDown = (e) => {
            if (e.key >= '0' && e.key <= '9') {
                handlePinInput(e.key);
            } else if (e.key === 'Backspace') {
                handleBackspace();
            } else if (e.key === 'Escape' || e.key === 'Delete') {
                handleClear();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLocked, handlePinInput, handleBackspace, handleClear]);

    const handleScroll = (e) => {
        setIsScrolled(e.target.scrollTop > 20);
        setShowScrollTop(e.target.scrollTop > 300);
    };

    const scrollToTop = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    const profileActions = [
        { label: 'My Profile', subtext: 'View personal information', icon: User, onClick: () => navigate('/profile') },
        { label: 'Settings', subtext: 'Account preferences', icon: Settings, onClick: () => navigate('/settings') },
        { label: 'Sign Out', icon: LogOut, onClick: handleLogout },
    ];

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="layout-container fade-in">
            <AnimatedBackground />

            {/* Sidebar */}
            <motion.aside
                className="sidebar"
                animate={{ width: sidebarOpen ? 260 : 80 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ position: 'relative' }}
            >
                {/* Floating Collapse/Expand Button */}
                <button
                    className="sidebar-toggle-floating-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>

                <div className="sidebar-header">
                    <div className="sidebar-logo">T</div>
                    {sidebarOpen && <span className="sidebar-brand">TITUS</span>}
                </div>

                <div className="sidebar-scroll">
                    <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" sidebarOpen={sidebarOpen} currentPath={location.pathname} />

                        {/* ── Administration Group ── */}
                        <SidebarGroup title="Administration" icon={Users} sidebarOpen={sidebarOpen} currentPath={location.pathname}>
                            <NavItem to="/students" icon={GraduationCap} label="Students" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/employees" icon={Users} label="Employees" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/staff" icon={UserCircle} label="Staff" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/departments" icon={Building2} label="Departments" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                        </SidebarGroup>

                        {/* ── Academics Group ── */}
                        <SidebarGroup title="Academics" icon={School} sidebarOpen={sidebarOpen} currentPath={location.pathname}>
                            <NavItem to="/classes" icon={School} label="Classes" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/timetable" icon={Calendar} label="Timetable" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/homework" icon={NotebookPen} label="Homework" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/exams" icon={Trophy} label="Exams & Results" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                        </SidebarGroup>

                        {/* ── Operations Group ── */}
                        <SidebarGroup title="Operations" icon={CalendarCheck} sidebarOpen={sidebarOpen} currentPath={location.pathname}>
                            <NavItem to="/attendance" icon={CalendarCheck} label="Attendance" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/leave" icon={CalendarOff} label="Leave Center" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/holidays" icon={Calendar} label="Academic Holidays" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                        </SidebarGroup>

                        {/* ── Finance & Inventory Group ── */}
                        <SidebarGroup title="Finance & Inventory" icon={IndianRupee} sidebarOpen={sidebarOpen} currentPath={location.pathname}>
                            <NavItem to="/finance" icon={IndianRupee} label="Finance Hub" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/dues-list" icon={AlertCircle} label="Dues List" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/fee-structure" icon={IndianRupee} label="Fee Structure" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/inventory" icon={Box} label="Inventory" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                        </SidebarGroup>

                        {/* ── Reports & Comms Group ── */}
                        <SidebarGroup title="Reports & Comms" icon={MessageSquare} sidebarOpen={sidebarOpen} currentPath={location.pathname}>
                            <NavItem to="/communication" icon={MessageSquare} label="Communication" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/reports" icon={PieChart} label="Report Center" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                            <NavItem to="/audit" icon={Shield} label="Audit Logs" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                        </SidebarGroup>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <NavItem to="/settings" icon={Settings} label="Settings" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                    <NavItem to="/profile" icon={User} label="Profile" sidebarOpen={sidebarOpen} currentPath={location.pathname} />
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="main-content">
                {/* Topbar with Sticky Scroll Physics */}
                <header className={`topbar ${isScrolled ? 'topbar-scrolled' : ''}`}>
                    {/* Scroll Progress Indicator */}
                    <motion.div className="scroll-progress-bar" style={{ scaleX }} />

                    <div className="topbar-left">
                        <button className="toggle-sidebar-btn glass-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <Menu size={20} />
                        </button>
                        <div
                            className="search-bar"
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                        >
                            <Search size={18} color="var(--text-secondary)" />
                            <input
                                type="text"
                                placeholder="Global Search (Cmd + K)"
                                readOnly
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                    </div>

                    <div className="topbar-right">
                        <motion.button
                            className="topbar-icon-btn glass-btn lock-btn-pulse"
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => {
                                setIsLocked(true);
                                addToast({ type: 'info', title: 'Session Locked', message: 'Screen locked successfully.' });
                            }}
                            title="Lock Session Now"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            <Lock size={19} />
                        </motion.button>

                        <div className="relative-container">
                            <motion.button
                                className="topbar-icon-btn glass-btn"
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { setShowNotifDrawer(true); setShowProfile(false); setShowCalendarPopup(false); }}
                            >
                                <Bell size={20} style={{ color: hasUnread ? 'var(--primary-green)' : 'var(--text-secondary)' }} />
                                {hasUnread && <span className="notification-dot"></span>}
                            </motion.button>
                        </div>

                        <motion.button
                            className="topbar-icon-btn glass-btn"
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                        >
                            <AnimatePresence mode="wait">
                                {theme === 'light' ? (
                                    <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Moon size={20} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Sun size={20} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <div style={{ position: 'relative' }}>
                            <motion.div
                                className="current-date"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCalendarPopup(!showCalendarPopup);
                                    setShowProfile(false);
                                    setShowNotifDrawer(false);
                                }}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--card-white)',
                                    color: 'var(--text-primary)',
                                    fontSize: '12px',
                                    fontWeight: 600
                                }}
                                title="Open Calendar Overview"
                            >
                                <Calendar size={14} style={{ color: 'var(--primary-green)' }} />
                                {calendarDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </motion.div>

                            <AnimatePresence>
                                {showCalendarPopup && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                        style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            marginTop: '8px',
                                            background: 'var(--card-white)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '16px',
                                            padding: '16px',
                                            boxShadow: 'var(--glass-shadow)',
                                            width: '270px',
                                            zIndex: 9999,
                                            backdropFilter: 'blur(20px)',
                                            WebkitBackdropFilter: 'blur(20px)'
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCalendarDate(prev => {
                                                            const d = new Date(prev);
                                                            d.setMonth(d.getMonth() - 1);
                                                            return d;
                                                        });
                                                    }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px', color: 'var(--text-secondary)' }}
                                                    className="glass-btn"
                                                    title="Previous Month"
                                                >
                                                    <ChevronLeft size={14} />
                                                </button>
                                                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                                                    {calendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                                                </strong>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCalendarDate(prev => {
                                                            const d = new Date(prev);
                                                            d.setMonth(d.getMonth() + 1);
                                                            return d;
                                                        });
                                                    }}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px', color: 'var(--text-secondary)' }}
                                                    className="glass-btn"
                                                    title="Next Month"
                                                >
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCalendarDate(new Date());
                                                    addToast({ type: 'info', title: 'Reset Calendar', message: "Calendar date reset to today's active date." });
                                                }}
                                                style={{ fontSize: '10px', color: 'var(--primary-dark)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                                            >
                                                Today
                                            </span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                                            {getDaysInMonth(calendarDate).map((day, idx) => {
                                                const now = new Date();
                                                const isActualToday = day === now.getDate() &&
                                                    calendarDate.getMonth() === now.getMonth() &&
                                                    calendarDate.getFullYear() === now.getFullYear();
                                                const isSelected = day === calendarDate.getDate();

                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={(e) => {
                                                            if (!day) return;
                                                            e.stopPropagation();
                                                            setCalendarDate(prev => {
                                                                const d = new Date(prev);
                                                                d.setDate(day);
                                                                return d;
                                                            });
                                                            addToast({
                                                                type: 'success',
                                                                title: 'Date Selected',
                                                                message: `Active session date set to ${day} ${calendarDate.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`
                                                            });
                                                        }}
                                                        style={{
                                                            padding: '6px 0',
                                                            fontSize: '11px',
                                                            borderRadius: '6px',
                                                            fontWeight: isSelected || isActualToday ? 700 : 400,
                                                            background: isSelected ? 'var(--primary-green)' : isActualToday ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                                            color: isSelected ? 'white' : isActualToday ? 'var(--primary-dark)' : day ? 'var(--text-primary)' : 'transparent',
                                                            cursor: day ? 'pointer' : 'default',
                                                            boxShadow: isSelected ? '0 4px 10px rgba(16, 185, 129, 0.3)' : 'none',
                                                            border: isActualToday && !isSelected ? '1px dashed var(--primary-green)' : 'none'
                                                        }}
                                                    >
                                                        {day || ''}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative-container">
                            <motion.div
                                className="user-profile-menu glass-btn"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setShowProfile(!showProfile); setShowNotifDrawer(false); setShowCalendarPopup(false); }}
                            >
                                <div className="user-avatar">SA</div>
                                <div className="user-info">
                                    <span className="user-name">Super Admin</span>
                                    <span className="user-role">Administrator</span>
                                </div>
                            </motion.div>
                            <DropdownMenu isOpen={showProfile} items={profileActions} />
                        </div>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div
                    className="page-content"
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    onClick={() => { setShowNotifDrawer(false); setShowProfile(false); setShowCalendarPopup(false); }}
                >
                    <Outlet />
                </div>
                <FloatingFAB />
                <CommandPalette />

                {/* Scroll-to-Top Floating Button */}
                <AnimatePresence>
                    {showScrollTop && (
                        <motion.button
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={scrollToTop}
                            className="scroll-to-top-btn"
                            title="Scroll to Top"
                        >
                            <ChevronUp size={20} />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Smart Notifications Drawer overlay */}
                <AnimatePresence>
                    {showNotifDrawer && (
                        <div className="notif-drawer-overlay" onClick={() => setShowNotifDrawer(false)}>
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="notif-drawer-content"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="notif-drawer-header">
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 700 }}>
                                        <Bell size={18} color="var(--primary-dark)" /> Notifications
                                    </h3>
                                    <button className="notif-drawer-close-btn" onClick={() => setShowNotifDrawer(false)}>✕</button>
                                </div>

                                <div className="notif-drawer-body">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>System Alerts Feed</span>
                                        {hasUnread && (
                                            <button style={{ border: 'none', background: 'none', color: 'var(--primary-dark)', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                                                onClick={() => {
                                                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                                    addToast({ type: 'success', title: 'Marked Read', message: 'All notifications marked as read.' });
                                                }}>
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {notifications.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔔</div>
                                                <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>All caught up!</strong>
                                                <span style={{ fontSize: '12px' }}>No new notifications or system alerts.</span>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => {
                                                        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                                                    }}
                                                    style={{
                                                        padding: '14px',
                                                        borderRadius: '12px',
                                                        background: 'var(--bg-color)',
                                                        border: `1px solid ${n.read ? 'var(--border-color)' : 'rgba(16, 185, 129, 0.2)'}`,
                                                        position: 'relative',
                                                        cursor: 'pointer',
                                                        opacity: n.read ? 0.7 : 1,
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {!n.read && (
                                                        <div style={{ position: 'absolute', top: '14px', right: '36px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-green)' }} />
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setNotifications(prev => prev.filter(item => item.id !== n.id));
                                                            addToast({ type: 'info', title: 'Alert Dismissed', message: 'Notification removed.' });
                                                        }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            right: '10px',
                                                            border: 'none',
                                                            background: 'none',
                                                            cursor: 'pointer',
                                                            color: 'var(--text-secondary)',
                                                            fontSize: '11px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            padding: '4px',
                                                            borderRadius: '4px'
                                                        }}
                                                        className="glass-btn"
                                                        title="Dismiss Notification"
                                                    >
                                                        ✕
                                                    </button>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <span style={{ fontSize: '18px' }}>{n.icon}</span>
                                                        <div style={{ paddingRight: '12px' }}>
                                                            <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>{n.title}</strong>
                                                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>{n.desc}</p>
                                                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginTop: '6px' }}>{n.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Lock Screen PIN Keypad Modal */}
                <AnimatePresence>
                    {isLocked && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="lock-screen-overlay"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className={`lock-screen-card ${pinError ? 'shake-anim' : ''}`}
                            >
                                <div className="lock-avatar-holder">
                                    <div className="lock-avatar">SA</div>
                                    <div className="lock-avatar-badge"><Shield size={14} /></div>
                                </div>
                                <h2 className="lock-title">Super Admin</h2>
                                <p className="lock-subtitle">Session Locked due to inactivity</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Hint: Default PIN is 1234</p>

                                {/* PIN Indicators */}
                                <div className="pin-dots-container">
                                    {[0, 1, 2, 3].map(idx => (
                                        <div
                                            key={idx}
                                            className={`pin-dot ${pin.length > idx ? 'filled' : ''} ${pinError ? 'error' : ''}`}
                                        />
                                    ))}
                                </div>

                                {/* Keypad Grid */}
                                <div className="keypad-grid">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <button
                                            key={num}
                                            className="keypad-btn"
                                            onClick={() => handlePinInput(num.toString())}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button className="keypad-btn secondary-action" onClick={handleClear}>Clear</button>
                                    <button className="keypad-btn" onClick={() => handlePinInput('0')}>0</button>
                                    <button className="keypad-btn secondary-action" onClick={handleBackspace}>⌫</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default MainLayout;

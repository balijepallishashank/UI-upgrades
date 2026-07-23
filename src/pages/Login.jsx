import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    Mail, Lock, User, HelpCircle, ArrowRight, PieChart,
    Bot, Calendar, FileText, ChevronDown, Check,
    Eye, EyeOff, Cpu, Zap, Globe, Award,
    ChevronUp, Users, ArrowDown, ArrowUp,
    CheckCircle2, Quote, LayoutDashboard, CreditCard
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import './Login.css';

// Custom Count Up component triggered on scroll view
const CountUpOnScroll = ({ to, duration = 2, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    return (
        <motion.span
            whileInView={() => {
                if (!hasStarted) {
                    setHasStarted(true);
                    let startTime;

                    const updateCount = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = (timestamp - startTime) / (duration * 1000);

                        if (progress < 1) {
                            setCount(Math.floor(to * progress));
                            requestAnimationFrame(updateCount);
                        } else {
                            setCount(to);
                        }
                    };

                    requestAnimationFrame(updateCount);
                }
            }}
            viewport={{ once: true, amount: 0.5 }}
        >
            {count}{suffix}
        </motion.span>
    );
};

// Premium Floating Glass Card component
const FloatingCard = ({ title, val, icon: Icon, className, delay, mouseCoords }) => {
    const [tiltX, setTiltX] = useState(0);
    const [tiltY, setTiltY] = useState(0);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        setTiltX(-(y - yc) / 4);
        setTiltY((x - xc) / 4);
    };

    const handleMouseLeave = () => {
        setTiltX(0);
        setTiltY(0);
    };

    return (
        <motion.div
            className={`floating-glass-card ${className}`}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
                rotate: [0, 1.5, -1.5, 0],
                x: mouseCoords.x * 0.35,
                y: mouseCoords.y * 0.35,
                rotateX: tiltX,
                rotateY: tiltY
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 800,
                transformStyle: 'preserve-3d'
            }}
            transition={{
                initial: { duration: 0.5, delay },
                animate: {
                    rotate: {
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut",
                        delay
                    },
                    x: { type: "spring", stiffness: 100, damping: 25 },
                    y: { type: "spring", stiffness: 100, damping: 25 },
                    rotateX: { type: "spring", stiffness: 150, damping: 15 },
                    rotateY: { type: "spring", stiffness: 150, damping: 15 }
                }
            }}
        >
            <div className="floating-card-icon" style={{ transform: 'translateZ(20px)' }}>
                <Icon size={16} />
            </div>
            <div className="floating-card-info" style={{ transform: 'translateZ(10px)' }}>
                <span className="floating-card-title">{title}</span>
                <span className="floating-card-val">{val}</span>
            </div>
        </motion.div>
    );
};

// Custom Input field with Floating Label & focus glowing states
const PremiumInput = ({ id, label, type = 'text', icon: Icon, value, onChange, options = null, helpIcon = null }) => {
    const [focused, setFocused] = useState(false);

    return (
        <div className="form-group">
            <div className={`premium-input-container ${focused ? 'focused' : ''} ${value ? 'filled' : ''}`}>
                {Icon && <Icon size={18} className="input-icon-left" />}
                {options ? (
                    <select
                        id={id}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        required
                    >
                        <option value="" disabled hidden></option>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        required
                    />
                )}
                <span className="floating-label">{label}</span>
                {options && <ChevronDown size={16} className="select-arrow" />}
                {helpIcon}
            </div>
        </div>
    );
};

const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'transparent', width: '0%' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
        case 1: return { score, label: 'Weak', color: '#EF4444', width: '25%' };
        case 2: return { score, label: 'Fair', color: '#F59E0B', width: '50%' };
        case 3: return { score, label: 'Good', color: '#3B82F6', width: '75%' };
        case 4: return { score, label: 'Strong', color: 'var(--login-secondary)', width: '100%' };
        default: return { score: 0, label: 'Too Short', color: '#EF4444', width: '15%' };
    }
};

const Login = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const canvasRef = useRef(null);

    // Scroll Motion Physics Hooks
    const { scrollYProgress, scrollY } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    
    // Parallax Transforms
    const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -90]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.35]);
    const cardScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);
    const mockupRotateX = useTransform(scrollYProgress, [0.12, 0.38], [22, 0]);
    const mockupY = useTransform(scrollYProgress, [0.12, 0.38], [80, 0]);
    const blobShift = useTransform(scrollY, [0, 1200], [0, -220]);

    // Sticky Quick Login Floating Button State
    const [showQuickLogin, setShowQuickLogin] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 450) {
                setShowQuickLogin(true);
            } else {
                setShowQuickLogin(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Module Categories Filtering
    const [activeModuleCategory, setActiveModuleCategory] = useState('All');
    const allModules = [
        { id: 'directory', category: 'Academics', icon: Users, title: 'Student & Staff Directory', desc: 'Centralized biometric records, guardian contacts, digital IDs, and automated roll call logs.' },
        { id: 'analytics', category: 'Academics', icon: Cpu, title: 'AI-Powered Analytics', desc: 'Attendance trend forecasting, student risk detection, and intelligent grade trajectory insights.' },
        { id: 'ledger', category: 'Finance', icon: FileText, title: 'Automated Fee Ledger', desc: 'Dynamic fee structuring, instant digital receipts, automated SMS reminders, and defaulter logs.' },
        { id: 'timetable', category: 'Academics', icon: Calendar, title: 'Smart Timetable Generator', desc: 'Conflict-free class scheduling, faculty substitution management, and exam hall allocations.' },
        { id: 'exams', category: 'Academics', icon: Award, title: 'Exams & Report Cards', desc: 'Custom marksheets, GPA calculation, automated report card exports, and rank analytics.' },
        { id: 'comms', category: 'Security', icon: Globe, title: 'Parent & Staff Comms', desc: 'Direct mobile notices, circular dispatches, emergency alerts, and parent-teacher meeting logs.' },
    ];

    const filteredModules = activeModuleCategory === 'All' 
        ? allModules 
        : allModules.filter(m => m.category === activeModuleCategory);

    // Form selection & values
    const [activeTab, setActiveTab] = useState('signin');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('25');

    // Redirect to dashboard if already authenticated
    const isAlreadyAuth = localStorage.getItem('isAuthenticated') === 'true';

    // Role Selector
    const [selectedRole, setSelectedRole] = useState('Admin');
    const roles_list = [
        { id: 'Admin', label: 'Admin', icon: '🛡️' },
        { id: 'Staff', label: 'Staff', icon: '💼' },
        { id: 'Teacher', label: 'Teacher', icon: '👨‍🏫' },
        { id: 'Student', label: 'Student', icon: '🎓' },
    ];

    // Forgot Password Modal
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotSent, setForgotSent] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleForgotSubmit = (e) => {
        e.preventDefault();
        if (!forgotEmail.trim()) return;
        setForgotLoading(true);
        setTimeout(() => {
            setForgotLoading(false);
            setForgotSent(true);
        }, 1200);
    };

    const closeForgot = () => {
        setShowForgot(false);
        setTimeout(() => { setForgotSent(false); setForgotEmail(''); }, 400);
    };

    // Quick demo credentials loader
    const fillDemo = (role) => {
        if (role === 'admin') {
            setEmail('admin@titus.edu.in');
            setPassword('Admin@1234');
            setSelectedRole('Admin');
            addToast({ type: 'info', title: 'Demo Credentials Loaded', message: 'Loaded Admin credentials.' });
        } else if (role === 'teacher') {
            setEmail('teacher@titus.edu.in');
            setPassword('Teacher@1234');
            setSelectedRole('Teacher');
            addToast({ type: 'info', title: 'Demo Credentials Loaded', message: 'Loaded Teacher credentials.' });
        } else if (role === 'student') {
            setEmail('student@titus.edu.in');
            setPassword('Student@1234');
            setSelectedRole('Student');
            addToast({ type: 'info', title: 'Demo Credentials Loaded', message: 'Loaded Student credentials.' });
        }
    };

    // Interactive cursor state for parallax effect
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState([]);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const x = (clientX - window.innerWidth / 2) / 35;
        const y = (clientY - window.innerHeight / 2) / 35;
        setMouseCoords({ x, y });
    };

    // Canvas Background Particles Swarm
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const particles = Array.from({ length: 45 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.15 - 0.075,
            speedY: Math.random() * 0.15 - 0.075,
            opacity: Math.random() * 0.4 + 0.15
        }));

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(31, 85, 53, ${p.opacity})`;
                ctx.fill();

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;
            });
            animationFrameId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    if (isAlreadyAuth) {
        return <Navigate to="/dashboard" replace />;
    }

    // Form submission simulation
    const handleSubmit = (e) => {
        e.preventDefault();

        if (e.clientX && e.clientY) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const id = Date.now();
            setRipples(prev => [...prev, { x, y, id }]);
            setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userRole', selectedRole);
            addToast({
                type: 'success',
                title: activeTab === 'signin' ? `Welcome Back, ${selectedRole}!` : 'Account Created Successfully',
                message: activeTab === 'signin'
                    ? `Authenticated as ${selectedRole}. Access granted to TITUS Enterprise Hub.`
                    : `Account registered for ${firstName} ${lastName}. Logging in...`
            });
            navigate('/dashboard');
        }, 1200);
    };

    const scrollToCompany = () => {
        const elem = document.getElementById('website-showcase');
        if (elem) {
            elem.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToTop = () => {
        const container = document.querySelector('.login-page-container');
        if (container) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const slowStaggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.16,
                delayChildren: 0.1
            }
        }
    };

    const slowSlideUpItem = {
        hidden: { opacity: 0, y: 45, scale: 0.94, filter: 'blur(6px)' },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, x: 50, scale: 0.95, filter: 'blur(10px)' },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 20,
                staggerChildren: 0.08,
                delayChildren: 0.4
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <main className="login-page-container" onMouseMove={handleMouseMove}>
            {/* Top Glowing Scroll Progress Indicator */}
            <motion.div className="top-scroll-progress" style={{ scaleX }} />

            {/* Canvas Particles Layer */}
            <canvas ref={canvasRef} className="bg-particles-layer" />

            {/* Ambient Aurora Glow Blobs with Scroll Parallax */}
            <div className="bg-mesh-layer" />
            <div className="bg-grid-layer" />
            <motion.div className="bg-glow-blobs" style={{ y: blobShift }}>
                <motion.div
                    className="glow-blob blob-blue"
                    animate={{ x: -mouseCoords.x * 0.8, y: -mouseCoords.y * 0.8 }}
                    transition={{ type: "spring", stiffness: 80, damping: 25 }}
                />
                <motion.div
                    className="glow-blob blob-purple"
                    animate={{ x: mouseCoords.x * 0.5, y: mouseCoords.y * 0.5 }}
                    transition={{ type: "spring", stiffness: 80, damping: 25 }}
                />
                <motion.div
                    className="glow-blob blob-cyan"
                    animate={{ x: -mouseCoords.x * 0.6, y: -mouseCoords.y * 0.6 }}
                    transition={{ type: "spring", stiffness: 80, damping: 25 }}
                />
            </motion.div>

            {/* ─── FOLD 1: 100VH FULLSCREEN LOGIN HERO WITH SCROLL PARALLAX ─── */}
            <div className="login-viewport-fullscreen">
                {/* Left Hero Content */}
                <motion.section className="login-hero-section" style={{ y: heroY, opacity: heroOpacity }}>
                    <motion.div
                        className="hero-content-wrapper"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="hero-pill-badge">
                            <span className="live-dot" /> NextGen Campus ERP Solution
                        </motion.div>

                        <motion.h1 className="hero-heading" variants={itemVariants}>
                            Empowering <span className="gradient-text">Academic Excellence</span> with Intelligent Automation.
                        </motion.h1>
                        <motion.p className="hero-subtitle" variants={itemVariants}>
                            TITUS Enterprise Hub unifies attendance tracking, student analytics, finance automation, and campus security into a liquid glass portal.
                        </motion.p>
                    </motion.div>

                    {/* Floating Liquid Glass Cards */}
                    <div className="illustration-workspace">
                        <FloatingCard
                            title="Active Students"
                            val={<CountUpOnScroll to={2450} suffix="" />}
                            icon={PieChart}
                            className="card-analytics"
                            delay={0.2}
                            mouseCoords={mouseCoords}
                        />
                        <FloatingCard
                            title="Daily Attendance"
                            val="94.2% Rate"
                            icon={Check}
                            className="card-document"
                            delay={0.4}
                            mouseCoords={mouseCoords}
                        />
                        <FloatingCard
                            title="AI Spark Assistant"
                            val="Live & Ready"
                            icon={Bot}
                            className="card-assistant"
                            delay={0.6}
                            mouseCoords={mouseCoords}
                        />
                        <FloatingCard
                            title="Fiscal Reconciliation"
                            val="₹18.4L Goal"
                            icon={FileText}
                            className="card-attendance"
                            delay={0.8}
                            mouseCoords={mouseCoords}
                        />

                        {/* Central Ambient Hero Graphic */}
                        <svg className="interactive-illustration-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="200" cy="200" r="140" stroke="rgba(31, 85, 53, 0.2)" strokeWidth="2" strokeDasharray="6 6" />
                            <circle cx="200" cy="200" r="100" stroke="rgba(163, 217, 92, 0.3)" strokeWidth="2" />
                            <circle cx="200" cy="200" r="60" fill="url(#hero-circle-grad)" opacity="0.8" />
                            <defs>
                                <linearGradient id="hero-circle-grad" x1="140" y1="140" x2="260" y2="260" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="rgba(163, 217, 92, 0.4)" />
                                    <stop offset="1" stopColor="rgba(31, 85, 53, 0.6)" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Scroll Down Action Button */}
                    <motion.button 
                        onClick={scrollToCompany}
                        className="scroll-indicator-btn"
                        animate={{ y: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                        <span>Scroll to explore TITUS Platform</span>
                        <ArrowDown size={14} />
                    </motion.button>
                </motion.section>

                {/* Right Form Card */}
                <motion.section className="login-form-section" style={{ scale: cardScale }}>
                    <motion.div
                        className="login-glass-card"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="card-header">
                            <div className="logo-badge">T</div>
                            <h2 className="card-title">TITUS Enterprise</h2>
                            <p className="card-subtitle">Sign in to access your institutional portal</p>
                        </div>

                        {/* Role Selector Grid */}
                        <div style={{ marginBottom: '18px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--login-text-secondary)', display: 'block', marginBottom: '8px' }}>
                                Select User Portal Role
                            </span>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {roles_list.map(role => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRole(role.id)}
                                        style={{
                                            padding: '8px 4px',
                                            borderRadius: '10px',
                                            border: selectedRole === role.id ? '1px solid var(--login-secondary)' : '1px solid var(--login-glass-border)',
                                            background: selectedRole === role.id ? 'rgba(31, 85, 53, 0.12)' : 'rgba(255, 255, 255, 0.4)',
                                            color: selectedRole === role.id ? 'var(--login-secondary)' : 'var(--login-text-secondary)',
                                            fontWeight: selectedRole === role.id ? 700 : 500,
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '14px' }}>{role.icon}</span>
                                        {role.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Switcher */}
                        <motion.div className="tabs-control" variants={itemVariants}>
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                                onClick={() => setActiveTab('signin')}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                                onClick={() => setActiveTab('signup')}
                            >
                                Register
                            </button>
                            <motion.div
                                className="active-tab-indicator"
                                animate={{
                                    left: activeTab === 'signin' ? '4px' : '50%',
                                    width: 'calc(50% - 4px)'
                                }}
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                        </motion.div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="form-wrapper">
                            <AnimatePresence mode="wait">
                                {activeTab === 'signin' ? (
                                    <motion.div
                                        key="signin-form"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                                    >
                                        <PremiumInput
                                            id="email-login"
                                            label="Institutional Email"
                                            type="email"
                                            icon={Mail}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <PremiumInput
                                            id="password-login"
                                            label="Password"
                                            type={showPassword ? "text" : "password"}
                                            icon={Lock}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            helpIcon={
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--login-text-secondary)', padding: 0 }}
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            }
                                        />

                                        <div className="form-helpers">
                                            <label className="remember-me">
                                                <input type="checkbox" /> Remember session
                                            </label>
                                            <a href="#forgot" className="forgot-password" onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>
                                                Forgot password?
                                            </a>
                                        </div>

                                        {/* Quick Demo Credentials Fill Chips */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '2px 0 4px' }}>
                                            <span style={{ fontSize: '11px', color: 'var(--login-text-secondary)', fontWeight: 600 }}>Quick Demo:</span>
                                            <button type="button" className="demo-chip" onClick={() => fillDemo('admin')}>⚡ Admin</button>
                                            <button type="button" className="demo-chip" onClick={() => fillDemo('teacher')}>⚡ Teacher</button>
                                            <button type="button" className="demo-chip" onClick={() => fillDemo('student')}>⚡ Student</button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="signup-form"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                                    >
                                        <div className="form-row">
                                            <PremiumInput
                                                id="firstname"
                                                label="First Name"
                                                icon={User}
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                            <PremiumInput
                                                id="lastname"
                                                label="Last Name"
                                                icon={User}
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>

                                        <PremiumInput
                                            id="email-reg"
                                            label="Email Address"
                                            type="email"
                                            icon={Mail}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <PremiumInput
                                            id="password-reg"
                                            label="Password"
                                            type={showPassword ? "text" : "password"}
                                            icon={Lock}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            helpIcon={
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--login-text-secondary)', padding: 0 }}
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            }
                                        />

                                        {password && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                style={{ marginTop: '-8px', marginBottom: '4px' }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--login-text-secondary)', fontWeight: 500 }}>Password Strength</span>
                                                    <span style={{ fontSize: '11px', color: getPasswordStrength(password).color, fontWeight: 700 }}>{getPasswordStrength(password).label}</span>
                                                </div>
                                                <div style={{ width: '100%', height: '5px', background: 'rgba(0, 0, 0, 0.04)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                                                    <motion.div
                                                        animate={{
                                                            width: getPasswordStrength(password).width,
                                                            background: getPasswordStrength(password).color
                                                        }}
                                                        transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                                        style={{ height: '100%', borderRadius: '10px' }}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        <PremiumInput
                                            id="age"
                                            label="Age"
                                            icon={HelpCircle}
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            options={[
                                                { value: '25', label: '25' },
                                                { value: '26', label: '26' },
                                                { value: '27', label: '27' },
                                                { value: '28', label: '28' }
                                            ]}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                {ripples.map(r => (
                                    <span key={r.id} className="btn-ripple" style={{ left: r.x, top: r.y }} />
                                ))}
                                {isLoading ? (
                                    <>
                                        <span className="btn-spinner" /> Authenticating...
                                    </>
                                ) : (
                                    <>
                                        {activeTab === 'signin' ? `Sign In as ${selectedRole}` : 'Create Account'}
                                        <ArrowRight size={16} style={{ marginLeft: 8 }} />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Social logins */}
                        <motion.div className="social-divider" variants={itemVariants}>
                            <span>OR CONTINUE WITH</span>
                        </motion.div>

                        <motion.div className="social-grid" variants={itemVariants}>
                            <button className="social-login-btn" type="button" onClick={() => addToast({ type: 'info', title: 'OAuth Sign-in', message: 'Redirecting to Google login...' })}>
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
                                Google SSO
                            </button>
                            <button className="social-login-btn" type="button" onClick={() => addToast({ type: 'info', title: 'OAuth Sign-in', message: 'Redirecting to Microsoft login...' })}>
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="SSO" />
                                Microsoft SSO
                            </button>
                        </motion.div>

                        {/* Footer */}
                        <motion.div className="card-footer" variants={itemVariants}>
                            By clicking continue, you agree to TITUS <a href="#terms">Terms</a> & <a href="#privacy">Privacy Policy</a>
                        </motion.div>
                    </motion.div>
                </motion.section>
            </div>

            {/* ─── FOLD 2 - 5: ENTERPRISE WEBSITE LANDING PAGE WITH 3D UNFOLDING & SCROLL TRIGGERS ─── */}
            <div id="website-showcase" className="website-landing-wrapper">
                
                {/* 3D Unfolding Product Dashboard Mockup with Interactive Hotspot Pins */}
                <motion.section 
                    className="landing-section product-preview-section"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="section-badge">✨ ENTERPRISE ERP ARCHITECTURE</div>
                    <h2 className="section-title">The Complete <span className="highlight-text">Operating System</span> for Modern Education</h2>
                    <p className="section-subtitle">
                        TITUS connects all school departments—from daily attendance registers and financial ledgers to parent communication and AI grade analytics.
                    </p>

                    <motion.div 
                        className="mockup-browser-window"
                        style={{
                            perspective: 1000,
                            rotateX: mockupRotateX,
                            y: mockupY,
                            position: 'relative'
                        }}
                    >
                        {/* Interactive Hotspot Pins */}
                        <div className="hotspot-pin pin-attendance" title="Realtime Biometric Attendance Sync">
                            <span className="pulse-dot" />
                            <span className="pin-tooltip">📍 Biometric Sync</span>
                        </div>
                        <div className="hotspot-pin pin-finance" title="Instant Digital Fee Ledger">
                            <span className="pulse-dot" />
                            <span className="pin-tooltip">📍 Instant Ledger</span>
                        </div>

                        <div className="mockup-header">
                            <div className="mockup-dots">
                                <span className="dot red" />
                                <span className="dot yellow" />
                                <span className="dot green" />
                            </div>
                            <div className="mockup-url-bar">https://app.titus-erp.edu.in/dashboard</div>
                        </div>

                        <div className="mockup-body">
                            <div className="mockup-sidebar-nav">
                                <div className="mockup-nav-item active"><LayoutDashboard size={14} /> Dashboard</div>
                                <div className="mockup-nav-item"><Users size={14} /> Students</div>
                                <div className="mockup-nav-item"><CheckCircle2 size={14} /> Attendance</div>
                                <div className="mockup-nav-item"><CreditCard size={14} /> Finance</div>
                            </div>
                            <div className="mockup-main-area">
                                <motion.div 
                                    className="mockup-grid"
                                    variants={slowStaggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    <motion.div className="mockup-card" variants={slowSlideUpItem}>
                                        <div className="mockup-card-title">Daily Attendance</div>
                                        <div className="mockup-card-val">94.8% <span className="green-pill">+2.4%</span></div>
                                    </motion.div>
                                    <motion.div className="mockup-card" variants={slowSlideUpItem}>
                                        <div className="mockup-card-title">Fiscal Collections</div>
                                        <div className="mockup-card-val">₹18.4L <span className="green-pill">Target Met</span></div>
                                    </motion.div>
                                    <motion.div className="mockup-card" variants={slowSlideUpItem}>
                                        <div className="mockup-card-title">Faculty On Duty</div>
                                        <div className="mockup-card-val">124 / 128</div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.section>

                {/* 6 Capability Cards with Category Filter Tabs & Staggered Entrance */}
                <motion.section 
                    className="landing-section"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="section-badge">🚀 CORE ERP MODULES</div>
                    <h2 className="section-title">Built to Handle Every Aspect of Campus Life</h2>

                    {/* Category Filter Tabs */}
                    <div className="module-filter-tabs">
                        {['All', 'Academics', 'Finance', 'Security'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveModuleCategory(cat)}
                                className={`module-filter-pill ${activeModuleCategory === cat ? 'active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <motion.div 
                        layout
                        className="features-grid-6"
                        variants={slowStaggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                    >
                        <AnimatePresence>
                            {filteredModules.map(mod => {
                                const IconComp = mod.icon;
                                return (
                                    <motion.div
                                        key={mod.id}
                                        layout
                                        variants={slowSlideUpItem}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="feature-card"
                                        whileHover={{ y: -8, scale: 1.02 }}
                                    >
                                        <div className="feature-icon"><IconComp size={22} /></div>
                                        <h3>{mod.title}</h3>
                                        <p>{mod.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </motion.section>

                {/* Impact Metrics Banner with Live Scroll Counter */}
                <motion.section 
                    className="landing-section metrics-banner-section"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div 
                        className="metrics-banner-grid"
                        variants={slowStaggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <motion.div className="metric-col" variants={slowSlideUpItem}>
                            <h4><CountUpOnScroll to={500} suffix="+" /></h4>
                            <p>Partner Institutions</p>
                        </motion.div>
                        <motion.div className="metric-col" variants={slowSlideUpItem}>
                            <h4>1.2M+</h4>
                            <p>Students Managed</p>
                        </motion.div>
                        <motion.div className="metric-col" variants={slowSlideUpItem}>
                            <h4>99.99%</h4>
                            <p>SLA Uptime Guarantee</p>
                        </motion.div>
                        <motion.div className="metric-col" variants={slowSlideUpItem}>
                            <h4>ISO 27001</h4>
                            <p>Certified Security</p>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Testimonials - Appearing One by One Slowly */}
                <motion.section 
                    className="landing-section"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="section-badge">💬 WHAT EDUCATORS SAY</div>
                    <h2 className="section-title">Trusted by Leading Educational Leaders</h2>

                    <motion.div 
                        className="testimonials-grid"
                        variants={slowStaggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.div className="testimonial-card" variants={slowSlideUpItem} whileHover={{ y: -4 }}>
                            <Quote size={24} className="quote-icon" />
                            <p>"TITUS transformed our daily operations. Attendance reporting and fee collection tracking take minutes instead of days."</p>
                            <div className="author-info">
                                <strong>Dr. R. K. Sharma</strong>
                                <span>Principal, Saint Xavier Campus</span>
                            </div>
                        </motion.div>

                        <motion.div className="testimonial-card" variants={slowSlideUpItem} whileHover={{ y: -4 }}>
                            <Quote size={24} className="quote-icon" />
                            <p>"The AI Spark assistant helps our faculty spot students needing academic support early in the term."</p>
                            <div className="author-info">
                                <strong>Ananya Sen</strong>
                                <span>Academic Director, Global International</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Multi-Column Website Footer - Appearing One by One Slowly */}
                <footer className="website-footer">
                    <motion.div 
                        className="footer-cols"
                        variants={slowStaggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <motion.div className="footer-col brand-col" variants={slowSlideUpItem}>
                            <div className="footer-logo"><div className="logo-badge">T</div> TITUS ERP</div>
                            <p>Next-generation educational institution management platform built for modern campuses.</p>
                        </motion.div>
                        <motion.div className="footer-col" variants={slowSlideUpItem}>
                            <h4>Modules</h4>
                            <a href="#attendance">Attendance Register</a>
                            <a href="#finance">Fee Ledger</a>
                            <a href="#timetable">Timetable Generator</a>
                            <a href="#exams">Exams & Grades</a>
                        </motion.div>
                        <motion.div className="footer-col" variants={slowSlideUpItem}>
                            <h4>Security</h4>
                            <a href="#compliance">ISO 27001 Compliance</a>
                            <a href="#rbac">Role-Based Access</a>
                            <a href="#backups">Automated Backups</a>
                        </motion.div>
                        <motion.div className="footer-col" variants={slowSlideUpItem}>
                            <h4>Support</h4>
                            <a href="#docs">Documentation</a>
                            <a href="#help">24/7 Priority Desk</a>
                            <a href="#privacy">Privacy Policy</a>
                        </motion.div>
                    </motion.div>

                    <div className="footer-bottom">
                        <span>© 2026 TITUS Educational Systems Inc. All rights reserved.</span>
                        <button onClick={scrollToTop} className="back-to-top-btn">
                            <span>Back to Sign In</span>
                            <ChevronUp size={14} />
                        </button>
                    </div>
                </footer>
            </div>

            {/* ─── Sticky Floating Quick Login Pill Button ─── */}
            <AnimatePresence>
                {showQuickLogin && (
                    <motion.button
                        initial={{ opacity: 0, y: 30, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="sticky-quick-login-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Zap size={14} />
                        <span>Quick Sign In</span>
                        <ArrowUp size={14} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ─── Forgot Password Modal Overlay ─── */}
            <AnimatePresence>
                {showForgot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeForgot}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.85, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            onClick={e => e.stopPropagation()}
                            style={{ background: 'var(--card-white)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '36px', maxWidth: '420px', width: '100%', boxShadow: 'var(--glass-shadow)', position: 'relative' }}
                        >
                            <button onClick={closeForgot} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)' }}>✕</button>
                            <AnimatePresence mode="wait">
                                {!forgotSent ? (
                                    <motion.div key="forgot-form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔑</div>
                                        <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Forgot Password?</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>Enter your institutional email address and we'll send you a secure password reset link.</p>
                                        <form onSubmit={handleForgotSubmit}>
                                            <div style={{ position: 'relative', marginBottom: '20px' }}>
                                                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                                <input
                                                    type="email"
                                                    placeholder="your@institution.edu.in"
                                                    value={forgotEmail}
                                                    onChange={e => setForgotEmail(e.target.value)}
                                                    required
                                                    style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter,sans-serif', color: 'var(--text-primary)' }}
                                                />
                                            </div>
                                            <motion.button
                                                type="submit"
                                                disabled={forgotLoading}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="btn-primary"
                                                style={{ width: '100%', padding: '13px' }}
                                            >
                                                {forgotLoading ? <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Sending...</> : <><ArrowRight size={16} /> Send Reset Link</>}
                                            </motion.button>
                                        </form>
                                        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>Remember it? <span style={{ color: 'var(--primary-dark)', fontWeight: 600, cursor: 'pointer' }} onClick={closeForgot}>Sign In</span></p>
                                    </motion.div>
                                ) : (
                                    <motion.div key="forgot-sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '12px 0' }}>
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} style={{ fontSize: '56px', marginBottom: '16px' }}>📬</motion.div>
                                        <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Check Your Inbox</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>A secure reset link has been dispatched to <strong style={{ color: 'var(--text-primary)' }}>{forgotEmail}</strong>. Check your spam folder if not received within 2 minutes.</p>
                                        <motion.button whileHover={{ scale: 1.02 }} onClick={closeForgot} className="btn-primary" style={{ marginTop: '24px', padding: '12px 32px' }}>Back to Sign In</motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default Login;

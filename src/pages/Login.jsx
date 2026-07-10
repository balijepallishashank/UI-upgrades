import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, Lock, User, HelpCircle, ArrowRight, PieChart, 
    Bot, Calendar, FileText, Sparkles, ChevronDown, Check
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import './Login.css';

// Custom Count Up component for stats in floating cards
const CountUp = ({ to, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        let animationFrameId;

        const updateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / (duration * 1000);

            if (progress < 1) {
                setCount(Math.floor(to * progress));
                animationFrameId = requestAnimationFrame(updateCount);
            } else {
                setCount(to);
            }
        };

        animationFrameId = requestAnimationFrame(updateCount);
        return () => cancelAnimationFrame(animationFrameId);
    }, [to, duration]);

    return <span>{count}</span>;
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
                y: [0, -10, 0],
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
                    y: {
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut",
                        delay: delay + 0.5
                    },
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
        case 4: return { score, label: 'Strong', color: '#10B981', width: '100%' };
        default: return { score: 0, label: 'Too Short', color: '#EF4444', width: '15%' };
    }
};

const Login = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const canvasRef = useRef(null);

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        if (isAuth) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    // Form selection & values
    const [activeTab, setActiveTab] = useState('signin');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('25');

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

    // Interactive cursor state for parallax effect
    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState([]);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        // Calculate offset from center of window
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

        // Generate slow-moving stars/particles
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
                ctx.fillStyle = `rgba(37, 99, 235, ${p.opacity})`;
                ctx.fill();

                p.x += p.speedX;
                p.y += p.speedY;

                // Infinite wrapping bounds
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

    // Form submission simulation
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Add Button Ripple effect coords
        if (e.clientX && e.clientY) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const id = Date.now();
            setRipples(prev => [...prev, { x, y, id }]);
            setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
        }

        setIsLoading(true);

        // Simulate secure API verify
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

    // Stagger layout animation values
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
            {/* Canvas Particles Layer */}
            <canvas ref={canvasRef} className="bg-particles-layer" />

            {/* Subtle Grid and Glow Blobs background layers */}
            <div className="bg-mesh-layer" />
            <div className="bg-grid-layer" />
            <div className="bg-glow-blobs">
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
            </div>

            {/* --- Left Side: Hero Section --- */}
            <section className="login-hero-section">
                <motion.div 
                    className="hero-content-wrapper"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 className="hero-heading" variants={itemVariants}>
                        Welcome to <span className="gradient-text">TITUS</span>
                    </motion.h1>
                    <motion.p className="hero-subtitle" variants={itemVariants}>
                        AI-Powered Academic & Institutional Management Platform
                    </motion.p>
                </motion.div>

                {/* Orbiting SVG Illustration Workspace */}
                <div className="illustration-workspace">
                    <motion.div
                        animate={{ 
                            x: mouseCoords.x * 0.6, 
                            y: mouseCoords.y * 0.6,
                            rotateX: -mouseCoords.y * 0.15,
                            rotateY: mouseCoords.x * 0.15
                        }}
                        transition={{ type: "spring", stiffness: 80, damping: 20 }}
                        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                    >
                        <svg className="interactive-illustration-svg" viewBox="0 0 400 400">
                             {/* Orbit lines */}
                             <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(163, 217, 92, 0.15)" strokeWidth="1.5" strokeDasharray="6, 6">
                                 <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="40s" repeatCount="indefinite" />
                             </circle>
                             <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(31, 85, 53, 0.12)" strokeWidth="1.5" strokeDasharray="4, 4">
                                 <animateTransform attributeName="transform" type="rotate" from="360 200 200" to="0 200 200" dur="25s" repeatCount="indefinite" />
                             </circle>
                             <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(88, 114, 144, 0.18)" strokeWidth="1.5">
                                 <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="15s" repeatCount="indefinite" />
                             </circle>
 
                             {/* Connecting AI Network Lines */}
                             <line x1="200" y1="200" x2="140" y2="140" stroke="rgba(163, 217, 92, 0.3)" strokeWidth="2" />
                             <line x1="200" y1="200" x2="270" y2="160" stroke="rgba(31, 85, 53, 0.25)" strokeWidth="2" />
                             <line x1="200" y1="200" x2="230" y2="280" stroke="rgba(88, 114, 144, 0.3)" strokeWidth="2" />
                             <line x1="200" y1="200" x2="130" y2="240" stroke="rgba(163, 217, 92, 0.2)" strokeWidth="2" />
 
                             {/* Central Pulsing AI Core */}
                             <circle cx="200" cy="200" r="30" fill="url(#centralCoreGrad)" />
                             <circle cx="200" cy="200" r="30" fill="none" stroke="rgba(163, 217, 92, 0.4)" strokeWidth="1">
                                 <animate attributeName="r" values="30;45;30" dur="3s" repeatCount="indefinite" />
                                 <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
                             </circle>
 
                             {/* Orbiting Platform node points */}
                             <circle cx="140" cy="140" r="10" fill="#A3D95C">
                                 <animate attributeName="cy" values="140;135;140" dur="4s" repeatCount="indefinite" />
                             </circle>
                             <circle cx="270" cy="160" r="8" fill="#1F5535">
                                 <animate attributeName="cx" values="270;275;270" dur="5s" repeatCount="indefinite" />
                             </circle>
                             <circle cx="230" cy="280" r="12" fill="#587290">
                                 <animate attributeName="cy" values="280;285;280" dur="3s" repeatCount="indefinite" />
                             </circle>
                             <circle cx="130" cy="240" r="9" fill="#86efac">
                                 <animate attributeName="cx" values="130;125;130" dur="6s" repeatCount="indefinite" />
                             </circle>
 
                             {/* Embedded Sparkles and Tech shapes */}
                             <polygon points="200,90 203,98 211,100 203,102 200,110 197,102 189,100 197,98" fill="#FBBF24">
                                 <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                             </polygon>
                             
                             {/* Gradients */}
                             <defs>
                                 <radialGradient id="centralCoreGrad" cx="50%" cy="50%" r="50%">
                                     <stop offset="0%" stopColor="#86efac" />
                                     <stop offset="70%" stopColor="#A3D95C" />
                                     <stop offset="100%" stopColor="#1F5535" />
                                 </radialGradient>
                             </defs>
                        </svg>
                    </motion.div>

                    {/* Floating Glass Feature Cards */}
                    <FloatingCard 
                        title="Live Analytics" 
                        val="60 FPS Live Streams" 
                        icon={PieChart} 
                        className="card-analytics" 
                        delay={0.6} 
                        mouseCoords={mouseCoords}
                    />
                    <FloatingCard 
                        title="Smart Docs" 
                        val="OCR Auto-sync" 
                        icon={FileText} 
                        className="card-document" 
                        delay={0.8} 
                        mouseCoords={mouseCoords}
                    />
                    <FloatingCard 
                        title="AI Assistant" 
                        val="Active Agent ready" 
                        icon={Bot} 
                        className="card-assistant" 
                        delay={1.0} 
                        mouseCoords={mouseCoords}
                    />
                    <FloatingCard 
                        title="Attendance" 
                        val={<><CountUp to={98} />% Present Today</>} 
                        icon={Calendar} 
                        className="card-attendance" 
                        delay={1.2} 
                        mouseCoords={mouseCoords}
                    />
                </div>
            </section>

            {/* --- Right Side: Login Card Section --- */}
            <section className="login-form-section">
                <motion.div 
                    className="login-glass-card"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="card-header" variants={itemVariants}>
                        <div className="logo-badge">T</div>
                        <h2 className="card-title">
                            {activeTab === 'signin' ? 'Welcome Back' : 'Get Started'}
                        </h2>
                        <span className="card-subtitle">
                            {activeTab === 'signin' 
                                ? 'Sign in to access your dashboard' 
                                : 'Create your secure institutional account'}
                        </span>
                    </motion.div>

                    {/* Role Selector */}
                    <motion.div variants={itemVariants} style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.04)', borderRadius: '10px', padding: '4px', marginBottom: '2px' }}>
                        {roles_list.map(r => (
                            <motion.button
                                key={r.id}
                                type="button"
                                onClick={() => setSelectedRole(r.id)}
                                whileTap={{ scale: 0.96 }}
                                style={{
                                    flex: 1, padding: '8px 0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    background: selectedRole === r.id ? 'white' : 'transparent',
                                    color: selectedRole === r.id ? 'var(--login-text-primary, #1D1D1D)' : 'var(--login-text-secondary, #587290)',
                                    boxShadow: selectedRole === r.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span style={{ fontSize: '15px' }}>{r.icon}</span>
                                {r.label}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Sliding Tab Control */}
                    <motion.div className="tabs-control" variants={itemVariants}>
                        <button 
                            className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                            onClick={() => setActiveTab('signin')}
                        >
                            Sign In
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                            onClick={() => setActiveTab('signup')}
                        >
                            Create Account
                        </button>
                        <motion.div 
                            className="tab-slider" 
                            animate={{ 
                                left: activeTab === 'signin' ? '4px' : '50%',
                                width: 'calc(50% - 4px)'
                            }}
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                    </motion.div>

                    {/* Form Component */}
                    <form onSubmit={handleSubmit} className="form-wrapper">
                        <AnimatePresence mode="wait">
                            {activeTab === 'signin' ? (
                                <motion.div 
                                    key="signin-form"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
                                >
                                    <PremiumInput 
                                        id="email-login"
                                        label="Email Address"
                                        type="email"
                                        icon={Mail}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <PremiumInput 
                                        id="password-login"
                                        label="Password"
                                        type="password"
                                        icon={Lock}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    <div className="form-helpers">
                                        <label className="remember-me">
                                            <input type="checkbox" /> Remember me
                                        </label>
                                        <a href="#forgot" className="forgot-password" onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>
                                            Forgot password?
                                        </a>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="signup-form"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
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
                                        type="password"
                                        icon={Lock}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    {password && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            style={{ marginTop: '-8px', marginBottom: '8px' }}
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
                                                    style={{ 
                                                        height: '100%', 
                                                        borderRadius: '10px'
                                                    }}
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
                                    {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
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
                        <button className="social-login-btn" type="button" onClick={() => addToast({ type: 'info', title: 'OAuth Sign-in', message: 'Redirecting to Google login portal...' })}>
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
                            Google
                        </button>
                        <button className="social-login-btn" type="button" onClick={() => addToast({ type: 'info', title: 'OAuth Sign-in', message: 'Redirecting to Facebook login portal...' })}>
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" />
                            Facebook
                        </button>
                    </motion.div>

                    {/* Card Footer */}
                    <motion.div className="card-footer" variants={itemVariants}>
                        By clicking continue, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>
                    </motion.div>
                </motion.div>
            </section>

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
                            style={{ background: 'white', borderRadius: '20px', padding: '36px', maxWidth: '420px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', position: 'relative' }}
                        >
                            <button onClick={closeForgot} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#666' }}>✕</button>
                            <AnimatePresence mode="wait">
                                {!forgotSent ? (
                                    <motion.div key="forgot-form" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                        <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔑</div>
                                        <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1D1D1D', marginBottom: '8px' }}>Forgot Password?</h3>
                                        <p style={{ color: '#587290', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>Enter your institutional email address and we'll send you a secure password reset link.</p>
                                        <form onSubmit={handleForgotSubmit}>
                                            <div style={{ position: 'relative', marginBottom: '20px' }}>
                                                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#587290' }} />
                                                <input
                                                    type="email"
                                                    placeholder="your@institution.edu.in"
                                                    value={forgotEmail}
                                                    onChange={e => setForgotEmail(e.target.value)}
                                                    required
                                                    style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid #EAEAEA', borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'Inter,sans-serif', color: '#1D1D1D' }}
                                                />
                                            </div>
                                            <motion.button
                                                type="submit"
                                                disabled={forgotLoading}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #1F5535, #2d7a4f)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                            >
                                                {forgotLoading ? <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Sending...</> : <><ArrowRight size={16} /> Send Reset Link</>}
                                            </motion.button>
                                        </form>
                                        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#587290' }}>Remember it? <span style={{ color: '#1F5535', fontWeight: 600, cursor: 'pointer' }} onClick={closeForgot}>Sign In</span></p>
                                    </motion.div>
                                ) : (
                                    <motion.div key="forgot-sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '12px 0' }}>
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} style={{ fontSize: '56px', marginBottom: '16px' }}>📬</motion.div>
                                        <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1D1D1D', marginBottom: '8px' }}>Check Your Inbox</h3>
                                        <p style={{ color: '#587290', fontSize: '14px', lineHeight: '1.6' }}>A secure reset link has been dispatched to <strong style={{ color: '#1D1D1D' }}>{forgotEmail}</strong>. Check your spam folder if not received within 2 minutes.</p>
                                        <motion.button whileHover={{ scale: 1.02 }} onClick={closeForgot} style={{ marginTop: '24px', padding: '12px 32px', background: '#1F5535', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Back to Sign In</motion.button>
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

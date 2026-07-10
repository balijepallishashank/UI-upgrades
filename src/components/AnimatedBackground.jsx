import React from 'react';
import { useLocation } from 'react-router-dom';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
    const location = useLocation();
    
    // Disable or reduce opacity on data-heavy pages
    const isDataPage = ['/attendance', '/attendance-reports', '/reports', '/employees', '/students', '/staff'].includes(location.pathname);
    
    if (isDataPage) return null; // Or render with extremely low opacity, but disabling is cleanest

    return (
        <div className="animated-background">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
        </div>
    );
};

export default AnimatedBackground;

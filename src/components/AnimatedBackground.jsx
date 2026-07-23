import React from 'react';
import { useLocation } from 'react-router-dom';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
    const location = useLocation();
    
    // Subtle ambient opacity on data-heavy pages
    const isDataPage = ['/attendance', '/attendance-reports', '/reports', '/employees', '/students', '/staff', '/finance', '/inventory'].includes(location.pathname);

    return (
        <div className={`animated-background ${isDataPage ? 'ambient-subtle' : ''}`}>
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
            <div className="blob blob-4"></div>
        </div>
    );
};

export default AnimatedBackground;

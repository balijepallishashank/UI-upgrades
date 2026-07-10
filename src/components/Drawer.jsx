import React from 'react';
import { X } from 'lucide-react';
import './Drawer.css';

const Drawer = ({ isOpen, onClose, title, children }) => {
    return (
        <>
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3>{title}</h3>
                    <button className="drawer-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="drawer-content">
                    {children}
                </div>
            </div>
        </>
    );
};

export default Drawer;

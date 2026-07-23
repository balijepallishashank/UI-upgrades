import React from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

/**
 * Reusable KPI/stat card component.
 * Props: title, value, icon (Lucide component), color (hex/rgb), subtext
 */
const KPICard = ({ title, value, icon: Icon, color, subtext }) => (
    <motion.div
        variants={itemVariants}
        className="card"
        style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
        whileHover={{ y: -6, scale: 1.025, rotateX: 2, rotateY: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
    >
        <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color, flexShrink: 0
        }}>
            {Icon && <Icon size={20} />}
        </div>
        <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>{title}</p>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
            </h3>
            {subtext && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtext}</p>}
        </div>
    </motion.div>
);

export default KPICard;

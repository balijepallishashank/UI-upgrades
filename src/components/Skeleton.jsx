import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ width = '100%', height = '20px', borderRadius = '8px', style = {} }) => {
    return (
        <motion.div
            style={{
                width,
                height,
                borderRadius,
                background: 'linear-gradient(90deg, var(--bg-color) 25%, var(--border-color) 50%, var(--bg-color) 75%)',
                backgroundSize: '200% 100%',
                ...style
            }}
            animate={{ backgroundPosition: ['100% 0', '-100% 0'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
    );
};

export default Skeleton;

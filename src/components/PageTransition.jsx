import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 15, scale: 0.99 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -15, scale: 0.99 }
};

const pageTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ width: '100%', height: '100%' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;

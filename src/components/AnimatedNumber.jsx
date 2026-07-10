import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';

const AnimatedNumber = ({ value, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    
    // We use a spring for smooth, natural counting
    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 20,
        mass: 1,
    });

    useEffect(() => {
        if (isInView) {
            const timeout = setTimeout(() => {
                springValue.set(value);
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [value, springValue, delay, isInView]);

    // Transform the raw spring float into a rounded string
    const rounded = useTransform(springValue, (latest) => Math.round(latest));

    return <motion.span ref={ref}>{rounded}</motion.span>;
};

export default AnimatedNumber;

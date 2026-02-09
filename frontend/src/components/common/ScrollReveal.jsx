import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({ children, width = '100%', delay = 0 }) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;

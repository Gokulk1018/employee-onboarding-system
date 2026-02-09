import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

const CountUp = ({ value, duration = 2, decimals = 0, prefix = '', suffix = '' }) => {
    const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
    const display = useTransform(spring, (current) => {
        // Fix to ensure we land exactly on the target value at the end if needed,
        // but spring physics usually handle this.
        // We format the number with commas and specified decimals.
        // For integers (decimals=0), standard locale string is good.
        // For floats, we utilize toFixed logic inside the formatter.

        // However, useTransform runs on every frame.
        // Let's keep it efficient.

        let formatted = current.toFixed(decimals);
        // Add commas strictly for integer part if it's a standard number
        // Or generic locale string approach

        if (decimals === 0) {
            formatted = Math.round(current).toLocaleString('en-US');
        } else {
            const parts = parseFloat(formatted).toString().split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            formatted = parts.join('.');
            // Ensure trailing zeros if needed based on decimals (toFixed does this, but parseFloat(..).toString might strip them if I'm not careful. 
            // Actually toFixed returns a string with trailing zeros. 
            // Let's stick to localeString which supports options.

            formatted = current.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        }

        return `${prefix}${formatted}${suffix}`;
    });

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    return <motion.span>{display}</motion.span>;
};

export default CountUp;

import React from 'react';
import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <Button
            type="text"
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{
                color: isDarkMode ? '#fbbf24' : '#f59e0b',
                background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: 'none'
            }}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDarkMode ? 'dark' : 'light'}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                >
                    {isDarkMode ? <SunOutlined style={{ fontSize: '1.2rem' }} /> : <MoonOutlined style={{ fontSize: '1.2rem' }} />}
                </motion.div>
            </AnimatePresence>
        </Button>
    );
};

export default ThemeToggle;

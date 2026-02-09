import React from 'react';
import { Button, theme } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';



const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { token } = theme.useToken();

    return (
        <motion.button
            onClick={toggleTheme}
            className={`relative flex items-center justify-center w-12 h-12 rounded-full outline-none focus:outline-none overflow-hidden`}
            style={{
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorder}`,
                cursor: 'pointer',
                boxShadow: token.boxShadow,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDarkMode ? 'dark' : 'light'}
                    initial={{ y: -30, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 30, opacity: 0, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    style={{ position: 'absolute' }}
                >
                    {isDarkMode ? (
                        <MoonOutlined style={{ fontSize: 20, color: token.colorWarning }} />
                    ) : (
                        <SunOutlined style={{ fontSize: 20, color: token.colorWarning }} />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Background Glow Effect */}
            <motion.div
                layoutId="glow"
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: isDarkMode
                        ? `radial-gradient(circle at center, ${token.colorPrimary}25 0%, transparent 70%)`
                        : `radial-gradient(circle at center, ${token.colorWarning}25 0%, transparent 70%)`,
                    zIndex: -1
                }}
            />
        </motion.button>
    );
};

export default ThemeToggle;

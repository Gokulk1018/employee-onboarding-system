import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const { Title, Text } = Typography;

const SplashScreen = () => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('hasSeenSplash', 'true');
            navigate('/login');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            transition={{ duration: 0.8 }}
            className={`page ${isDarkMode ? 'dark' : 'light'} ${isDarkMode ? 'mesh-gradient' : ''}`}
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                color: isDarkMode ? '#fff' : '#0f172a'
            }}
        >
            {/* Floating Glass Shapes */}
            <motion.div
                animate={{
                    y: [0, -40, 0],
                    x: [0, 20, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    top: '15%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    filter: 'blur(60px)',
                }}
            />
            <motion.div
                animate={{
                    y: [0, 50, 0],
                    x: [0, -30, 0],
                    rotate: [0, -15, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '10%',
                    width: '400px',
                    height: '400px',
                    background: 'rgba(79, 70, 229, 0.2)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ textAlign: 'center', zIndex: 10 }}
            >
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
                    <motion.div
                        animate={{
                            boxShadow: ["0 0 20px rgba(79, 70, 229, 0.3)", "0 0 40px rgba(79, 70, 229, 0.6)", "0 0 20px rgba(79, 70, 229, 0.3)"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ borderRadius: '50%', padding: 12 }}
                    >
                        <img
                            src="https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg"
                            alt="HRFlow"
                            style={{ width: 100, height: 100 }}
                        />
                    </motion.div>
                </div>

                <Title level={1} className="gradient-text-hero" style={{ margin: 0, fontSize: '4rem', fontWeight: 800, letterSpacing: '-2px' }}>
                    HRFlow
                </Title>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <Text style={{
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(15, 23, 42, 0.6)',
                        fontSize: '1.4rem',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        fontWeight: 300
                    }}>
                        Smart HR. Simple Workflow.
                    </Text>
                </motion.div>

                {/* Micro-loading dots */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 40 }}>
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            style={{ width: 6, height: 6, background: '#4f46e5', borderRadius: '50%' }}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;

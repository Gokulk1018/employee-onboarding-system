import React from 'react';
import { ConfigProvider, App as AntApp, theme as antTheme } from 'antd';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { themeConfig } from './config/theme';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Recruitment from './pages/Recruitment';
import Performance from './pages/Performance';
import Engagement from './pages/Engagement';
import Onboarding from './pages/Onboarding';
import Tasks from './pages/Tasks';
import Payroll from './pages/Payroll';
import Settings from './pages/Settings';
import './index.css';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import enUS from 'antd/locale/en_US';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { AnimatePresence } from 'framer-motion';

dayjs.locale('en');

import SplashScreen from './components/auth/SplashScreen';
import LoginPage from './pages/Login';
import EmployeePortal from './pages/EmployeePortal';
import ProtectedRoute from './components/auth/ProtectedRoute';

const RootRedirect = () => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash') === 'true';
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!hasSeenSplash) {
        return <Navigate to="/splash" replace />;
    }

    if (isAuthenticated) {
        return userRole === 'hr'
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/employee-portal" replace />;
    }

    return <Navigate to="/login" replace />;
};

const AppContent = () => {
    const { isDarkMode } = useTheme();
    const location = useLocation();

    return (
        <ConfigProvider
            locale={enUS}
            theme={{
                ...themeConfig,
                cssVar: true,
                algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
            }}
        >
            <AntApp>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<RootRedirect />} />
                        <Route path="/splash" element={<SplashScreen />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* HR Routes */}
                        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="employees" element={<Employees />} />
                            <Route path="recruitment" element={<Recruitment />} />
                            <Route path="performance" element={<Performance />} />
                            <Route path="engagement" element={<Engagement />} />
                            <Route path="onboarding" element={<Onboarding />} />
                            <Route path="tasks" element={<Tasks />} />
                            <Route path="payroll" element={<Payroll />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>

                        {/* Employee Routes */}
                        <Route path="/employee-portal" element={<ProtectedRoute><EmployeePortal /></ProtectedRoute>} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AnimatePresence>
            </AntApp>
        </ConfigProvider>
    );
};

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppContent />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;

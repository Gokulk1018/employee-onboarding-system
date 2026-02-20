import React, { lazy, Suspense } from 'react';
import { ConfigProvider, App as AntApp, theme as antTheme } from 'antd';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { themeConfig } from './config/theme';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import RecruitmentDashboard from './pages/RecruitmentDashboard';
import JobDetails from './pages/JobDetails';
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


dayjs.locale('en');

import SplashScreen from './components/auth/SplashScreen';
import LoginPage from './pages/Login';
const EmployeePortal = lazy(() => import('./pages/EmployeePortal'));
const EmployeeProfile = lazy(() => import('./pages/EmployeeProfile'));
const EmployeeTasks = lazy(() => import('./pages/EmployeeTasks'));
const EmployeeSettings = lazy(() => import('./pages/EmployeeSettings'));
const EmployeeLeave = lazy(() => import('./pages/EmployeeLeave'));
import ProtectedRoute from './components/auth/ProtectedRoute';
import OnboardingForm from './pages/OnboardingForm';
import ApplyJob from './pages/ApplyJob';
import EmployeePortalLayout from './components/layout/EmployeePortalLayout';

const RootRedirect = () => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash') === 'true';
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    // Skip splash if user is already authenticated or has seen it
    if (!hasSeenSplash && !isAuthenticated) {
        return <Navigate to="/splash" replace />;
    }

    if (isAuthenticated) {
        if (userRole === 'hr') return <Navigate to="/dashboard" replace />;
        if (userRole === 'onboarding') return <Navigate to="/onboarding/form" replace />;
        if (userRole === 'employee') return <Navigate to="/employee/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
};

import SessionTimeout from './components/auth/SessionTimeout';

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
                <SessionTimeout />
                <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<RootRedirect />} />
                        <Route path="/splash" element={<SplashScreen />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* HR Routes */}
                        <Route path="/" element={<ProtectedRoute allowedRole="hr"><MainLayout /></ProtectedRoute>}>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="employees" element={<Employees />} />
                            <Route path="recruitment" element={<RecruitmentDashboard />} />
                            <Route path="recruitment/jobs/:id" element={<JobDetails />} />
                            <Route path="performance" element={<Performance />} />
                            <Route path="engagement" element={<Engagement />} />
                            <Route path="onboarding" element={<Onboarding />} />
                            <Route path="tasks" element={<Tasks />} />
                            <Route path="payroll" element={<Payroll />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>

                        {/* Onboarding Flow */}
                        <Route path="/onboarding/form" element={<ProtectedRoute allowedRole="onboarding"><OnboardingForm /></ProtectedRoute>} />

                        {/* Employee Portal Routes */}
                        <Route path="/employee" element={<ProtectedRoute allowedRoles={['employee']}><EmployeePortalLayout /></ProtectedRoute>}>
                            <Route path="dashboard" element={<EmployeePortal />} />
                            <Route path="profile" element={<EmployeeProfile />} />
                            <Route path="tasks" element={<EmployeeTasks />} />
                            <Route path="leave" element={<EmployeeLeave />} />
                            <Route path="settings" element={<EmployeeSettings />} />
                        </Route>

                        {/* Public Job Application */}
                        <Route path="/jobs/:id/apply" element={<ApplyJob />} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </AntApp>
        </ConfigProvider>
    );
};

import { SettingsProvider } from './context/SettingsContext';

function App() {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <AppContent />
                </BrowserRouter>
            </SettingsProvider>
        </ThemeProvider>
    );
}

export default App;

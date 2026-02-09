import React from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <ConfigProvider theme={themeConfig}>
                <AntApp>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<Dashboard />} />
                                <Route path="employees" element={<Employees />} />
                                <Route path="recruitment" element={<Recruitment />} />
                                <Route path="performance" element={<Performance />} />
                                <Route path="engagement" element={<Engagement />} />
                                <Route path="onboarding" element={<Onboarding />} />
                                <Route path="tasks" element={<Tasks />} />

                                <Route path="payroll" element={<Payroll />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AntApp>
            </ConfigProvider>
        </ThemeProvider>
    );
}

export default App;

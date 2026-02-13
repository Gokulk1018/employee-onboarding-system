import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && userRole !== allowedRole) {
        if (userRole === 'hr') return <Navigate to="/dashboard" replace />;
        if (userRole === 'onboarding') return <Navigate to="/onboarding/form" replace />;
        if (userRole === 'employee') return <Navigate to="/employee/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

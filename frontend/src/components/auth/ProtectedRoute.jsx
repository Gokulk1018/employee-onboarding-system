import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && userRole !== allowedRole) {
        return userRole === 'hr'
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/employee-portal" replace />;
    }

    return children;
};

export default ProtectedRoute;

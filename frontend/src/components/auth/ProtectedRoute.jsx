import React from 'react';
import { Navigate } from 'react-router-dom';

import { useSettings } from '../../context/SettingsContext';

const ProtectedRoute = ({ children, allowedRole, allowedRoles, module }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole'); // hr, manager, employee
    const { settings } = useSettings();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Role check (base level)
    const roles = allowedRoles || (allowedRole ? [allowedRole] : null);
    if (roles && !roles.includes(userRole) && userRole !== 'hr') {
        return <Navigate to="/" replace />;
    }

    // Module permission check for non-HR users
    if (module && userRole !== 'hr' && settings) {
        const roleName = userRole.charAt(0).toUpperCase() + userRole.slice(1);
        const currentRole = (settings.roles || []).find(r => r.name === roleName);

        if (currentRole && !currentRole.permissions[module]) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;

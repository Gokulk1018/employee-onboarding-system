import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useSettings } from '../../context/SettingsContext';

const SessionTimeout = () => {
    const navigate = useNavigate();
    const { security } = useSettings();
    const timerRef = useRef(null);

    const logout = () => {
        const authKeys = ['isAuthenticated', 'token', 'userRole', 'username', 'candidateName', 'offerId'];
        authKeys.forEach(key => localStorage.removeItem(key));
        sessionStorage.clear();
        message.warning('Session expired due to inactivity');
        navigate('/login', { replace: true });
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);

        const timeoutMinutes = parseInt(security.sessionTimeout) || 30;
        const timeoutMs = timeoutMinutes * 60 * 1000;

        timerRef.current = setTimeout(logout, timeoutMs);
    };

    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        if (localStorage.getItem('isAuthenticated') === 'true') {
            resetTimer();
            events.forEach(event => window.addEventListener(event, handleActivity));
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [security.sessionTimeout, navigate]);

    return null;
};

export default SessionTimeout;

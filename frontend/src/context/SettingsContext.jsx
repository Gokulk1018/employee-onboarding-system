import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '../services/settingsService';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await getSettings();
            if (res.success) {
                setSettings(res.data);

                // Update browser tab title
                if (res.data.companyInfo?.companyName) {
                    document.title = res.data.companyInfo.companyName;
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const branding = {
        name: settings?.companyInfo?.companyName || 'HRFlow Inc.',
        logo: settings?.companyInfo?.logoUrl ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${settings.companyInfo.logoUrl}` : null,
        hrEmail: settings?.companyInfo?.hrEmail,
        phone: settings?.companyInfo?.phone,
        location: settings?.companyInfo?.location,
        timezone: settings?.companyInfo?.timezone
    };

    const security = settings?.security || {
        loginAlert: true,
        sessionTimeout: '30'
    };

    // Update favicon dynamically when branding logo changes
    useEffect(() => {
        if (branding.logo) {
            const link = document.querySelector("link[rel*='icon']");
            if (link) {
                link.href = branding.logo;
            } else {
                const newLink = document.createElement('link');
                newLink.rel = 'icon';
                newLink.href = branding.logo;
                document.getElementsByTagName('head')[0].appendChild(newLink);
            }
        }
    }, [branding.logo]);

    return (
        <SettingsContext.Provider value={{ settings, branding, security, loading, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

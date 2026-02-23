/**
 * Ant Design Theme Configuration - Enhanced "Anti-Gravity" UI
 * Aesthetic: Deep shadows, Glassmorphism, Premium Typography
 */
export const themeConfig = {
    cssVar: true,
    token: {
        colorPrimary: '#4f46e5', // Indigo-600
        colorInfo: '#3b82f6',    // Blue-500
        colorSuccess: '#10b981', // Emerald-500
        colorWarning: '#f59e0b', // Amber-500
        colorError: '#ef4444',   // Red-500
        borderRadius: 12,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    components: {
        Layout: {
            headerBg: 'transparent',
            bodyBg: 'transparent',
            siderBg: 'transparent',
        },
        Card: {
            paddingLG: 24,
            borderRadiusLG: 16,
        },
        Button: {
            fontWeight: 500,
            controlHeight: 40,
            controlHeightLG: 48,
            borderRadius: 8,
        },
        Table: {
            borderRadiusLG: 12,
            headerBg: 'transparent',
        },
        Menu: {
            itemBorderRadius: 8,
        },
        Input: {
            controlHeight: 40,
            borderRadius: 8,
        },
        Select: {
            controlHeight: 40,
            borderRadius: 8,
        }
    },
};

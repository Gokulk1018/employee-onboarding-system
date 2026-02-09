/**
 * Ant Design Theme Configuration
 * Aesthetic: "Anti-gravity" SaaS UI
 * - Soft shadows
 * - Rounded corners (12-16px)
 * - Light/Clean background
 * - Indigo Primary
 */
export const themeConfig = {
    token: {
        colorPrimary: '#6366f1', // Indigo-500
        colorInfo: '#3b82f6',    // Blue-500
        colorSuccess: '#10b981', // Emerald-500
        colorWarning: '#f59e0b', // Amber-500
        colorError: '#ef4444',   // Red-500
        colorTextBase: '#1e293b', // Slate-800
        colorBgLayout: '#f8fafc', // Slate-50
        borderRadius: 12,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        boxShadowSecondary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    components: {
        Layout: {
            bodyBg: '#f8fafc',
            headerBg: '#ffffff',
            siderBg: '#ffffff',
        },
        Card: {
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // Soft shadow
            paddingLG: 24,
            borderRadius: 16,
        },
        Button: {
            fontWeight: 500,
            controlHeight: 40,
            controlHeightLG: 48,
            controlHeightSM: 32,
            borderRadius: 8,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            primaryShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4), 0 2px 4px -1px rgba(99, 102, 241, 0.2)', // Indigo glow
        },
        Table: {
            borderRadiusLG: 12,
            headerBg: 'transparent',
            headerSplitColor: 'transparent',
            rowHoverBg: '#f1f5f9', // Slate-100
        },
        Menu: {
            itemSelectedBg: '#e0e7ff', // Indigo-100
            itemSelectedColor: '#4338ca', // Indigo-700
            itemBorderRadius: 8,
            itemMarginInline: 8,
        },
        Input: {
            controlHeight: 40,
            borderRadius: 8,
            activeBorderColor: '#6366f1',
            hoverBorderColor: '#818cf8',
        },
        Select: {
            controlHeight: 40,
            borderRadius: 8,
        }
    },
};

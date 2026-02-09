/**
 * Ant Design Theme Configuration - Enhanced "Anti-Gravity" UI
 * Aesthetic: Deep shadows, Glassmorphism, Premium Typography
 */
export const themeConfig = {
    token: {
        colorPrimary: '#4f46e5', // Indigo-600 - More vibrant
        colorInfo: '#3b82f6',    // Blue-500
        colorSuccess: '#10b981', // Emerald-500
        colorWarning: '#f59e0b', // Amber-500
        colorError: '#ef4444',   // Red-500
        colorTextBase: '#0f172a', // Slate-900 - Darker text for readability
        colorBgLayout: '#f1f5f9', // Slate-100 - Slightly darker bg for contrast
        borderRadius: 16,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        // Premium multi-layered shadows
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        boxShadowSecondary: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        boxShadowTertiary: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    components: {
        Layout: {
            bodyBg: '#f1f5f9',
            headerBg: 'rgba(255, 255, 255, 0.8)', // Semi-transparent for glass effect
            siderBg: '#ffffff',
        },
        Card: {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Stronger lift
            paddingLG: 24,
            borderRadius: 20, // Softer corners
        },
        Button: {
            fontWeight: 600,
            controlHeight: 44,
            controlHeightLG: 52,
            controlHeightSM: 36,
            borderRadius: 12,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            primaryShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4), 0 4px 6px -2px rgba(79, 70, 229, 0.2)', // Indigo glow
        },
        Table: {
            borderRadiusLG: 16,
            headerBg: 'transparent',
            headerSplitColor: 'transparent',
            rowHoverBg: '#e0e7ff', // Indigo-50 tint
        },
        Menu: {
            itemSelectedBg: '#e0e7ff', // Indigo-50
            itemSelectedColor: '#4338ca', // Indigo-700
            itemBorderRadius: 12,
            itemMarginInline: 12,
        },
        Input: {
            controlHeight: 44,
            borderRadius: 12,
            activeBorderColor: '#4f46e5',
            hoverBorderColor: '#6366f1',
        },
        Select: {
            controlHeight: 44,
            borderRadius: 12,
        }
    },
};

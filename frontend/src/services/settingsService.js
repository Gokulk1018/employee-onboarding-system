import api from './api';

export const getSettings = async () => {
    const response = await api.get('/settings');
    return response.data;
};

export const updateSettings = async (settings) => {
    const response = await api.put('/settings', settings);
    return response.data;
};

export const getRoles = async () => {
    const response = await api.get('/settings/roles');
    return response.data;
};

export const updateRolePermissions = async (id, permissions) => {
    const response = await api.put(`/settings/roles/${id}`, { permissions });
    return response.data;
};

export const changePassword = async (data) => {
    const response = await api.post('/settings/change-password', data);
    return response.data;
};

export const getUsers = async () => {
    const response = await api.get('/settings/users');
    return response.data;
};

export const toggleUserStatus = async (id, type) => {
    const response = await api.put(`/settings/users/${id}/toggle-status`, { type });
    return response.data;
};

export const uploadLogo = async (formData) => {
    const response = await api.post('/settings/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

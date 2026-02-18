const API_URL = 'http://localhost:5000/api/settings';

export const getSettings = async () => {
    const res = await fetch(`${API_URL}`);
    return await res.json();
};

export const updateSettings = async (settings) => {
    const res = await fetch(`${API_URL}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
    });
    return await res.json();
};

export const getRoles = async () => {
    const res = await fetch(`${API_URL}/roles`);
    return await res.json();
};

export const updateRolePermissions = async (id, permissions) => {
    const res = await fetch(`${API_URL}/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions })
    });
    return await res.json();
};

export const changePassword = async (data) => {
    const res = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await res.json();
};

export const getUsers = async () => {
    const res = await fetch(`${API_URL}/users`);
    return await res.json();
};

export const toggleUserStatus = async (id, type) => {
    const res = await fetch(`${API_URL}/users/${id}/toggle-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
    });
    return await res.json();
};

export const uploadLogo = async (formData) => {
    const res = await fetch(`${API_URL}/upload-logo`, {
        method: 'POST',
        body: formData
    });
    return await res.json();
};

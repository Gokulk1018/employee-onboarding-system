import api from './api';

export const applyLeave = async (leaveData) => {
    const response = await api.post('/leaves/apply', leaveData);
    return response.data;
};

export const getMyLeaves = async (employeeId) => {
    // If employeeId is provided, use it as query param (for dev/simulated auth)
    // Otherwise, the backend takes it from req.user/headers
    const url = employeeId ? `/leaves/my-leaves?employeeId=${employeeId}` : '/leaves/my-leaves';
    const response = await api.get(url);
    return response.data;
};

export const getAllLeaves = async () => {
    const response = await api.get('/leaves/all');
    return response.data;
};

export const updateLeaveStatus = async (id, status) => {
    const response = await api.put(`/leaves/${id}/status`, { status });
    return response.data;
};

export const cancelLeave = async (id) => {
    const response = await api.delete(`/leaves/${id}/cancel`);
    return response.data;
};

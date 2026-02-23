import api from './api';

// --- Form APIs ---
export const getForms = async () => {
    const response = await api.get('/engagement/forms');
    return response.data;
};

export const getFormById = async (id) => {
    const response = await api.get(`/engagement/forms/${id}`);
    return response.data;
};

export const createForm = async (formData) => {
    const response = await api.post('/engagement/forms', formData);
    return response.data;
};

export const submitResponse = async (responseData) => {
    const response = await api.post('/engagement/forms/respond', responseData);
    return response.data;
};

export const updateForm = async (id, formData) => {
    const response = await api.put(`/engagement/forms/${id}`, formData);
    return response.data;
};

export const deleteForm = async (id) => {
    const response = await api.delete(`/engagement/forms/${id}`);
    return response.data;
};

export const getFormAnalytics = async (id) => {
    const response = await api.get(`/engagement/forms/analytics/${id}`);
    return response.data;
};

// --- Request / Ticket APIs ---
export const getRequests = async () => {
    const response = await api.get('/engagement/request');
    return response.data;
};

export const createRequest = async (requestData) => {
    const response = await api.post('/engagement/request', requestData);
    return response.data;
};

export const updateRequest = async (id, updateData) => {
    const response = await api.put(`/engagement/request/${id}`, updateData);
    return response.data;
};

export const getWallResponses = async () => {
    const response = await api.get('/engagement/wall');
    return response.data;
};

export const replyToResponse = async (id, hrReply) => {
    const response = await api.put(`/engagement/responses/${id}/reply`, { hrReply });
    return response.data;
};

// --- Recognition APIs ---
export const getRecognitions = async () => {
    const response = await api.get('/engagement/recognitions');
    return response.data;
};

export const sendRecognition = async (recognitionData) => {
    const response = await api.post('/engagement/recognitions', recognitionData);
    return response.data;
};

export const toggleLike = async (id) => {
    const response = await api.put(`/engagement/recognitions/${id}/like`);
    return response.data;
};

// --- Insights API ---
export const getEngagementInsights = async () => {
    const response = await api.get('/engagement/insights');
    return response.data;
};

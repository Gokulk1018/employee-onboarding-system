import api from './api';

// Recognition (Kudos)
export const sendRecognition = async (data) => {
    const response = await api.post('/engagement/recognition', data);
    return response.data;
};

export const getRecognitions = async () => {
    const response = await api.get('/engagement/recognition');
    return response.data;
};

export const toggleLike = async (id) => {
    const response = await api.post(`/engagement/recognition/${id}/like`);
    return response.data;
};

// Feedback
export const submitFeedback = async (data) => {
    const response = await api.post('/engagement/feedback', data);
    return response.data;
};

export const getFeedback = async () => {
    const response = await api.get('/engagement/feedback');
    return response.data;
};

// Surveys
export const createSurvey = async (data) => {
    const response = await api.post('/engagement/survey', data);
    return response.data;
};

export const getSurveys = async () => {
    const response = await api.get('/engagement/survey');
    return response.data;
};

export const submitSurveyResponse = async (data) => {
    const response = await api.post('/engagement/survey/response', data);
    return response.data;
};

// Analytics
export const getEngagementAnalytics = async () => {
    const response = await api.get('/engagement/analytics');
    return response.data;
};

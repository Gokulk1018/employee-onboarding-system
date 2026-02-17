import api from './api';

// Goals
export const getGoals = async (employeeId) => {
    const params = employeeId ? { employeeId } : {};
    const response = await api.get('/performance/goals', { params });
    return response.data;
};

export const createGoal = async (goalData) => {
    const response = await api.post('/performance/goals', goalData);
    return response.data;
};

export const updateGoal = async (id, goalData) => {
    const response = await api.put(`/performance/goals/${id}`, goalData);
    return response.data;
};

// Reviews
export const submitReview = async (reviewData) => {
    const response = await api.post('/performance/reviews', reviewData);
    return response.data;
};

export const getPerformanceSummary = async (employeeId) => {
    const response = await api.get(`/performance/summary/${employeeId}`);
    return response.data;
};

export const getPendingReviews = async (reviewerId) => {
    // reviewerId is optional, backend uses req.user._id if not provided
    const url = reviewerId ? `/performance/pending/${reviewerId}` : '/performance/pending/me';
    // Wait, backend route was /pending/:reviewerId
    // I should probably ensure the backend handles 'me' or just use the ID from frontend store.
    const response = await api.get(reviewerId ? `/performance/pending/${reviewerId}` : '/performance/pending/all');
    return response.data;
};

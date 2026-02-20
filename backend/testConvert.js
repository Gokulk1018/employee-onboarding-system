const axios = require('axios');

const testConversion = async () => {
    const offerId = '698e97f0ff329f1d86abf3e7';
    try {
        console.log(`[TEST] Triggering conversion for ID: ${offerId}`);
        const response = await axios.post(`http://localhost:5000/api/offers/${offerId}/convert`);
        console.log('[SUCCESS] Response:', response.data);
    } catch (error) {
        console.log('[ERROR] Status:', error.response?.status);
        console.log('[ERROR] Message:', error.response?.data?.message);
    }
};

testConversion();

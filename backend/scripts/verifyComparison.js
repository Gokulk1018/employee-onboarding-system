const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/payroll/compare';
const EMPLOYEE_ID = '698abc360e1601d3350e3bf2';

async function verify() {
    try {
        console.log("Verifying Feb 2026 (vs Jan)...");
        const res1 = await axios.get(`${BASE_URL}/${EMPLOYEE_ID}/2026/Feb`);
        console.log("Feb Result:", res1.data);

        console.log("\nVerifying Mar 2026 (vs Feb)...");
        const res2 = await axios.get(`${BASE_URL}/${EMPLOYEE_ID}/2026/Mar`);
        console.log("Mar Result:", res2.data);

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

verify();

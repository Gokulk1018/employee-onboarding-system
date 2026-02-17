const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function verify() {
    try {
        console.log("1. Creating a new Job...");
        const jobRes = await axios.post(`${BASE_URL}/jobs`, {
            jobTitle: "Integration Test Job",
            department: "Testing",
            jobType: "Contract",
            experienceLevel: "Junior",
            location: "Remote",
            openings: 5,
            skills: ["Testing", "Automation"],
            jobDescription: "A job to test ID matching",
            salaryRange: "$50k",
            applicationDeadline: "2026-12-31"
        });

        if (!jobRes.data.success) {
            console.error("Failed to create job:", jobRes.data);
            return;
        }

        const job = jobRes.data.data;
        const jobId = job._id;
        console.log("Job Created. ID:", jobId);

        if (!jobId || jobId.length !== 24) {
            console.error("Invalid Job ID format:", jobId);
            return;
        }

        console.log("2. Applying to the Job...");
        const candidateRes = await axios.post(`${BASE_URL}/jobs/${jobId}/apply`, {
            name: "Test Candidate",
            email: `test.${Date.now()}@example.com`,
            phone: "1234567890",
            resumeUrl: "http://example.com/resume.pdf",
            skills: ["Testing"],
            experience: "3 years"
        });

        if (candidateRes.data.success) {
            console.log("Application Successful!");
            console.log("Candidate ID:", candidateRes.data.data._id);
            console.log("Job ID in Candidate:", candidateRes.data.data.jobId);
        } else {
            console.error("Application Failed:", candidateRes.data);
        }

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
    }
}

verify();

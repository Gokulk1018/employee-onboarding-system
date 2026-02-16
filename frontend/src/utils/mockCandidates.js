import dayjs from 'dayjs';

const MOCK_NAMES = ["Arjun", "Kiran", "Meera", "Rohit", "Ananya", "Vikram", "Sneha", "Rahul", "Priya", "Aman"];

const STAGES = ["Applied", "Screening", "Technical Round", "HR Interview"];

const getSkillsByTitle = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('frontend') || t.includes('react') || t.includes('ui')) {
        return ["React", "JS", "CSS", "Tailwind"];
    }
    if (t.includes('backend') || t.includes('node') || t.includes('architect')) {
        return ["Node", "MongoDB", "Express", "SQL"];
    }
    if (t.includes('devops') || t.includes('cloud')) {
        return ["Docker", "Kubernetes", "AWS", "CI/CD"];
    }
    if (t.includes('data') || t.includes('analyst') || t.includes('ml')) {
        return ["Python", "Pandas", "ML", "SQL"];
    }
    return ["Communication", "Problem Solving", "Teamwork"];
};

export const generateMockCandidates = (jobTitle) => {
    const count = Math.floor(Math.random() * 3) + 5; // 5-7 candidates
    const skills = getSkillsByTitle(jobTitle);

    return Array.from({ length: count }).map((_, index) => {
        const name = MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)];
        const firstName = name.toLowerCase();

        return {
            _id: `mock-${Date.now()}-${index}`,
            name: `${name} ${index + 1}`,
            email: `${firstName}${index + 1}@example.com`,
            experience: `${Math.floor(Math.random() * 6) + 1} yrs`,
            skills: skills.slice(0, Math.floor(Math.random() * 3) + 2), // 2-4 random skills
            stage: STAGES[Math.floor(Math.random() * STAGES.length)],
            status: 'PENDING',
            resumeUrl: '#',
            appliedAt: dayjs().subtract(Math.floor(Math.random() * 10), 'day').toISOString(),
            isMock: true // Flag to distinguish from real candidates
        };
    });
};

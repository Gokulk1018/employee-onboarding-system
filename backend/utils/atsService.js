/**
 * Enterprise ATS Candidate Evaluation Engine using Google Gemini AI API
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const analyzeCandidateATS = async (targetRole, resumeText = '', candidateSkills = [], candidateExp = '') => {
    const role = (targetRole || 'Software Engineer').trim();
    const skillsArray = Array.isArray(candidateSkills) ? candidateSkills : (candidateSkills ? [candidateSkills] : []);
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Try Google Gemini AI API if GEMINI_API_KEY is configured
    if (apiKey && apiKey !== 'your_gemini_api_key') {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `You are an enterprise-grade Applicant Tracking System (ATS), Senior Talent Acquisition Specialist, and Executive Technical Auditor. Analyze the candidate resume against the targeted job role and return strict JSON.

Input Data:
• Target Role: ${role}
• Candidate Skills: ${skillsArray.join(', ')}
• Experience: ${candidateExp}
• Candidate Resume:
"""
${resumeText || 'No resume text provided. Candidate skills: ' + skillsArray.join(', ')}
"""

Constraint Directives:
• Return ONLY valid JSON format.
• Do NOT wrap the JSON inside markdown code blocks (e.g. no \`\`\`json wrappers).
• Do NOT output any introductory text or closing commentary.

Strict JSON Response Schema:
{
  "targetRole": "${role}",
  "atsScore": 85,
  "hiringRecommendation": "Strong Shortlist",
  "hrBrief": "2-3 sentence executive summary for HR directors...",
  "skillsAnalysis": {
    "matchingSkills": ["Skill1", "Skill2"],
    "missingCriticalSkills": ["Skill1", "Skill2"],
    "bonusSkills": ["Skill1"]
  },
  "evaluationBreakdown": {
    "technicalFitScore": 85,
    "experienceDepthScore": 80,
    "impactMetricsScore": 90,
    "formattingClarityScore": 85
  },
  "auditInsights": {
    "topStrengths": ["Strength 1", "Strength 2"],
    "redFlagsOrGaps": ["Gap 1"]
  }
}`;

            const result = await model.generateContent(prompt);
            const textResponse = result.response.text().trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
            const parsed = JSON.parse(textResponse);
            if (parsed && typeof parsed.atsScore === 'number') {
                return parsed;
            }
        } catch (err) {
            console.error('Gemini AI API Error, using fallback engine:', err.message);
        }
    }

    // 2. Heuristic ATS Scoring Engine (Fallback when Gemini API Key is not set)
    const fullText = `${resumeText} ${skillsArray.join(' ')} ${candidateExp}`.toLowerCase();

    const roleSkillDatabase = {
        'frontend': ['react', 'javascript', 'typescript', 'css', 'html', 'tailwind', 'redux', 'next.js', 'vue', 'webpack', 'vite'],
        'backend': ['node.js', 'express', 'mongodb', 'sql', 'postgresql', 'rest api', 'graphql', 'python', 'docker', 'aws'],
        'full stack': ['react', 'node.js', 'javascript', 'typescript', 'mongodb', 'express', 'sql', 'rest api', 'docker', 'aws', 'git'],
        'data': ['python', 'sql', 'pandas', 'numpy', 'machine learning', 'scikit-learn', 'tensorflow', 'tableau', 'spark'],
        'hr': ['recruitment', 'onboarding', 'payroll', 'employee engagement', 'sourcing', 'ats', 'interviews', 'compliance']
    };

    let targetKeywords = roleSkillDatabase['full stack'];
    const roleLower = role.toLowerCase();
    for (const [key, keywords] of Object.entries(roleSkillDatabase)) {
        if (roleLower.includes(key)) {
            targetKeywords = keywords;
            break;
        }
    }

    const matchingSkills = [];
    const missingCriticalSkills = [];

    targetKeywords.forEach(skill => {
        if (fullText.includes(skill.toLowerCase())) {
            matchingSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
        } else {
            missingCriticalSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
        }
    });

    const expNumbers = fullText.match(/\b\d+\+?\s*(years?|yrs?)\b/gi) || [];
    let estYears = 3;
    if (expNumbers.length > 0) {
        const parsed = parseInt(expNumbers[0]);
        if (!isNaN(parsed)) estYears = parsed;
    }

    const techScore = Math.min(98, Math.max(50, Math.round((matchingSkills.length / Math.max(1, targetKeywords.length)) * 100)));
    const expScore = Math.min(95, Math.max(55, estYears * 18));
    const impactScore = (fullText.includes('%') || fullText.includes('increased') || fullText.includes('reduced') || fullText.includes('led')) ? 88 : 65;
    const formattingScore = resumeText.length > 50 ? 92 : 75;

    const atsScore = Math.round((techScore * 0.40) + (expScore * 0.30) + (impactScore * 0.20) + (formattingScore * 0.10));

    let hiringRecommendation = 'Hold / Reserve';
    if (atsScore >= 80) hiringRecommendation = 'Strong Shortlist';
    else if (atsScore >= 65) hiringRecommendation = 'Potential Interview';
    else if (atsScore < 50) hiringRecommendation = 'Reject';

    const hrBrief = `Candidate applied for ${role} with ~${estYears} years estimated experience. Achieved an ATS score of ${atsScore}% based on a ${techScore}% technical skill match (${matchingSkills.length} core matching skills) and quantified experience depth.`;

    return {
        targetRole: role,
        atsScore,
        hiringRecommendation,
        hrBrief,
        skillsAnalysis: {
            matchingSkills,
            missingCriticalSkills: missingCriticalSkills.slice(0, 4),
            bonusSkills: skillsArray.filter(s => !matchingSkills.includes(s))
        },
        evaluationBreakdown: {
            technicalFitScore: techScore,
            experienceDepthScore: expScore,
            impactMetricsScore: impactScore,
            formattingClarityScore: formattingScore
        },
        auditInsights: {
            topStrengths: [
                `Demonstrates practical experience in ${matchingSkills.slice(0, 3).join(', ') || 'core role competencies'}`,
                `Strong alignment with ${role} requirements with ~${estYears} years domain exposure`
            ],
            redFlagsOrGaps: missingCriticalSkills.length > 0 ? [
                `Missing explicit mention of ${missingCriticalSkills.slice(0, 2).join(' and ')}`
            ] : ['No major skill gaps identified']
        }
    };
};

module.exports = { analyzeCandidateATS };

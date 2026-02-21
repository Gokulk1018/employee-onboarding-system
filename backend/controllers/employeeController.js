const Employee = require('../models/Employee');
const Offer = require('../models/Offer');
const OnboardingUser = require('../models/OnboardingUser');
const Task = require('../models/Task');
const Goal = require('../models/Goal');
const PerformanceReview = require('../models/PerformanceReview');
const Notification = require('../models/Notification');
const Job = require('../models/Job');
const mongoose = require('mongoose');
const crypto = require('crypto');
const sendEmail = require('../utils/emailHelper');

// @desc    Get all employees
// @route   GET /api/employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ name: 1 });
        res.status(200).json({
            success: true,
            data: employees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Create manual employee (optional utility)
// @route   POST /api/employees
exports.createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({
            success: true,
            data: employee
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Generate and send credentials to candidate for onboarding
// @route   POST /api/employees/generate-credentials/:id
exports.generateCredentials = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).json({ success: false, message: 'Offer not found' });
        }

        const username = offer.candidateName.toLowerCase().replace(/\s+/g, '');
        const password = "123";

        let onboardingUser = await OnboardingUser.findOne({ offerId: offer._id });

        if (onboardingUser) {
            onboardingUser.username = username;
            onboardingUser.password = password;
            await onboardingUser.save();
        } else {
            onboardingUser = await OnboardingUser.create({
                username,
                password,
                candidateName: offer.candidateName,
                candidateEmail: offer.candidateEmail,
                offerId: offer._id
            });
        }

        const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #7c3aed;">Your Onboarding Portal Credentials</h2>
                <p>Hello ${offer.candidateName},</p>
                <p>Congratulations on your offer! Please use the following credentials to access the onboarding portal:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
                    <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                </div>
                <p>Login here: <a href="${loginUrl}" style="color: #7c3aed; font-weight: 600;">Onboarding Portal</a></p>
                <p style="color: #6b7280; font-size: 0.9rem;">Please complete your onboarding tasks as soon as possible.</p>
            </div>
        `;

        await sendEmail({
            email: offer.candidateEmail,
            subject: 'Your Onboarding Portal Credentials',
            html: htmlContent
        });

        res.status(200).json({ success: true, message: 'Onboarding credentials generated and sent' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get dashboard stats for the logged-in employee
// @route   GET /api/employees/me/dashboard/:id
exports.getDashboardStats = async (req, res, next) => {
    try {
        const employeeId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ success: false, message: 'Invalid employee ID' });
        }

        const employeeSnippet = await Employee.findById(employeeId).select('name');
        if (!employeeSnippet) {
            return res.status(404).json({ success: false, message: 'Employee profile not found' });
        }

        // 1. Fetch Tasks
        const tasks = await Task.find({ assignees: employeeId });
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const taskCompletion = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

        // 2. Fetch Goals
        const goals = await Goal.find({ employeeId });
        const avgGoalProgress = goals.length > 0
            ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length)
            : 0;

        // 3. Fetch Latest Performance Review
        const latestReview = await PerformanceReview.findOne({ employeeId }).sort({ createdAt: -1 });

        // 4. Fetch Recent Notifications
        const notifications = await Notification.find({
            $or: [{ userId: employeeId }, { isGlobal: true }]
        }).sort({ createdAt: -1 }).limit(5);

        // 5. Fetch Internal Jobs (Openings)
        const internalJobs = await Job.find({ status: 'OPEN' }).sort({ createdAt: -1 }).limit(3);

        // 6. Fetch Personal Sentiment Stats
        const EngagementResponse = require('../models/EngagementResponse');
        const personalResponses = await EngagementResponse.find({ employeeId });
        const sentimentStats = {
            Good: personalResponses.filter(r => r.selectedOption === 'Good').length,
            Neutral: personalResponses.filter(r => r.selectedOption === 'Neutral').length,
            Bad: personalResponses.filter(r => r.selectedOption === 'Bad').length
        };

        // 7. Calculate Performance Points & Ranking
        const allEmployeesPoints = await Task.aggregate([
            { $match: { status: 'done' } },
            { $unwind: "$assignees" },
            {
                $addFields: {
                    effectivePoints: {
                        $ifNull: [
                            "$points",
                            {
                                $switch: {
                                    branches: [
                                        { case: { $eq: ["$priority", "High"] }, then: 10 },
                                        { case: { $eq: ["$priority", "Medium"] }, then: 7 },
                                        { case: { $eq: ["$priority", "Low"] }, then: 5 }
                                    ],
                                    default: 7
                                }
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$assignees",
                    points: { $sum: "$effectivePoints" }
                }
            },
            {
                $lookup: {
                    from: "employees",
                    localField: "_id",
                    foreignField: "_id",
                    as: "employee"
                }
            },
            { $unwind: "$employee" },
            { $sort: { points: -1 } }
        ]);

        const myPerformance = allEmployeesPoints.find(p => p._id && p._id.toString() === employeeId);
        const myPoints = myPerformance ? myPerformance.points : 0;
        const myRank = allEmployeesPoints.findIndex(p => p._id && p._id.toString() === employeeId) + 1;

        res.status(200).json({
            success: true,
            data: {
                tasks: {
                    total: tasks.length,
                    completed: completedTasks,
                    completionRate: taskCompletion,
                    list: tasks.slice(0, 5)
                },
                goals: {
                    total: goals.length,
                    averageProgress: avgGoalProgress,
                    list: goals.slice(0, 5)
                },
                performance: {
                    rating: latestReview ? latestReview.averageRating : 0,
                    status: latestReview ? latestReview.status : 'No Review Yet',
                    points: myPoints,
                    rank: myRank || 'N/A'
                },
                notifications,
                internalJobs,
                sentimentStats
            }
        });
    } catch (err) {
        next(err);
    }
};

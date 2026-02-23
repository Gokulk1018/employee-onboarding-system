const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Task = require('../models/Task');
const EmployeeRequest = require('../models/EmployeeRequest');
const Offer = require('../models/Offer');
const Document = require('../models/Document');
const OnboardingUser = require('../models/OnboardingUser'); // Added OnboardingUser
const PayrollTransaction = require('../models/PayrollTransaction');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Leave = require('../models/Leave');
const mongoose = require('mongoose');

const sendEmail = require('../utils/emailHelper');

// @desc    Get full leaderboard (all performers)
// @route   GET /api/dashboard/leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await Task.aggregate([
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
                    totalPoints: { $sum: "$effectivePoints" }
                }
            },
            { $sort: { totalPoints: -1 } },
            {
                $lookup: {
                    from: "employees",
                    localField: "_id",
                    foreignField: "_id",
                    as: "employee"
                }
            },
            { $unwind: "$employee" },
            {
                $project: {
                    name: "$employee.name",
                    role: "$employee.role",
                    avatar: "$employee.avatar",
                    totalPoints: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Run independent queries in parallel
        const [
            totalEmployees,
            activeEmployees,
            activeToday,
            hiringTrends,
            departmentDistribution,
            topPerformers,
            pendingLeave,
            pendingOffers,
            pendingDocs,
            taskStats,
            totalPendingTasks,
            overdueTasks,
            onboardingsToday,
            activeJobs,
            payrollDue
        ] = await Promise.all([
            // 1. Employee counts
            Employee.countDocuments().lean(),
            Employee.countDocuments({ status: 'Active' }).lean(),

            // 2. Active Today
            Attendance.countDocuments({
                date: { $gte: today, $lt: tomorrow },
                status: 'Present'
            }).lean(),

            // 3. Hiring Trends
            Employee.aggregate([
                { $match: { joinDate: { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: { month: { $month: "$joinDate" }, year: { $year: "$joinDate" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]),

            // 4. Department Distribution
            Employee.aggregate([
                { $group: { _id: "$department", count: { $sum: 1 } } }
            ]),

            // 5. Top Performers
            Task.aggregate([
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
                        totalPoints: { $sum: "$effectivePoints" }
                    }
                },
                { $sort: { totalPoints: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: "employees",
                        localField: "_id",
                        foreignField: "_id",
                        as: "employee"
                    }
                },
                { $unwind: "$employee" },
                {
                    $project: {
                        name: "$employee.name",
                        role: "$employee.role",
                        avatar: "$employee.avatar",
                        totalPoints: 1
                    }
                }
            ]),

            // 6. Pending Approvals
            Leave.countDocuments({ status: 'Pending' }).lean(),
            Offer.countDocuments({
                status: 'Accepted',
                credentialsSent: { $ne: true }
            }).lean(),
            OnboardingUser.aggregate([
                { $match: { status: 'submitted' } },
                { $unwind: "$documents" },
                { $match: { "documents.status": "pending" } },
                { $count: "total" }
            ]),


            // 7. Task Stats
            Task.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),
            Task.countDocuments({ status: { $in: ['todo', 'inProgress'] } }).lean(),
            Task.countDocuments({ dueDate: { $lt: today }, status: { $ne: 'done' } }).lean(),

            // 8. Today's Focus
            Offer.countDocuments({ joiningDate: { $gte: today, $lt: tomorrow }, status: 'Accepted' }).lean(),
            Job.countDocuments({ status: 'OPEN', applicationDeadline: { $gte: today } }).lean(),
            PayrollTransaction.countDocuments({ status: 'Pending' }).lean()
        ]);

        res.status(200).json({
            success: true,
            data: {
                metrics: {
                    totalEmployees,
                    activeEmployees,
                    activeToday,
                    totalPendingTasks,
                    attendancePercentage: totalEmployees > 0 ? (activeEmployees / totalEmployees) * 100 : 0
                },
                hiringTrends,
                departmentDistribution,
                topPerformers,
                pendingApprovals: {
                    leaveRequests: pendingLeave,
                    offerLetters: pendingOffers,
                    documentVerification: pendingDocs && pendingDocs.length > 0 ? pendingDocs[0].total : 0,
                    total: pendingLeave + pendingOffers + (pendingDocs && pendingDocs.length > 0 ? pendingDocs[0].total : 0)
                },

                taskOverview: {
                    stats: taskStats,
                    overdue: overdueTasks,
                    pending: totalPendingTasks
                },
                todayFocus: {
                    onboardings: onboardingsToday,
                    activeJobs: activeJobs,
                    payrollDue: payrollDue
                }
            }
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get pending offers (Accepted but credentials not sent)
// @route   GET /api/dashboard/pending-offers
exports.getPendingOffers = async (req, res) => {
    try {
        const offers = await Offer.find({
            status: { $in: ['Accepted', 'OFFER_ACCEPTED'] },
            credentialsSent: { $ne: true }
        }).select('candidateName candidateEmail role joiningDate');

        res.status(200).json({ success: true, data: offers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Send credentials to candidate
// @route   POST /api/dashboard/send-credentials/:id
exports.sendCredentials = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });

        // Check if OnboardingUser already exists
        let user = await OnboardingUser.findOne({ offerId: offer._id });

        // Standardize credentials as per request:
        // Username: Candidate Name (lowercase, trimmed)
        // Password: '123'
        const password = '123';
        const username = offer.candidateName; // OnboardingUser model handles lowercase/trim

        if (!user) {
            // Create new OnboardingUser
            user = await OnboardingUser.create({
                username: username,
                password: password, // In production, hash this!
                candidateName: offer.candidateName,
                candidateEmail: offer.candidateEmail,
                offerId: offer._id,
                status: 'pending'
            });
        } else {
            // Update existing user credentials
            user.username = username;
            user.password = password;
            await user.save();
        }

        // Send Email
        const loginUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/login`;

        await sendEmail({
            email: offer.candidateEmail,
            subject: 'Your Onboarding Credentials',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4f46e5;">Welcome to the Team, ${offer.candidateName}!</h2>
                    <p>We are excited to have you on board. Please log in to the employee portal to complete your onboarding process.</p>
                    
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Portal URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
                        <p style="margin: 5px 0;"><strong>Username:</strong> ${offer.candidateName}</p>
                        <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                    </div>

                    <p>Please change your password after your first login.</p>
                    <p>Best regards,<br>The HR Team</p>
                </div>
            `
        });

        offer.credentialsSent = true;
        offer.onboardingStep = 'Documentation';
        await offer.save();

        res.status(200).json({ success: true, message: 'Credentials sent successfully' });
    } catch (error) {
        console.error('Send Credentials Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get users with pending documents
// @route   GET /api/dashboard/pending-documents
exports.getPendingDocuments = async (req, res) => {
    try {
        const users = await OnboardingUser.find({
            status: 'submitted',
            'documents.status': 'pending'
        }).select('candidateName candidateEmail documents');


        // Filter to only include users who actually have pending docs (double check)
        const formattedUsers = users.map(user => ({
            _id: user._id,
            name: user.candidateName,
            email: user.candidateEmail,
            pendingCount: user.documents.filter(d => d.status === 'pending').length
        })).filter(u => u.pendingCount > 0);

        res.status(200).json({ success: true, data: formattedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get pending leave requests
// @route   GET /api/dashboard/pending-leaves
exports.getPendingLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ status: 'Pending' })
            .populate('employeeId', 'name email department avatar')
            .sort('-appliedOn');

        res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


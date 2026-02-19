const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Task = require('../models/Task');
const EmployeeRequest = require('../models/EmployeeRequest');
const Offer = require('../models/Offer');
const Document = require('../models/Document');
const PayrollTransaction = require('../models/PayrollTransaction');
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const mongoose = require('mongoose');

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
            EmployeeRequest.countDocuments({ status: 'Pending', requestType: 'Leave Request' }).lean(),
            Offer.countDocuments({ status: 'Sent' }).lean(),
            Document.countDocuments({ status: 'PENDING' }).lean(),

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
                    documentVerification: pendingDocs,
                    total: pendingLeave + pendingOffers + pendingDocs
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

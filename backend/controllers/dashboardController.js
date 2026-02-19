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

        // 1. Employee counts
        const totalEmployees = await Employee.countDocuments();
        const activeEmployees = await Employee.countDocuments({ status: 'Active' });

        // 2. Active Today (Present from Attendance)
        const activeToday = await Attendance.countDocuments({
            date: { $gte: today, $lt: tomorrow },
            status: 'Present'
        });

        // 3. Hiring Trends (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const hiringTrends = await Employee.aggregate([
            {
                $match: {
                    joinDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$joinDate" },
                        year: { $year: "$joinDate" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // 4. Department Distribution
        const departmentDistribution = await Employee.aggregate([
            {
                $group: {
                    _id: "$department",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 5. Top Performers (Top 10)
        const topPerformers = await Task.aggregate([
            { $match: { status: 'done' } },
            { $unwind: "$assignees" },
            {
                $group: {
                    _id: "$assignees",
                    totalPoints: { $sum: "$points" }
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
        ]);

        // 6. Pending Approvals
        const pendingLeave = await EmployeeRequest.countDocuments({ status: 'Pending', requestType: 'Leave Request' });
        const pendingOffers = await Offer.countDocuments({ status: 'Sent' });
        const pendingDocs = await Document.countDocuments({ status: 'PENDING' });

        // 7. Task Overview & Pending Tasks
        const taskStats = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        const totalPendingTasks = await Task.countDocuments({
            status: { $in: ['todo', 'inProgress'] }
        });
        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: today },
            status: { $ne: 'done' }
        });

        // 8. Today's Focus
        const onboardingsToday = await Offer.countDocuments({
            joiningDate: { $gte: today, $lt: tomorrow },
            status: 'Accepted'
        });
        const activeJobs = await Job.countDocuments({ status: 'OPEN' });
        const payrollDue = await PayrollTransaction.countDocuments({ status: 'Pending' });

        res.status(200).json({
            success: true,
            data: {
                metrics: {
                    totalEmployees,
                    activeEmployees,
                    activeToday, // Keep this for actual presence if needed elsewhere
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

const mongoose = require('mongoose');
const Task = require('./models/Task');
const Employee = require('./models/Employee');
const dotenv = require('dotenv');
dotenv.config();

async function runComparison() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Logic from dashboardController (HR View)
        const hrTopPerformers = await Task.aggregate([
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
            {
                $lookup: {
                    from: "employees",
                    localField: "_id",
                    foreignField: "_id",
                    as: "employee"
                }
            },
            { $unwind: "$employee" },
            { $sort: { totalPoints: -1 } }
        ]);

        // 2. Logic from employeeController (Portal View - Updated to match HR logic)
        const portalRanking = await Task.aggregate([
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

        console.log('\n--- HR View (dashboardController) ---');
        hrTopPerformers.forEach((p, i) => {
            console.log(`${i + 1}. ${p.employee.name} (pts: ${p.totalPoints}) ID: ${p._id}`);
        });

        console.log('\n--- Portal View (employeeController) ---');
        portalRanking.forEach((p, i) => {
            console.log(`${i + 1}. ${p.employee.name} (ID: ${p._id}) (pts: ${p.points})`);
        });

        const rukiya = await Employee.findOne({ name: /rukiya/i });
        if (rukiya) {
            const hrRank = hrTopPerformers.findIndex(p => p._id.toString() === rukiya._id.toString()) + 1;
            const portalRank = portalRanking.findIndex(p => p._id.toString() === rukiya._id.toString()) + 1;
            const hrPoints = hrTopPerformers.find(p => p._id.toString() === rukiya._id.toString())?.totalPoints || 0;
            const portalPoints = portalRanking.find(p => p._id.toString() === rukiya._id.toString())?.points || 0;

            console.log(`\nRukiya's Comparison:`);
            console.log(`  HR View:     ${hrPoints} pts, Rank ${hrRank}`);
            console.log(`  Portal View: ${portalPoints} pts, Rank ${portalRank}`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

runComparison();

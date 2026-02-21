const mongoose = require('mongoose');
const Task = require('./models/Task');
const Employee = require('./models/Employee');
const dotenv = require('dotenv');
dotenv.config();

async function debugData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const rukiya = await Employee.findOne({ name: /rukiya/i });
        if (!rukiya) {
            console.log('Rukiya not found');
            return;
        }

        console.log(`Found Rukiya: ${rukiya._id}`);

        const tasks = await Task.find({ assignees: rukiya._id, status: 'done' });
        console.log(`Found ${tasks.length} completed tasks for Rukiya`);

        tasks.forEach(task => {
            console.log(`Task: ${task.title}`);
            console.log(`  Priority: ${task.priority}`);
            console.log(`  Points Field: ${task.points}`);

            // Unified calculation (like updated employeeController)
            let unifiedPoints = task.points || 0;
            if (!task.points) {
                if (task.priority === 'High') unifiedPoints = 10;
                else if (task.priority === 'Medium') unifiedPoints = 7;
                else if (task.priority === 'Low') unifiedPoints = 5;
                else unifiedPoints = 7;
            }

            console.log(`  Unified Points: ${unifiedPoints}`);
        });

        const allEmployeesPoints = await Task.aggregate([
            { $match: { status: 'done', assignees: { $exists: true, $ne: [] } } },
            { $unwind: "$assignees" },
            {
                $group: {
                    _id: "$assignees",
                    points: {
                        $sum: {
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
                }
            },
            { $sort: { points: -1 } }
        ]);

        const rukiyaStats = allEmployeesPoints.find(p => p._id.toString() === rukiya._id.toString());
        const rukiyaRank = allEmployeesPoints.findIndex(p => p._id.toString() === rukiya._id.toString()) + 1;

        console.log(`\nRukiya's Final Stats:`);
        console.log(`  Points: ${rukiyaStats ? rukiyaStats.points : 0}`);
        console.log(`  Rank: ${rukiyaRank || 'N/A'}`);

        // Also check if she's in top 5
        console.log(`\nTop Performers:`);
        allEmployeesPoints.slice(0, 5).forEach((p, i) => {
            console.log(`${i + 1}. ${p._id} - ${p.points} PTS`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugData();

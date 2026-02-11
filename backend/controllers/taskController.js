const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find()
            .populate('assignees', 'name email avatar')
            .sort({ createdAt: -1 });

        // Group tasks by status for the Kanban board
        const groupedTasks = {
            todo: tasks.filter(t => t.status === 'todo'),
            inProgress: tasks.filter(t => t.status === 'inProgress'),
            done: tasks.filter(t => t.status === 'done')
        };

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: groupedTasks
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new task
// @route   POST /api/tasks
exports.createTask = async (req, res, next) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

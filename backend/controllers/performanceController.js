const Goal = require('../models/Goal');
const PerformanceReview = require('../models/PerformanceReview');
const Employee = require('../models/Employee');

// @desc    Create a new goal
// @route   POST /api/performance/goals
exports.createGoal = async (req, res, next) => {
    try {
        const { title, description, category, priority, dueDate, employeeId } = req.body;

        const targetEmployeeId = employeeId || req.user._id;

        const goal = await Goal.create({
            employeeId: targetEmployeeId,
            title,
            description,
            category,
            priority,
            dueDate
        });

        res.status(201).json({ success: true, data: goal });
    } catch (err) {
        next(err);
    }
};

// @desc    Get goals for an employee
// @route   GET /api/performance/goals
exports.getGoals = async (req, res, next) => {
    try {
        const employeeId = req.query.employeeId || req.user._id;
        const goals = await Goal.find({ employeeId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: goals.length, data: goals });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a goal
// @route   PUT /api/performance/goals/:id
exports.updateGoal = async (req, res, next) => {
    try {
        let goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ success: false, message: 'Goal not found' });
        }

        goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: goal });
    } catch (err) {
        next(err);
    }
};

// @desc    Submit a performance review
// @route   POST /api/performance/reviews
exports.submitReview = async (req, res, next) => {
    try {
        const { employeeId, reviewPeriod, ratings, remarks, status } = req.body;
        const reviewerId = req.user._id;

        const review = await PerformanceReview.create({
            employeeId,
            reviewerId,
            reviewPeriod,
            ratings,
            remarks,
            status,
            submittedAt: new Date()
        });

        res.status(201).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
};

// @desc    Get performance summary for an employee
// @route   GET /api/performance/summary/:employeeId
exports.getPerformanceSummary = async (req, res, next) => {
    try {
        const { employeeId } = req.params;

        const reviews = await PerformanceReview.find({ employeeId, status: 'Completed' });
        const goals = await Goal.find({ employeeId });

        // Calculate Average Rating
        let averageRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, review) => acc + review.averageRating, 0);
            averageRating = parseFloat((sum / reviews.length).toFixed(1));
        }

        // Ratings breakdown for Radar Chart
        const radarData = {
            communication: 0,
            technical: 0,
            leadership: 0,
            teamwork: 0,
            punctuality: 0,
            problemSolving: 0
        };

        if (reviews.length > 0) {
            reviews.forEach(r => {
                Object.keys(radarData).forEach(key => {
                    radarData[key] += r.ratings[key] || 0;
                });
            });
            Object.keys(radarData).forEach(key => {
                radarData[key] = parseFloat((radarData[key] / reviews.length).toFixed(1));
            });
        }

        // Goal Completion Percentage
        let goalCompletionPercent = 0;
        if (goals.length > 0) {
            const completedGoals = goals.filter(g => g.status === 'Completed').length;
            goalCompletionPercent = Math.round((completedGoals / goals.length) * 100);
        }

        // Pending Reviews count
        const pendingReviews = await PerformanceReview.countDocuments({
            employeeId,
            status: { $ne: 'Completed' }
        });

        res.status(200).json({
            success: true,
            data: {
                averageRating,
                goalCompletionPercent,
                totalReviews: reviews.length,
                pendingReviews,
                radarData,
                goals: goals.length
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get pending reviews for a reviewer
// @route   GET /api/performance/pending/:reviewerId
exports.getPendingReviews = async (req, res, next) => {
    try {
        const reviewerId = req.params.reviewerId || req.user._id;
        const pendingReviews = await PerformanceReview.find({
            reviewerId,
            status: { $ne: 'Completed' }
        }).populate('employeeId', 'name position department avatar');

        res.status(200).json({ success: true, count: pendingReviews.length, data: pendingReviews });
    } catch (err) {
        next(err);
    }
};

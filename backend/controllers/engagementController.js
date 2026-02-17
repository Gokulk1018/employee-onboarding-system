const Recognition = require('../models/Recognition');
const Feedback = require('../models/Feedback');
const Survey = require('../models/Survey');
const SurveyResponse = require('../models/SurveyResponse');
const EngagementScore = require('../models/EngagementScore');
const Employee = require('../models/Employee');

// @desc    Give kudos (recognition)
// @route   POST /api/engagement/recognition
exports.sendRecognition = async (req, res, next) => {
    try {
        const { receiverId, message, category } = req.body;
        const senderId = req.user._id;

        const recognition = await Recognition.create({
            senderId,
            receiverId,
            message,
            category
        });

        res.status(201).json({ success: true, data: recognition });
    } catch (err) {
        next(err);
    }
};

// @desc    Get kudos feed
// @route   GET /api/engagement/recognition
exports.getRecognitions = async (req, res, next) => {
    try {
        const recognitions = await Recognition.find()
            .populate('senderId', 'name avatar position')
            .populate('receiverId', 'name avatar position')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: recognitions.length, data: recognitions });
    } catch (err) {
        next(err);
    }
};

// @desc    Like a recognition
// @route   POST /api/engagement/recognition/:id/like
exports.toggleLike = async (req, res, next) => {
    try {
        const recognition = await Recognition.findById(req.params.id);
        const userId = req.user._id;

        if (!recognition) return res.status(404).json({ success: false, message: 'Not found' });

        if (recognition.likes.includes(userId)) {
            recognition.likes = recognition.likes.filter(id => id.toString() !== userId.toString());
        } else {
            recognition.likes.push(userId);
        }

        await recognition.save();
        res.status(200).json({ success: true, data: recognition.likes });
    } catch (err) {
        next(err);
    }
};

// @desc    HR Create pulse survey
// @route   POST /api/engagement/survey
exports.createSurvey = async (req, res, next) => {
    try {
        const { title, description, questions, deadline } = req.body;
        const createdBy = req.user._id;

        const survey = await Survey.create({
            title,
            description,
            questions,
            deadline,
            createdBy
        });

        res.status(201).json({ success: true, data: survey });
    } catch (err) {
        next(err);
    }
};

// @desc    Get active surveys
// @route   GET /api/engagement/survey
exports.getSurveys = async (req, res, next) => {
    try {
        const surveys = await Survey.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: surveys.length, data: surveys });
    } catch (err) {
        next(err);
    }
};

// @desc    Employee Answer pulse survey
// @route   POST /api/engagement/survey/response
exports.submitSurveyResponse = async (req, res, next) => {
    try {
        const { surveyId, answers } = req.body;
        const employeeId = req.user._id;

        const response = await SurveyResponse.create({
            surveyId,
            employeeId,
            answers
        });

        res.status(201).json({ success: true, data: response });
    } catch (err) {
        next(err);
    }
};

// @desc    Submit anonymous feedback
// @route   POST /api/engagement/feedback
exports.submitFeedback = async (req, res, next) => {
    try {
        const { message, isAnonymous } = req.body;
        const senderId = req.user._id;

        const feedback = await Feedback.create({
            senderId: isAnonymous ? null : senderId,
            isAnonymous,
            message
        });

        res.status(201).json({ success: true, data: feedback });
    } catch (err) {
        next(err);
    }
};

// @desc    View recent feedback
// @route   GET /api/engagement/feedback
exports.getFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.find()
            .populate('senderId', 'name avatar')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: feedback.length, data: feedback });
    } catch (err) {
        next(err);
    }
};

// @desc    Get survey analytics
// @route   GET /api/engagement/analytics
exports.getEngagementAnalytics = async (req, res, next) => {
    try {
        const responses = await SurveyResponse.find();

        let positive = 0, neutral = 0, negative = 0, total = 0;

        responses.forEach(resp => {
            resp.answers.forEach(ans => {
                // If the answer is a rating (1-5) or Yes/No (1/0 or true/false)
                if (typeof ans.answer === 'number') {
                    total++;
                    if (ans.answer >= 4) positive++;
                    else if (ans.answer === 3) neutral++;
                    else negative++;
                } else if (typeof ans.answer === 'boolean') {
                    total++;
                    if (ans.answer) positive++;
                    else negative++;
                }
            });
        });

        const analytics = {
            sentiment: {
                positive: total ? Math.round((positive / total) * 100) : 0,
                neutral: total ? Math.round((neutral / total) * 100) : 0,
                negative: total ? Math.round((negative / total) * 100) : 0
            },
            totalResponses: responses.length
        };

        res.status(200).json({ success: true, data: analytics });
    } catch (err) {
        next(err);
    }
};

// @desc    Get leaderboard
// @route   GET /api/engagement/leaderboard
exports.getLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await Recognition.aggregate([
            { $group: { _id: "$receiverId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'employees', localField: '_id', foreignField: '_id', as: 'employee' } },
            { $unwind: '$employee' },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    name: '$employee.name',
                    avatar: '$employee.avatar',
                    department: '$employee.department'
                }
            }
        ]);

        res.status(200).json({ success: true, data: leaderboard });
    } catch (err) {
        next(err);
    }
};


const EngagementForm = require('../models/EngagementForm');
const EngagementResponse = require('../models/EngagementResponse');
const EmployeeRequest = require('../models/EmployeeRequest');
const Employee = require('../models/Employee');
const Recognition = require('../models/Recognition');
const Notification = require('../models/Notification');

// @desc    Create a new engagement form (HR)
// @route   POST /api/engagement/forms
exports.createForm = async (req, res, next) => {
    try {
        const { title, description, category, formType, targetAudience, targetEmployees, targetDepartment } = req.body;
        const createdBy = req.user._id;

        const form = await EngagementForm.create({
            title,
            description,
            category,
            formType,
            targetAudience,
            targetEmployees,
            targetDepartment,
            createdBy
        });

        // Trigger Notifications for Target Audience
        const Notification = require('../models/Notification');
        let targetUserIds = [];

        if (targetAudience === 'allEmployees') {
            const employees = await Employee.find({ status: 'Active', role: 'employee' }).select('_id');
            targetUserIds = employees.map(emp => emp._id);
        } else if (targetAudience === 'department') {
            const employees = await Employee.find({ department: targetDepartment, status: 'Active' }).select('_id');
            targetUserIds = employees.map(emp => emp._id);
        } else if (targetAudience === 'selectedEmployees') {
            targetUserIds = targetEmployees;
        }

        const notificationPromises = targetUserIds.map(userId =>
            Notification.create({
                userId,
                title: `New ${formType === 'survey' ? 'Survey' : 'Feedback Form'}`,
                message: `You have a new ${formType}: ${title}. Please complete it at your earliest convenience.`,
                type: 'engagement',
                status: 'Info',
                link: `/employee/dashboard?formId=${form._id}`
            })
        );
        await Promise.all(notificationPromises);

        res.status(201).json({ success: true, data: form });
    } catch (err) {
        next(err);
    }
};

// @desc    Get responses for the Engagement Wall
// @route   GET /api/engagement/wall
exports.getWallResponses = async (req, res, next) => {
    try {
        const responses = await EngagementResponse.find({
            message: { $exists: true, $ne: '' }
        })
            .populate('employeeId', 'name avatar department')
            .populate('formId', 'title category')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: responses.length, data: responses });
    } catch (err) {
        next(err);
    }
};

// @desc    Reply to an engagement response (HR)
// @route   PUT /api/engagement/responses/:id/reply
exports.replyToResponse = async (req, res, next) => {
    try {
        const { hrReply } = req.body;
        const responseId = req.params.id;

        const response = await EngagementResponse.findById(responseId);
        if (!response) {
            return res.status(404).json({ success: false, message: 'Response not found' });
        }

        response.hrReply = hrReply;
        response.hrReplyDate = new Date();
        await response.save();

        // Notify Employee with conversation history
        const Notification = require('../models/Notification');
        const previewMsg = response.message ? `Your message: "${response.message.substring(0, 30)}..."` : "Your feedback";
        await Notification.create({
            userId: response.employeeId,
            title: 'HR Replied to Your Feedback',
            message: `${previewMsg} | HR Response: "${hrReply}"`,
            type: 'engagement',
            status: 'Info',
            link: '/employee/dashboard'
        });




        res.status(200).json({ success: true, data: response });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all engagement forms
// @route   GET /api/engagement/forms
exports.getForms = async (req, res, next) => {
    try {
        let query;
        // If HR, show all. If Employee, show only assigned/active.
        if (req.user.role === 'hr') {
            query = EngagementForm.find().sort({ createdAt: -1 });
        } else {
            // Logic for employee: either allEmployees or targeted to their dept/id
            const employee = await Employee.findById(req.user._id);
            query = EngagementForm.find({
                isActive: true,
                $or: [
                    { targetAudience: 'allEmployees' },
                    { targetAudience: 'department', targetDepartment: employee.department },
                    { targetAudience: 'selectedEmployees', targetEmployees: req.user._id }
                ]
            }).sort({ createdAt: -1 });
        }

        const forms = await query;
        res.status(200).json({ success: true, count: forms.length, data: forms });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single engagement form
// @route   GET /api/engagement/forms/:id
exports.getFormById = async (req, res, next) => {
    try {
        const form = await EngagementForm.findById(req.params.id);
        if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
        res.status(200).json({ success: true, data: form });
    } catch (err) {
        next(err);
    }
};

// @desc    Submit form response (Employee)
// @route   POST /api/engagement/forms/respond
exports.submitResponse = async (req, res, next) => {
    try {
        const { formId, selectedOption, message } = req.body;
        const employeeId = req.user._id;

        const response = await EngagementResponse.create({
            formId,
            employeeId,
            selectedOption,
            message
        });

        res.status(201).json({ success: true, data: response });
    } catch (err) {
        next(err);
    }
};

// @desc    Get form analytics (HR)
// @route   GET /api/engagement/forms/analytics/:id
exports.getFormAnalytics = async (req, res, next) => {
    try {
        const formId = req.params.id;
        const form = await EngagementForm.findById(formId);
        if (!form) return res.status(404).json({ success: false, message: 'Form not found' });

        const responses = await EngagementResponse.find({ formId }).populate('employeeId', 'name avatar department');

        // Calculate counts for survey options
        const analytics = {
            totalSubmitted: responses.length,
            optionsCount: {
                'Good': 0,
                'Neutral': 0,
                'Bad': 0
            },
            submittedEmployees: [],
            pendingEmployees: []
        };

        responses.forEach(resp => {
            if (resp.selectedOption) {
                analytics.optionsCount[resp.selectedOption]++;
            }
            if (resp.employeeId) {
                analytics.submittedEmployees.push(resp.employeeId);
            }
        });

        // Determine target employees to find pending ones
        let targetEmployees = [];
        if (form.targetAudience === 'allEmployees') {
            targetEmployees = await Employee.find({ status: 'Active' }).select('name avatar department');
        } else if (form.targetAudience === 'department') {
            targetEmployees = await Employee.find({ department: form.targetDepartment, status: 'Active' }).select('name avatar department');
        } else {
            targetEmployees = await Employee.find({ _id: { $in: form.targetEmployees } }).select('name avatar department');
        }

        const submittedIds = analytics.submittedEmployees.map(emp => emp._id.toString());
        analytics.pendingEmployees = targetEmployees.filter(emp => !submittedIds.includes(emp._id.toString()));

        analytics.totalAssigned = targetEmployees.length;
        analytics.totalNotSubmitted = analytics.pendingEmployees.length;

        res.status(200).json({ success: true, data: analytics });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new employee request
// @route   POST /api/engagement/request
exports.createRequest = async (req, res, next) => {
    try {
        const { requestType, message } = req.body;
        const employee = await Employee.findById(req.user._id);

        const request = await EmployeeRequest.create({
            employeeId: req.user._id,
            name: employee.name,
            email: employee.email,
            department: employee.department,
            requestType,
            message
        });

        res.status(201).json({ success: true, data: request });
    } catch (err) {
        next(err);
    }
};

// @desc    Get employee requests
// @route   GET /api/engagement/request
exports.getRequests = async (req, res, next) => {
    try {
        let query;
        if (req.user.role === 'hr') {
            query = EmployeeRequest.find().sort({ createdAt: -1 });
        } else {
            query = EmployeeRequest.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
        }

        const requests = await query;
        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (err) {
        next(err);
    }
};

// @desc    Update employee request (Approve/Decline/Reply - HR)
// @route   PUT /api/engagement/request/:id
exports.updateRequest = async (req, res, next) => {
    try {
        const { status, hrReply } = req.body;
        const request = await EmployeeRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        if (status) request.status = status;
        if (hrReply) request.hrReply = hrReply;

        await request.save();
        res.status(200).json({ success: true, data: request });
    } catch (err) {
        next(err);
    }
};

// @desc    Update engagement form (HR)
// @route   PUT /api/engagement/forms/:id
exports.updateForm = async (req, res, next) => {
    try {
        let form = await EngagementForm.findById(req.params.id);

        if (!form) {
            return res.status(404).json({ success: false, message: 'Form not found' });
        }

        form = await EngagementForm.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: form });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete engagement form (HR)
// @route   DELETE /api/engagement/forms/:id
exports.deleteForm = async (req, res, next) => {
    try {
        const form = await EngagementForm.findById(req.params.id);

        if (!form) {
            return res.status(404).json({ success: false, message: 'Form not found' });
        }

        // Delete associated responses
        await EngagementResponse.deleteMany({ formId: req.params.id });
        await EngagementForm.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all recognitions (Kudos)
// @route   GET /api/engagement/recognitions
exports.getRecognitions = async (req, res, next) => {
    try {
        const recognitions = await Recognition.find()
            .populate('senderId', 'name avatar')
            .populate('receiverId', 'name avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: recognitions.length, data: recognitions });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new recognition
// @route   POST /api/engagement/recognitions
exports.createRecognition = async (req, res, next) => {
    try {
        const { receiverId, message, category } = req.body;
        const senderId = req.user._id;

        const recognition = await Recognition.create({
            senderId,
            receiverId,
            message,
            category
        });

        const fullRecognition = await Recognition.findById(recognition._id)
            .populate('senderId', 'name avatar')
            .populate('receiverId', 'name avatar');

        // Notify Receiver
        await Notification.create({
            userId: receiverId,
            title: 'You received Kudos!',
            message: `${fullRecognition.senderId.name} recognized you for ${category}: "${message.substring(0, 30)}..."`,
            type: 'engagement',
            status: 'Info',
            link: '/engagement'
        });

        res.status(201).json({ success: true, data: fullRecognition });
    } catch (err) {
        next(err);
    }
};

// @desc    Toggle like on recognition
// @route   PUT /api/engagement/recognitions/:id/like
exports.toggleLike = async (req, res, next) => {
    try {
        const recognition = await Recognition.findById(req.params.id);
        if (!recognition) return res.status(404).json({ success: false, message: 'Recognition not found' });

        const userId = req.user._id;
        const index = recognition.likes.indexOf(userId);

        if (index === -1) {
            recognition.likes.push(userId);
        } else {
            recognition.likes.splice(index, 1);
        }

        await recognition.save();
        res.status(200).json({ success: true, data: recognition.likes });
    } catch (err) {
        next(err);
    }
};

// @desc    Get engagement insights (HR)
// @route   GET /api/engagement/insights
exports.getEngagementInsights = async (req, res, next) => {
    try {
        const totalEmployees = await Employee.countDocuments({ status: 'Active' });
        const totalForms = await EngagementForm.countDocuments({ isActive: true });

        // Participation rate (based on responses / potential responses for active forms)
        const activeForms = await EngagementForm.find({ isActive: true });
        let totalPotentialResponses = 0;
        for (const form of activeForms) {
            if (form.targetAudience === 'allEmployees') {
                totalPotentialResponses += totalEmployees;
            } else if (form.targetAudience === 'department') {
                totalPotentialResponses += await Employee.countDocuments({ department: form.targetDepartment, status: 'Active' });
            } else {
                totalPotentialResponses += form.targetEmployees.length;
            }
        }

        const totalResponses = await EngagementResponse.countDocuments();
        const participationRate = totalPotentialResponses > 0
            ? Math.round((totalResponses / totalPotentialResponses) * 100)
            : 0;

        // Happiness Score (average sentiment from responses)
        const responses = await EngagementResponse.find();
        const sentimentMap = { 'Good': 5, 'Neutral': 3, 'Bad': 1 };
        const totalSentiment = responses.reduce((acc, curr) => acc + (sentimentMap[curr.selectedOption] || 3), 0);
        const avgHappiness = responses.length > 0 ? (totalSentiment / responses.length).toFixed(1) : '5.0';

        // Total Shoutouts (Recognitions)
        const totalShoutouts = await Recognition.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                participation: `${participationRate}%`,
                activeForms: totalForms,
                happiness: avgHappiness,
                shoutouts: totalShoutouts,
                participationTrend: '+5% from last month', // Static for now as historical data tracking is complex
                happinessLabel: 'Average sentiment'
            }
        });
    } catch (err) {
        next(err);
    }
};

const Employee = require('../models/Employee');
const OnboardingStatus = require('../models/OnboardingStatus');
const Offer = require('../models/Offer');

// @desc    Create employee manually from accepted offer
// @route   POST /api/employees/create
exports.createEmployee = async (req, res, next) => {
    try {
        const { offerId, position, department, joiningDate } = req.body;

        if (!offerId || !position || !department || !joiningDate) {
            res.status(400);
            throw new Error('Please provide offerId, position, department, and joiningDate');
        }

        const offer = await Offer.findById(offerId).populate('candidateId');
        if (!offer) {
            res.status(404);
            throw new Error('Offer not found');
        }

        // Fix: Use 'Accepted' instead of 'OFFER_ACCEPTED'
        if (offer.status !== 'Accepted') {
            res.status(400);
            throw new Error('Offer must be accepted first');
        }

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ email: offer.candidateId.email });
        if (existingEmployee) {
            res.status(400);
            throw new Error('Employee account already exists for this email');
        }

        const employee = await Employee.create({
            name: offer.candidateId.name,
            email: offer.candidateId.email,
            position,
            department,
            offerId,
            joiningDate
        });

        // Initialize Onboarding Status
        const onboarding = await OnboardingStatus.create({
            employeeId: employee._id,
            currentStep: 'ACCOUNT_CREATED',
            stepHistory: [
                { step: 'OFFER_CREATED' },
                { step: 'Accepted' },
                { step: 'ACCOUNT_CREATED' }
            ]
        });

        employee.onboardingStatusId = onboarding._id;
        await employee.save();

        res.status(201).json({ success: true, data: employee });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all employees
// @route   GET /api/employees
exports.getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().populate('onboardingStatusId');
        res.status(200).json({ success: true, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
exports.getEmployeeById = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('onboardingStatusId');
        if (!employee) {
            res.status(404);
            throw new Error('Employee not found');
        }
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        next(err);
    }
};

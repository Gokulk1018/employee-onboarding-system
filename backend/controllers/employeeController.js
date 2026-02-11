const Employee = require('../models/Employee');
const OnboardingStatus = require('../models/OnboardingStatus');
const Offer = require('../models/Offer');

// @desc    Create employee manually from accepted offer
// @route   POST /api/employees/create
exports.createEmployee = async (req, res, next) => {
    try {
        const { offerId, role, department, joinDate, email, name, status, avatar } = req.body;

        // If offerId is provided, we populate from offer, otherwise it's a direct creation
        if (offerId) {
            const offer = await Offer.findById(offerId).populate('candidateId');
            if (!offer) {
                res.status(404);
                throw new Error('Offer not found');
            }

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
                role: role || offer.position,
                department: department || offer.department,
                offerId,
                joinDate: joinDate || offer.joiningDate,
                status: status || 'Active'
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

            return res.status(201).json({ success: true, data: employee });
        } else {
            // Direct creation (for manual add)
            const employee = await Employee.create({
                name,
                email,
                role,
                department,
                joinDate,
                avatar,
                status: status || 'Active'
            });

            // Initialize Onboarding Status for manual entries
            const onboarding = await OnboardingStatus.create({
                employeeId: employee._id,
                currentStep: 'ACCOUNT_CREATED', // Manual entry starts at account created
                stepHistory: [
                    { step: 'ACCOUNT_CREATED' }
                ]
            });

            employee.onboardingStatusId = onboarding._id;
            await employee.save();

            return res.status(201).json({ success: true, data: employee });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
exports.updateEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!employee) {
            res.status(404);
            throw new Error('Employee not found');
        }

        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            res.status(404);
            throw new Error('Employee not found');
        }

        await employee.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all employees
// @route   GET /api/employees
exports.getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: employees });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
exports.getEmployeeById = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            res.status(404);
            throw new Error('Employee not found');
        }
        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        next(err);
    }
};

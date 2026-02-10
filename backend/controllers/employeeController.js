const Employee = require('../models/Employee');
const OnboardingStatus = require('../models/OnboardingStatus');
const Offer = require('../models/Offer');

exports.createEmployee = async (req, res) => {
    try {
        const { offerId, position, department, joiningDate } = req.body;

        const offer = await Offer.findById(offerId).populate('candidateId');
        if (!offer) return res.status(404).json({ success: false, error: 'Offer not found' });
        if (offer.status !== 'OFFER_ACCEPTED') {
            return res.status(400).json({ success: false, error: 'Offer must be accepted first' });
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
            stepHistory: [{ step: 'OFFER_CREATED' }, { step: 'OFFER_ACCEPTED' }, { step: 'ACCOUNT_CREATED' }]
        });

        employee.onboardingStatusId = onboarding._id;
        await employee.save();

        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('onboardingStatusId');
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('onboardingStatusId');
        if (!employee) return res.status(404).json({ success: false, error: 'Employee not found' });
        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

const Document = require('../models/Document');
const OnboardingStatus = require('../models/OnboardingStatus');
const Notification = require('../models/Notification');
const Employee = require('../models/Employee');

// @desc    Upload document
// @route   POST /api/documents/upload
exports.uploadDocument = async (req, res, next) => {
    try {
        const { employeeId, documentType, url } = req.body;

        if (!employeeId || !documentType || !url) {
            res.status(400);
            throw new Error('Please provide employeeId, documentType, and url');
        }

        const document = await Document.create({
            employeeId,
            documentType,
            url
        });

        // Update Onboarding status to DOCUMENTS_UPLOADED
        await OnboardingStatus.findOneAndUpdate(
            { employeeId },
            {
                $set: { currentStep: 'DOCUMENTS_UPLOADED' },
                $push: { stepHistory: { step: 'DOCUMENTS_UPLOADED' } }
            },
            { upsert: true } // Just in case it doesn't exist
        );

        // Fetch employee for name
        const employee = await Employee.findById(employeeId);

        // Create notification for HR (Global)
        await Notification.create({
            title: 'Document Uploaded',
            message: `${employee ? employee.name : 'A candidate'} has uploaded a ${documentType} document.`,
            type: 'document',
            status: 'Info',
            candidateName: employee ? employee.name : undefined,
            candidateEmail: employee ? employee.email : undefined,
            isGlobal: true,
            link: '/onboarding'
        });

        res.status(201).json({ success: true, data: document });

    } catch (err) {
        next(err);
    }
};

// @desc    Verify document
// @route   PUT /api/documents/:id/verify
exports.verifyDocument = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
            res.status(400);
            throw new Error('Invalid document status');
        }

        const document = await Document.findByIdAndUpdate(
            req.params.id,
            { status, verifiedAt: status === 'VERIFIED' ? Date.now() : null },
            { new: true }
        );

        if (!document) {
            res.status(404);
            throw new Error('Document not found');
        }

        // Check if all documents for this employee are verified
        if (status === 'VERIFIED') {
            const allDocs = await Document.find({ employeeId: document.employeeId });
            const allVerified = allDocs.length > 0 && allDocs.every(doc => doc.status === 'VERIFIED');

            if (allVerified) {
                await OnboardingStatus.findOneAndUpdate(
                    { employeeId: document.employeeId },
                    {
                        $set: { currentStep: 'DOCUMENTS_VERIFIED' },
                        $push: { stepHistory: { step: 'DOCUMENTS_VERIFIED' } }
                    }
                );
            }
        }

        res.status(200).json({ success: true, data: document });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all documents for an employee
// @route   GET /api/documents/:employeeId
exports.getEmployeeDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find({ employeeId: req.params.employeeId });
        res.status(200).json({ success: true, count: documents.length, data: documents });
    } catch (err) {
        next(err);
    }
};

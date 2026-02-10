const Document = require('../models/Document');
const OnboardingStatus = require('../models/OnboardingStatus');

exports.uploadDocument = async (req, res) => {
    try {
        const { employeeId, documentType, url } = req.body;

        const document = await Document.create({
            employeeId,
            documentType,
            url
        });

        // Update Onboarding status to DOCUMENTS_UPLOADED if it's the first document or relevant
        await OnboardingStatus.findOneAndUpdate(
            { employeeId },
            {
                $set: { currentStep: 'DOCUMENTS_UPLOADED' },
                $push: { stepHistory: { step: 'DOCUMENTS_UPLOADED' } }
            }
        );

        res.status(201).json({ success: true, data: document });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.verifyDocument = async (req, res) => {
    try {
        const { status } = req.body;
        const document = await Document.findByIdAndUpdate(
            req.params.id,
            { status, verifiedAt: status === 'VERIFIED' ? Date.now() : null },
            { new: true }
        );

        if (!document) return res.status(404).json({ success: false, error: 'Document not found' });

        // Check if all documents for this employee are verified
        // This is a simplified check for the flow
        if (status === 'VERIFIED') {
            const allDocs = await Document.find({ employeeId: document.employeeId });
            const allVerified = allDocs.every(doc => doc.status === 'VERIFIED');

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
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getEmployeeDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ employeeId: req.params.employeeId });
        res.status(200).json({ success: true, data: documents });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

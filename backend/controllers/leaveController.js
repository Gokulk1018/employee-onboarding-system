const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const Notification = require('../models/Notification');
const { ErrorResponse } = require('../middleware/errorMiddleware');


// @desc    Apply for leave
// @route   POST /api/leaves/apply
// @access  Private
exports.applyLeave = async (req, res, next) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        // In a real app, employeeId would come from req.user
        // For now, let's assume it's passed or handle it via a dummy/default if user logic isn't fully set up
        // Based on existing code, we usually have req.user from auth middleware
        const employeeId = req.user ? req.user.id : req.body.employeeId;

        if (!employeeId) {
            return res.status(400).json({ success: false, error: 'Employee ID is required' });
        }

        // Calculate days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Check balance
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }

        const typeLower = leaveType.toLowerCase();
        if (employee.leaveBalance[typeLower] < diffDays) {
            return res.status(400).json({ success: false, error: `Insufficient ${leaveType} leave balance. Requested: ${diffDays}, Available: ${employee.leaveBalance[typeLower]}` });
        }

        const leave = await Leave.create({
            employeeId,
            leaveType,
            startDate,
            endDate,
            reason,
            status: 'Pending'
        });

        res.status(201).json({

            success: true,
            data: leave
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current user's leave history
// @route   GET /api/leaves/my-leaves
// @access  Private
exports.getMyLeaves = async (req, res, next) => {
    try {
        const employeeId = req.user ? req.user.id : req.query.employeeId;

        const leaves = await Leave.find({ employeeId }).sort('-appliedOn');

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all leave requests (for Admin/HR)
// @route   GET /api/leaves/all
// @access  Private/Admin
exports.getAllLeaves = async (req, res, next) => {
    try {
        const leaves = await Leave.find().populate('employeeId', 'name email department').sort('-appliedOn');

        res.status(200).json({
            success: true,
            count: leaves.length,
            data: leaves
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id/status
// @access  Private/Admin
exports.updateLeaveStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        let leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ success: false, error: 'Leave request not found' });
        }

        if (leave.status !== 'Pending') {
            return res.status(400).json({ success: false, error: 'Only pending requests can be updated' });
        }

        // If approved, deduct balance
        if (status === 'Approved') {
            const employee = await Employee.findById(leave.employeeId);
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;

            const typeLower = leave.leaveType.toLowerCase();
            employee.leaveBalance[typeLower] -= diffDays;
            employee.status = 'On Leave';
            await employee.save();
        }

        leave.status = status;
        await leave.save();

        res.status(200).json({
            success: true,
            data: leave
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel leave (Delete if pending)
// @route   DELETE /api/leaves/:id/cancel
// @access  Private
exports.cancelLeave = async (req, res, next) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ success: false, error: 'Leave request not found' });
        }

        if (leave.status !== 'Pending') {
            return res.status(400).json({ success: false, error: 'Cannot cancel an already processed leave request' });
        }

        await Leave.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

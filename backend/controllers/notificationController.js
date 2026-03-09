const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/notifications
exports.getNotifications = async (req, res, next) => {
    try {
        const userId = req.headers['x-user-id'];
        let query = {};

        if (userId) {
            query = { $or: [{ userId: userId }, { isGlobal: true }] };
        } else if (req.user) {
            query = { $or: [{ userId: req.user._id }, { isGlobal: true }] };
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark individual notification as read
// @route   PUT /api/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
exports.markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.headers['x-user-id'] || (req.user && req.user._id);

        const query = userId
            ? { userId, isRead: false }
            : { isGlobal: true, isRead: false };

        await Notification.updateMany(query, { isRead: true });
        res.status(200).json({ success: true, message: 'Your notifications marked as read' });
    } catch (err) {
        next(err);
    }
};
// @desc    Create a notification
// @route   POST /api/notifications
exports.createNotification = async (req, res, next) => {
    try {
        const { title, message, type, status } = req.body;

        const notification = await Notification.create({
            title,
            message,
            type: type || 'general',
            status: status || 'Info'
        });

        res.status(201).json({
            success: true,
            data: notification
        });
    } catch (err) {
        next(err);
    }
};

const express = require('express');
const {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    updateLeaveStatus,
    cancelLeave
} = require('../controllers/leaveController');

const router = express.Router();

// Note: In a real app, protect middleware would be used here
// const { protect, authorize } = require('../middleware/authMiddleware');
// For now, these are open or handle user logic internally

router.post('/apply', applyLeave);
router.get('/my-leaves', getMyLeaves);
router.get('/all', getAllLeaves);
router.put('/:id/status', updateLeaveStatus);
router.delete('/:id/cancel', cancelLeave);

module.exports = router;

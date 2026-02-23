const express = require('express');
const router = express.Router();
const {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    generateCredentials,
    getDashboardStats,
    getEmployeeProfile,
    updateEmployeeProfile,
    uploadEmployeeAvatar
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Storage for Employee Avatar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.get('/me/dashboard/:id', getDashboardStats);
router.get('/me', protect, getEmployeeProfile);
router.put('/profile', protect, updateEmployeeProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadEmployeeAvatar);

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.post('/generate-credentials/:id', generateCredentials);

module.exports = router;

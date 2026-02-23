const express = require('express');
const router = express.Router();
const { login, changePassword, getHRProfile, updateHRProfile, uploadHRAvatar } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.post('/login', login);
router.put('/change-password', protect, changePassword);
router.get('/me', protect, admin, getHRProfile);
router.put('/profile', protect, admin, updateHRProfile);
router.post('/upload-avatar', protect, admin, upload.single('avatar'), uploadHRAvatar);

module.exports = router;

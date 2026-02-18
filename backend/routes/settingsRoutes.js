const express = require('express');
const router = express.Router();
const {
    getSettings,
    updateSettings,
    getRoles,
    updateRolePermissions,
    changePassword,
    getUsers,
    toggleUserStatus,
    uploadLogo
} = require('../controllers/settingsController');
const multer = require('multer');
const path = require('path');

// Multer storage for logo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.get('/', getSettings);
router.put('/', updateSettings);
router.get('/roles', getRoles);
router.put('/roles/:id', updateRolePermissions);
router.post('/change-password', changePassword);
router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.post('/upload-logo', upload.single('logo'), uploadLogo);

module.exports = router;

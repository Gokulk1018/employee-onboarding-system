const express = require('express');
const router = express.Router();
const { login, seedHR } = require('../controllers/authController');

router.post('/login', login);
router.post('/seed-hr', seedHR);

module.exports = router;

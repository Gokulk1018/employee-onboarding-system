const express = require('express');
const router = express.Router();
const { getEmployees, createEmployee, generateCredentials } = require('../controllers/employeeController');

router.get('/', getEmployees);
router.post('/', createEmployee);
router.post('/generate-credentials/:id', generateCredentials);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    generateCredentials,
    getDashboardStats
} = require('../controllers/employeeController');

router.get('/me/dashboard/:id', getDashboardStats);
router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.post('/generate-credentials/:id', generateCredentials);

module.exports = router;

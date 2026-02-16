const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

// A) Create Payroll Profile
router.post('/profile', payrollController.createProfile);

// B) Run Monthly Payroll
router.post('/run', payrollController.runPayroll);

// C) Get Payroll Dashboard Data
router.get('/dashboard/:employeeId', payrollController.getDashboardData);

// D) Get Payslip History
router.get('/payslips/:employeeId', payrollController.getPayslipHistory);

// E) Add Manual Payroll Entry
router.post('/add', payrollController.addPayrollEntry);

// F) Upsert Payroll Entry (Add or Update)
router.post('/', payrollController.addOrUpdatePayrollEntry);

// G) Get Payroll Comparison
router.get('/compare/:employeeId/:year/:month', payrollController.getPayrollComparison);

module.exports = router;

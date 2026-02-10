const express = require('express');
const router = express.Router();
const { uploadDocument, verifyDocument, getEmployeeDocuments } = require('../controllers/documentController');

router.post('/upload', uploadDocument);
router.put('/:id/verify', verifyDocument);
router.get('/:employeeId', getEmployeeDocuments);

module.exports = router;

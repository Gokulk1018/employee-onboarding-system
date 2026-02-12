const express = require('express');
const app = express();
app.get('/api/offers', (req, res) => {
    res.json({ success: true, data: [{ _id: '1', candidateName: 'Test from Lite', status: 'Accepted', role: 'Dev', department: 'IT', salary: 1000, joiningDate: new Date() }] });
});
app.listen(5000, () => console.log('Lite server running on 5000'));

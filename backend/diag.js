try {
    console.log('Loading express...');
    require('express');
    console.log('express ok');

    console.log('Loading HRUser model...');
    require('./models/HRUser');
    console.log('HRUser ok');

    console.log('Loading authController...');
    require('./controllers/authController');
    console.log('authController ok');

    console.log('Loading authRoutes...');
    require('./routes/authRoutes');
    console.log('authRoutes ok');

    console.log('All diagnostic checks passed!');
} catch (error) {
    console.error('DIAGNOSTIC FAILED:');
    console.error(error);
}

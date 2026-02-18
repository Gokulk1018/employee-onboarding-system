const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('--- Environment Variable Check ---');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'PRESENT' : 'MISSING');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE || 'MISSING');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'PRESENT' : 'MISSING');
console.log('PORT:', process.env.PORT || 'NOT SET (Default 5000)');

async function checkDB() {
    console.log('\n--- MongoDB Connection Check ---');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connection: SUCCESS');

        const SystemSettings = require('./models/SystemSettings');
        const settings = await SystemSettings.findOne();
        console.log('SystemSettings Query: SUCCESS');
        console.log('Settings found:', settings ? 'YES' : 'NO (Empty collection)');

    } catch (err) {
        console.error('Diagnostic Check FAILED:', err.message);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
}

checkDB();

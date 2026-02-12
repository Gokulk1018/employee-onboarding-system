const mongoose = require('mongoose');
require('dotenv').config();

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('employees');

        // Drop the unique email index
        try {
            await collection.dropIndex('email_1');
            console.log('✓ Successfully dropped email_1 index on employees collection');
        } catch (err) {
            if (err.code === 27) {
                console.log('Index email_1 does not exist on employees collection');
            } else {
                throw err;
            }
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();

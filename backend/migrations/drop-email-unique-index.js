// Migration script to drop the unique index on Candidate.email
// This allows multiple candidates with the same email address

const mongoose = require('mongoose');
require('dotenv').config();

const runMigration = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const candidatesCollection = db.collection('candidates');

        // Get existing indexes
        const indexes = await candidatesCollection.indexes();
        console.log('Current indexes:', indexes);

        // Drop the unique index on email if it exists
        try {
            await candidatesCollection.dropIndex('email_1');
            console.log('✓ Successfully dropped unique index on email field');
        } catch (err) {
            if (err.code === 27) {
                console.log('Index email_1 does not exist (already removed or never created)');
            } else {
                throw err;
            }
        }

        // Verify indexes after migration
        const newIndexes = await candidatesCollection.indexes();
        console.log('Indexes after migration:', newIndexes);

        console.log('\n✓ Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

runMigration();

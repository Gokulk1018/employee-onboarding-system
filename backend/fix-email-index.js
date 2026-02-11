// Simple script to drop the unique email index from candidates collection
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employee_onboarding';

async function fixEmailIndex() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✓ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('candidates');

        // List all indexes
        console.log('\nCurrent indexes on candidates collection:');
        const indexes = await collection.indexes();
        indexes.forEach(idx => {
            console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
        });

        // Try to drop the email_1 index
        console.log('\nAttempting to drop email_1 index...');
        try {
            await collection.dropIndex('email_1');
            console.log('✓ Successfully dropped email_1 index');
        } catch (error) {
            if (error.codeName === 'IndexNotFound') {
                console.log('✓ Index email_1 does not exist (already removed)');
            } else {
                console.error('✗ Error dropping index:', error.message);
            }
        }

        // Verify final state
        console.log('\nFinal indexes on candidates collection:');
        const finalIndexes = await collection.indexes();
        finalIndexes.forEach(idx => {
            console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
        });

        console.log('\n✓ Migration complete!');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Migration failed:', error);
        process.exit(1);
    }
}

fixEmailIndex();

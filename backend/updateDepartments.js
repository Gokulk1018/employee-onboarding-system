const mongoose = require('mongoose');
require('dotenv').config();

const mapping = {
    'Engineering': 'Fullstack Developer',
    'Design': 'UI/UX',
    'Product': 'Fullstack Developer',
    'Marketing': 'Tester',
    'Operations': 'DevOps',
    'Finance': 'Tester',
    'Sales': 'Backend Developer',
    'Executive': 'HR',
    'Management': 'HR',
    'Business Analyst': 'Frontend Developer',
    'Product Manager': 'Fullstack Developer',
    'QA': 'Tester',
    'Developer': 'Fullstack Developer'
};

const updateCollection = async (modelName, collectionConfig) => {
    try {
        const Model = require('./models/' + modelName);
        console.log(`Updating ${modelName} collection...`);
        for (const [oldDept, newDept] of Object.entries(mapping)) {
            const result = await Model.updateMany(
                { department: oldDept },
                { $set: { department: newDept } }
            );
            console.log(`Updated ${result.modifiedCount} records in ${modelName} from ${oldDept} to ${newDept}`);
        }
    } catch (e) {
        console.error(`Error updating ${modelName}:`, e);
    }
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eos');
        console.log('Connected to MongoDB');

        await updateCollection('Employee');
        await updateCollection('Job');
        await updateCollection('Task');
        await updateCollection('Offer');
        await updateCollection('Onboarding');

        console.log('Update completed');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

run();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const Offer = require('../models/Offer');

const migrate = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Searching for records with missing or "Unknown" names...');

        const offers = await Offer.find({
            $or: [
                { candidateName: { $exists: false } },
                { candidateName: null },
                { candidateName: "" },
                { candidateName: "Unknown" }
            ]
        });

        console.log(`Found ${offers.length} records to update.`);

        let updatedCount = 0;
        for (const offer of offers) {
            // Priority: candidateEmail > email field (legacy)
            const emailToUse = offer.candidateEmail || offer.get('email');

            if (emailToUse && emailToUse.includes('@')) {
                const extractedName = emailToUse.split('@')[0];
                // Capitalize first letter and replace dots/underscores with spaces for a cleaner look
                const cleanName = extractedName
                    .split(/[._]/)
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                offer.candidateName = cleanName;
                await offer.save();
                updatedCount++;
                console.log(`Updated: [${emailToUse}] -> ${cleanName}`);
            } else {
                console.log(`Skipping: [${offer._id}] No valid email found.`);
            }
        }

        console.log(`\nMigration Complete!`);
        console.log(`Total records processed: ${offers.length}`);
        console.log(`Successfully updated: ${updatedCount}`);

        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();

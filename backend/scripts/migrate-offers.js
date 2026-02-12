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

        console.log('Migrating offer records...');

        // Use MongoDB update with aggregation pipeline for the identity fix
        const result = await Offer.updateMany(
            { candidateName: { $exists: false } }, // Error: This might not catch "Unknown" if it was literally saved as string
            [
                {
                    $set: {
                        candidateName: {
                            $ifNull: ["$name", { $ifNull: ["$fullName", "Unknown"] }]
                        }
                    }
                }
            ]
        );

        // Also fix records where candidateName is explicitly "Unknown" but name/fullName exists
        const explicitFix = await Offer.find({ candidateName: "Unknown" });
        let fixedCount = 0;
        for (const offer of explicitFix) {
            // Check for hidden fields in lean data or previous schema
            const actualName = offer.get('name') || offer.get('fullName');
            if (actualName && actualName !== "Unknown") {
                offer.candidateName = actualName;
                await offer.save();
                fixedCount++;
            }
        }

        console.log(`Migration Complete: ${result.modifiedCount} records updated via mongo pipeline.`);
        console.log(`Explicit fix update: ${fixedCount} records corrected.`);

        process.exit();
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();

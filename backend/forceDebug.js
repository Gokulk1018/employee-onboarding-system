const mongoose = require('mongoose');
const Offer = require('./models/Offer');
const fs = require('fs');
require('dotenv').config();

// Attempt to write to Desktop for maximum visibility
const desktopPath = 'C:\\Users\\gokul\\Desktop\\debug_output.txt';

function syncLog(msg) {
    try {
        fs.appendFileSync(desktopPath, msg + '\n');
    } catch (e) {
        // Fallback to a place we definitely have access to
        try { fs.appendFileSync('force_debug_log.txt', msg + '\n'); } catch (e2) { }
    }
}

const run = async () => {
    try { fs.writeFileSync(desktopPath, '--- START DIAGNOSTIC ---\n'); } catch (e) { }
    try {
        syncLog(`TIME: ${new Date().toISOString()}`);
        syncLog(`Connecting to DB...`);
        await mongoose.connect(process.env.MONGO_URI);
        syncLog('MongoDB Connected');

        const offerId = '698e97f0ff329f1d86abf3e7';
        syncLog(`Searching for Offer ID: ${offerId}`);
        const offer = await Offer.findById(offerId);

        if (offer) {
            syncLog(`OFFER_FOUND: ${offer.candidateName}`);
            syncLog(`STEP: "${offer.onboardingStep}"`);
            syncLog(`STATUS: ${offer.status}`);
        } else {
            syncLog('OFFER_NOT_FOUND_BY_ID');
            const all = await Offer.find({}, 'candidateName onboardingStep');
            syncLog(`TOTAL_OFFERS: ${all.length}`);
            all.forEach(o => syncLog(`- ${o._id}: ${o.candidateName} (${o.onboardingStep})`));
        }

        await mongoose.disconnect();
        syncLog('--- END DIAGNOSTIC ---');
    } catch (err) {
        syncLog(`ERROR: ${err.message}`);
    } finally {
        process.exit(0);
    }
};

run();

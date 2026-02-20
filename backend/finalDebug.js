const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const file = path.join(__dirname, 'final_debug_results.txt');

async function run() {
    try {
        fs.writeFileSync(file, 'LOG START ' + new Date().toISOString() + '\n');
        fs.appendFileSync(file, `TARGET_PATH: ${file}\n`);
        fs.appendFileSync(file, 'CONNECTING_DB\n');
        await mongoose.connect(process.env.MONGO_URI);
        fs.appendFileSync(file, 'DB_CONNECTED\n');

        const Offer = require('./models/Offer');
        const targetId = '698e97f0ff329f1d86abf3e7';
        const offer = await Offer.findById(targetId);

        if (offer) {
            fs.appendFileSync(file, `TARGET_FOUND: "${offer.candidateName}" | Step: "${offer.onboardingStep}" | Status: "${offer.status}"\n`);
        } else {
            fs.appendFileSync(file, 'TARGET_NOT_FOUND_BY_ID\n');
            const all = await Offer.find({}, 'candidateName onboardingStep');
            fs.appendFileSync(file, `TOTAL_OFFERS: ${all.length}\n`);
            all.forEach(o => fs.appendFileSync(file, `- ${o._id}: ${o.candidateName} (${o.onboardingStep})\n`));
        }
    } catch (err) {
        fs.appendFileSync(file, `ERROR: ${err.message}\n`);
    } finally {
        fs.appendFileSync(file, 'END\n');
        process.exit(0);
    }
}

run();

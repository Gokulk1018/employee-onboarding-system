const mongoose = require('mongoose');
const Offer = require('./models/Offer');
const dotenv = require('dotenv');
dotenv.config();

async function checkOffer() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee-onboarding');
        const offer = await Offer.findById('698e97f0ff329f1d86abf3e7');
        if (offer) {
            console.log('OFFER_DATA_START');
            console.log(JSON.stringify(offer, null, 2));
            console.log('OFFER_DATA_END');
        } else {
            console.log('Offer not found');
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkOffer();

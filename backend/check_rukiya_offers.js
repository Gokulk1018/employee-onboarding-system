const mongoose = require('mongoose');
const Offer = require('./models/Offer');
const dotenv = require('dotenv');
dotenv.config();

async function checkOffer() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee-onboarding');
        const offers = await Offer.find({ candidateEmail: 'gokulsiva753@gmail.com' });
        console.log('OFFERS_FOR_RUKIYA_START');
        console.log(JSON.stringify(offers, null, 2));
        console.log('OFFERS_FOR_RUKIYA_END');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkOffer();

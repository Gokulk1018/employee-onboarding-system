/**
 * Script: restoreOffers.js
 * Purpose: Restore "Hired" offer records by reconstructing them from employees
 * that were previously converted (have an offerId reference).
 * Run with: node scripts/restoreOffers.js
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Employee = require('../models/Employee');
const Offer = require('../models/Offer');

async function restoreOffers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find all employees that have an offerId (i.e., were converted from an offer)
        const convertedEmployees = await Employee.find({ offerId: { $exists: true, $ne: null } });
        console.log(`Found ${convertedEmployees.length} previously converted employees.`);

        let restored = 0;
        let skipped = 0;

        for (const emp of convertedEmployees) {
            // Check if the original offer still exists
            const existingOffer = await Offer.findById(emp.offerId);
            if (existingOffer) {
                console.log(`  [SKIP] Offer already exists for ${emp.name} (${existingOffer.status})`);
                skipped++;
                continue;
            }

            // Reconstruct the offer record from employee data
            const restoredOffer = await Offer.create({
                _id: emp.offerId, // Use the original offerId so links remain consistent
                candidateName: emp.name,
                candidateEmail: emp.email,
                department: emp.department,
                role: emp.role,
                joiningDate: emp.joinDate,
                salary: 0, // Unknown - was deleted with the old record
                status: 'Hired',
                onboardingStep: 'Ready',
                token: require('crypto').randomBytes(32).toString('hex'),
                createdAt: emp.createdAt,
            });

            console.log(`  [RESTORED] Recreated offer for ${emp.name} (${emp.email})`);
            restored++;
        }

        console.log(`\nDone. Restored: ${restored}, Skipped: ${skipped}`);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

restoreOffers();

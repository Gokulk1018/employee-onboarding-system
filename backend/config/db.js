const mongoose = require('mongoose');
const dns = require('dns');

// Configure Node's DNS resolver to use Google and Cloudflare DNS to bypass local ISP SRV blocks
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // Ignore if not supported in environment
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        if (error.message.includes('querySrv') || error.message.includes('ENOTFOUND')) {
            console.error('\n=============================================================');
            console.error(' [MongoDB Atlas SRV Connection Error]');
            console.error(' 1. Check if your MongoDB Atlas cluster is PAUSED.');
            console.error('    MongoDB Atlas automatically pauses free clusters after inactivity.');
            console.error('    Log into https://cloud.mongodb.com and click "Resume".');
            console.error(' 2. Check Network Access in Atlas to ensure your IP (0.0.0.0/0) is allowed.');
            console.error(' 3. If using standard connection string, update MONGO_URI in backend/.env.');
            console.error('=============================================================\n');
        }
        // Do not crash the entire process with process.exit(1) so Express stays alive
        // and returns proper API responses instead of Render 502 Bad Gateway
    }
};

module.exports = connectDB;


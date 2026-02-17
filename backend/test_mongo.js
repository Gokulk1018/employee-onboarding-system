const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const logFile = 'mongo_test_output.txt';
try { fs.unlinkSync(logFile); } catch (e) { }

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

const connect = async () => {
    try {
        log('Attempting to connect...');
        log('URI present: ' + (!!process.env.MONGO_URI));
        await mongoose.connect(process.env.MONGO_URI);
        log('Connected!');
        await mongoose.disconnect();
        log('Disconnected');
        process.exit(0);
    } catch (err) {
        log('Error: ' + err.message);
        process.exit(1);
    }
};

connect();

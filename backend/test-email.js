const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

// Force clean load
dotenv.config({ path: path.resolve(__dirname, './.env') });

const testEmail = async () => {
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.trim();

    console.log('--- STRICT DEBUGGER ---');
    console.log(`User: [${user}] (Length: ${user?.length})`);
    console.log(`Pass: [${pass ? '********' : 'EMPTY'}] (Length: ${pass?.length})`);
    console.log('-----------------------');

    if (pass?.length !== 16) {
        console.error('❌ ERROR: Password must be EXACTLY 16 characters!');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    try {
        console.log('Connecting to Gmail Service...');
        await transporter.verify();
        console.log('✅ SUCCESS: Authenticated!');

        await transporter.sendMail({
            from: user,
            to: user,
            subject: 'Final Verification',
            text: 'If you see this, it works!'
        });
        console.log('✅ SUCCESS: Test email sent!');
    } catch (error) {
        console.error('❌ FAILED:', error.message);
        console.log('\n--- TROUBLESHOOTING ---');
        console.log('1. Double check the 16 letters you copied from Google.');
        console.log('2. Ensure you used the "Other" app type when generating.');
        console.log('3. Ensure you did not change your main Gmail password after generating the app password.');
    }
};

testEmail();

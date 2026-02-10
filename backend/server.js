const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());

// Connect to database
connectDB();

app.get('/', (req, res) => {
    res.send('Backend Server Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

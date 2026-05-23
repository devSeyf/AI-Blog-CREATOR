import express from 'express';

import connectDB from './config/db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();



app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('Server is up and database connection is initialized.');
});

app.listen(PORT, () => {
  console.log(`🖥️  Server running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import https from 'https';  // For HTTPS setup
import { userRouter } from './routes/users.js';
import { diaryRouter } from './routes/Diary.js';
import { employeeRouter } from './routes/Employee.js';
import { storeRouter } from './routes/Store.js';
import { cattleRouter } from './routes/Cattle.js';
import { productRouter } from './routes/Products.js';
import { wholesaleRouter } from './routes/Wholesale.js';
import { stockRouter } from './routes/stockRouter.js';
import dotenv from 'dotenv';
import fs from 'fs';

const app = express();

// Load environment variables from .env
dotenv.config({ path: '.env.local' });

// Fetch the MongoDB URL and set the API URL
const apiUrl ="http://192.168.50.179:3001"; // Default API URL
console.log(apiUrl);
const mongoUrl = process.env.MONGO_URL;
console.log(mongoUrl);

// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'http://192.168.50.179:5173'];

app.use(cors({
  origin: function (origin, callback) {
    console.log('Request Origin:', origin);  // Debugging line to log the origin
    // If no origin is provided (e.g., direct API request), or if the origin is in the allowed list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));  // Reject the request if not allowed
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  preflightContinue: false,  // Let the CORS middleware handle the OPTIONS request
  optionsSuccessStatus: 200,  // Return 200 status for OPTIONS requests (needed for legacy browsers)
}));

// Middleware to parse JSON
app.use(express.json());

// File upload middleware
app.use(fileUpload());

// Define your routes
app.use('/auth', userRouter);
app.use('/diary', diaryRouter);
app.use('/employees', employeeRouter);
app.use('/stores', storeRouter);
app.use('/cattle', cattleRouter);
app.use('/products', productRouter);
app.use('/wholesale', wholesaleRouter);
app.use('/stock', stockRouter);

// MongoDB connection
mongoose.connect(mongoUrl)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Configure and start the server

// Check if we need to run HTTPS or HTTP
if (process.env.NODE_ENV === 'production') {
  // If you are running in production mode and want to use HTTPS:
  // const httpsOptions = {
  //   key: fs.readFileSync('path_to_private_key'),  // Replace with your actual SSL key path
  //   cert: fs.readFileSync('path_to_certificate'),  // Replace with your actual SSL cert path
  // };

  const port = process.env.VITE_PORT || 3001;

  // Start HTTPS server on port 3001
//   https.createServer(app).listen(port, '0.0.0.0', () => {
//     console.log('HTTPS Server is running on https://localhost:3001');
//   });
// } else {
  // If not in production (development), use HTTP
  app.listen(port, '0.0.0.0', () => {
    console.log('Server is running on http://192.168.50.179:3001');
  });
}

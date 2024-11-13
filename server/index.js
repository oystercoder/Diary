import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { userRouter } from './routes/users.js';
import { diaryRouter } from './routes/Diary.js';
import { employeeRouter } from './routes/Employee.js';
import fileUpload from 'express-fileupload';
import { storeRouter } from './routes/Store.js';
import { cattleRouter } from './routes/Cattle.js';
import { productRouter } from './routes/Products.js';
import { wholesaleRouter } from './routes/Wholesale.js';
import { stockRouter } from './routes/stockRouter.js';

const app = express();

// CORS configuration
const allowedOrigins = ['https://localhost:5173', 'http://192.168.50.178:5173'];

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
mongoose.connect("mongodb+srv://sushmasriya1jobs:sushma@cluster0.nj3yq.mongodb.net/")
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

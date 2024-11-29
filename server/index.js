import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Stock from './models/Stock.js';
import Cattle from './models/Cattle.js';
import Store from './models/Store.js';
import userModel from './models/Users.js';
import { stockRouter } from './routes/stockRouter.js';
import { diaryRouter } from './routes/diaryRouter.js';
import { cattleRouter } from './routes/cattleRouter.js';
import { storesRouter } from './routes/storesRouter.js';
import { employeeRouter } from './routes/employeeRouter.js';
import { productsRouter } from './routes/productsRouter.js';
import { wholesaleRouter } from './routes/wholesaleRouter.js';
import { authRouter } from './routes/authRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
console.log("Server starting on port:", PORT);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} from ${req.get('origin')}`);
  next();
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test')
  .then(async () => {
    console.log('MongoDB connected successfully');
    try {
      // Check collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));

      // Initialize users collection and add test user if needed
      const usersCollection = collections.find(c => c.name === 'users');
      if (!usersCollection) {
        console.log('Creating users collection...');
        await mongoose.connection.db.createCollection('users');
      }

      const usersCount = await userModel.countDocuments();
      console.log(`Database has ${usersCount} user documents`);

      if (usersCount === 0) {
        console.log('Adding test user...');
        const testUser = new userModel({
          username: 'admin@example.com',
          password: 'admin123',
          role: 'admin'
        });
        await testUser.save();
        console.log('Test user added');
      }

      // Check if stores collection exists and initialize
      const storesCollection = collections.find(c => c.name === 'stores');
      if (!storesCollection) {
        console.log('Creating stores collection...');
        await mongoose.connection.db.createCollection('stores');
      }

      const storesCount = await Store.countDocuments();
      console.log(`Database has ${storesCount} store documents`);

      if (storesCount === 0) {
        console.log('Adding test store documents...');
        const testStores = [
          {
            name: "Main Branch Store",
            location: "City Center",
            contactNumber: "123-456-7890",
            manager: "John Smith"
          },
          {
            name: "North Side Store",
            location: "North Mall",
            contactNumber: "234-567-8901",
            manager: "Jane Doe"
          }
        ];

        await Store.insertMany(testStores);
        console.log('Test store documents added');
      }

      // Check if cattle collection exists and initialize
      const cattleCollection = collections.find(c => c.name === 'cattles');
      if (!cattleCollection) {
        console.log('Creating cattle collection...');
        await mongoose.connection.db.createCollection('cattles');
      }

      const cattleCount = await Cattle.countDocuments();
      console.log(`Database has ${cattleCount} cattle documents`);

      if (cattleCount === 0) {
        console.log('Adding test cattle document...');
        const testCattle = new Cattle({
          animal: "COW",
          breed: "Holstein",
          gender: "female",
          age: 3,
          breeding: 2,
          price: 50000,
          location: "Barn A",
          name: "Bessie",
          offspring: "2"
        });
        await testCattle.save();
        console.log('Test cattle document added');
      }

      // Check if stocks collection exists and initialize
      const stocksCollection = collections.find(c => c.name === 'stocks');
      if (!stocksCollection) {
        console.log('Creating stocks collection...');
        await mongoose.connection.db.createCollection('stocks');
      }

      const stockCount = await Stock.countDocuments();
      console.log(`Database has ${stockCount} stock documents`);

      if (stockCount === 0) {
        console.log('Adding test stock document...');
        const testStock = new Stock({
          dealerName: "Test Dealer",
          productName: "White cream",
          quantity: 750,
          unit: "tons",
          pricePerUnit: 550,
          totalPrice: 275000,
          paid: 4566,
          type: "purchase",
          due: new Date("2024-12-03"),
          paidDate: new Date("2024-11-27"),
          payments: []
        });
        await testStock.save();
        console.log('Test stock document added');
      }

      // Show first few documents
      const stocks = await Stock.find().lean();
      console.log('Current stock documents:', stocks);

    } catch (error) {
      console.error('Error initializing database:', error);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Add error handlers for MongoDB connection
mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Routes
app.use('/auth', authRouter);
app.use('/stock', stockRouter);
app.use('/diary', diaryRouter);
app.use('/cattle', cattleRouter);
app.use('/stores', storesRouter);
app.use('/employees', employeeRouter);
app.use('/products', productsRouter);
app.use('/wholesale', wholesaleRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Add a test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is running',
    port: PORT,
    env: process.env.NODE_ENV
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

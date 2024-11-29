import express from 'express';
import Store from '../models/Store.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const stores = await Store.find().lean();
    console.log('Fetched stores:', stores);
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, location, contactNumber, manager } = req.body;
    const newStore = new Store({ name, location, contactNumber, manager });
    await newStore.save();
    console.log('New store added:', newStore);
    res.status(201).json({ message: 'Store created successfully', store: newStore });
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(400).json({ message: error.message });
  }
});

export { router as storesRouter }; 
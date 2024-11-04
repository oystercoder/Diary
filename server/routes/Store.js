import express from 'express';
import Store from '../models/Store.js';

const router = express.Router();

// POST route to add a store
router.post('/', async (req, res) => {
  const { name, location, storeId } = req.body;

  try {
    const newStore = new Store({ name, location, storeId });
    await newStore.save();
    res.status(201).json({ message: 'Store added successfully!', store: newStore });
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ message: 'Error adding store', error });
  }
});

// GET route to fetch all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Error fetching stores', error });
  }
});


export { router as storeRouter };
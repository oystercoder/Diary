import express from 'express';
import Cattle from '../models/Cattle.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cattleList = await Cattle.find().lean();
    console.log('Fetched cattle list:', cattleList);
    res.json(cattleList);
  } catch (error) {
    console.error('Error fetching cattle:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCattle = new Cattle(req.body);
    await newCattle.save();
    res.status(201).json({ message: 'Cattle entry saved successfully!', newCattle });
  } catch (error) {
    res.status(500).json({ message: 'Error saving cattle entry', error });
  }
});

export { router as cattleRouter }; 
import express from 'express';
import Diary from '../models/Diary.js';

const router = express.Router();

// Get all entries
router.get('/', async (req, res) => {
  try {
    const entries = await Diary.find().sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new entry
router.post('/', async (req, res) => {
  const entry = new Diary({
    cowId: req.body.cowId,
    quantity: req.body.quantity,
    time: req.body.time,
    quality: req.body.quality,
    date: req.body.date || new Date()
  });

  try {
    const newEntry = await entry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get entries by date
router.get('/date/:date', async (req, res) => {
  try {
    const startDate = new Date(req.params.date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(req.params.date);
    endDate.setHours(23, 59, 59, 999);

    const entries = await Diary.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as diaryRouter }; 
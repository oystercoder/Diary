import express from 'express'
import { Router } from 'express';
import { Diary } from '../models/Diary.js';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { diary, managerName } = req.body;
    const newDiaryEntry = new Diary({ diary, managerName });
    await newDiaryEntry.save();
    res.status(201).json({ message: 'Diary entry saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving diary entry', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const diaryEntries = await Diary.find(); // Changed variable name to avoid conflict
    res.json(diaryEntries);
  } catch (error) {
    console.error('Error fetching diary:', error);
    res.status(500).json({ message: 'Error fetching diary', error });
  }
});

export { router as diaryRouter };
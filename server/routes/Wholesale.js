// routes/Wholesale.js
import express from 'express';
import Wholesale from '../models/Wholesale.js';

const router = express.Router();

// POST endpoint to create a new wholesale entry
router.post('/', async (req, res) => {
  try {
    const { name, contactNumber, location } = req.body;

    const newWholesale = new Wholesale({ name, contactNumber, location });
    await newWholesale.save();

    res.status(201).json({ message: 'Wholesale entry submitted successfully!', wholesale: newWholesale });
  } catch (error) {
    console.error('Error saving wholesale entry:', error);
    res.status(500).json({ message: 'Error saving wholesale entry', error: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
      const wholesales = await Wholesale.find();
      res.status(200).json(wholesales);
    } catch (error) {
      console.error('Error fetching wholesale entries:', error);
      res.status(500).json({ message: 'Error fetching wholesale entries', error: error.message });
    }
  });
  

export { router as wholesaleRouter };

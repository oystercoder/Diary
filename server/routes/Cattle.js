// routes/Cattle.js
import express from 'express';
import Cattle from '../models/Cattle.js'; // Use default import

const router = express.Router();

// POST endpoint to create a new cattle entry
router.post('/', async (req, res) => {
  try {
    const {
      animal,
      breed,
      gender,
      age,
      breeding,
      price,
      location,
      name,
      offspring,
    } = req.body;

    const newCattle = new Cattle({
      animal,
      breed,
      gender,
      age,
      breeding,
      price,
      location,
      name,
      offspring,
    });

    await newCattle.save();
    res.status(201).json({ message: 'Cattle entry saved successfully!', newCattle });
  } catch (error) {
    res.status(500).json({ message: 'Error saving cattle entry', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const cattleList = await Cattle.find().lean();
    console.log('Backend cattleList:', cattleList); // Debug log
    
    // Ensure we're sending an array
    if (!Array.isArray(cattleList)) {
      console.warn('Warning: cattleList is not an array');
      return res.status(200).json([]);
    }
    
    res.status(200).json(cattleList);
  } catch (error) {
    console.error('Error fetching cattle:', error);
    res.status(500).json({ message: 'Error fetching cattle entries', error });
  }
});
// Optional: Add more routes (GET, PUT, DELETE) as needed

export { router as cattleRouter };

import express from 'express';
import Wholesale from '../models/Wholesale.js';

const router = express.Router();

// Get all wholesalers
router.get('/', async (req, res) => {
  try {
    const wholesalers = await Wholesale.find().lean();
    res.json(wholesalers);
  } catch (error) {
    console.error('Error fetching wholesalers:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add new wholesaler
router.post('/', async (req, res) => {
  try {
    const { name, location, contactNumber, email, products } = req.body;
    const newWholesaler = new Wholesale({
      name,
      location,
      contactNumber,
      email,
      products
    });
    
    await newWholesaler.save();
    res.status(201).json({ 
      message: 'Wholesaler added successfully',
      wholesaler: newWholesaler
    });
  } catch (error) {
    console.error('Error adding wholesaler:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete wholesaler
router.delete('/:id', async (req, res) => {
  try {
    const wholesaler = await Wholesale.findByIdAndDelete(req.params.id);
    if (!wholesaler) {
      return res.status(404).json({ message: 'Wholesaler not found' });
    }
    res.json({ message: 'Wholesaler deleted successfully' });
  } catch (error) {
    console.error('Error deleting wholesaler:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update wholesaler
router.put('/:id', async (req, res) => {
  try {
    const wholesaler = await Wholesale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!wholesaler) {
      return res.status(404).json({ message: 'Wholesaler not found' });
    }
    res.json(wholesaler);
  } catch (error) {
    console.error('Error updating wholesaler:', error);
    res.status(400).json({ message: error.message });
  }
});

export { router as wholesaleRouter }; 
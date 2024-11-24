// server/routes/stockRouter.js
import express from 'express';
import Stock from '../models/Stock.js'; // Ensure you're using default import

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log('Incoming request data:', req.body);

    const { productName, quantity,unit, pricePerUnit, type, dealerName,totalPrice } = req.body;
    console.log(unit)

    // Check if all required fields are provided
    if (!productName || !quantity || !pricePerUnit|| !type || !dealerName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newStock = new Stock({
      productName,
      quantity,
      unit,
      pricePerUnit,
      totalPrice,
      type,
      dealerName,
    });

    // Save the new stock transaction
    await newStock.save();

    res.status(201).json({
      message: 'Stock transaction created successfully!',
      stock: newStock,
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Error during stock transaction:', error);
    res.status(500).json({ message: 'Error creating stock transaction', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (error) {
    console.error('Error fetching stock transactions:', error);
    res.status(500).json({ message: 'Error fetching stock transactions', error: error.message });
  }
});

export { router as stockRouter };


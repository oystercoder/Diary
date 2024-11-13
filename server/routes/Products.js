import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// POST endpoint to create a new product
router.post('/', async (req, res) => {
  const { name, units, price } = req.body;

  // Validate the request body
  if (!name  || typeof price !== 'number') {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    const newProduct = new Product({ name, units, price });
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully!', product: newProduct });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ message: 'Error saving product', error: error.message });
  }
});

// GET endpoint to retrieve all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

export { router as productRouter };

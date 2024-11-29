import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  units: { type: String, required: true },
  price: { type: Number, required: true },
  unitType: { type: String, default: 'liters' }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, units, price, unitType } = req.body;
    const newProduct = new Product({ name, units, price, unitType });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
});

export { router as productsRouter }; 
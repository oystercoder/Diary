// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  units: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

const Product = mongoose.model('Product', productSchema);
export default Product;

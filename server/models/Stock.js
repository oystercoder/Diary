// models/Stock.js
import mongoose from 'mongoose';

// Define the schema for stock transactions (purchase or sale)
const stockSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,  // Product name is required
    },
    quantity: {
      type: String,
      required: true,  // Quantity is required
    },
    pricePerUnit: {
      type: String,
      required: true,  // Price per unit is required
    },
    totalPrice: {
      type: Number,
      required: true,  // Total price (calculated as price * quantity) is required
    },
    type: {
      type: String,
      enum: ['purchase', 'sale'],  // Only allows 'purchase' or 'sale'
      required: true,  // Type of transaction is required
    },
    dealerName: {
      type: String,
      required: true,  // Dealer name is required
    },
    date: {
      type: Date,
      default: Date.now,  // Default to current date and time
    },
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

// Create and export the Stock model
const Stock = mongoose.model('Stock', stockSchema);
export default Stock;



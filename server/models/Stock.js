// models/Stock.js
import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  dealerName: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  pricePerUnit: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  type: { type: String, enum: ['purchase', 'sale'], required: true },
  due: { type: Date, required: true },
  paidDate: { type: Date, required: true },
  fatPercentage: { type: Number, required: function() {
    return this.productName.toLowerCase().includes('cream');
  }},
  payments: [{
    date: { type: Date, required: true },
    amount: { type: Number, required: true }
  }]
}, { 
  timestamps: true,
  collection: 'stocks'
});

const Stock = mongoose.model('Stock', stockSchema);
export default Stock;


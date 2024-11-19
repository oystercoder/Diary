// models/Cattle.js
import mongoose from 'mongoose';

const cattleSchema = new mongoose.Schema({
  animal: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
   
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'], // Optional: restrict to specific values
  },
  age: {
    type: Number,
    required: true,
  },
  breeding: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  offspring: {
    type: String,
    required: false, // Change to true if you want this field to be required
  },
}, { timestamps: true }); // Optional: add timestamps for createdAt and updatedAt

const Cattle = mongoose.model('Cattle', cattleSchema);
export default Cattle; // Ensure you're using default export

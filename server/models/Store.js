// models/Store.js
import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  storeId: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true }); // Optional: add timestamps for createdAt and updatedAt

const Store = mongoose.model('Store', storeSchema);
export default Store;

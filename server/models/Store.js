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
  contactNumber: {
    type: String,
    required: true,
  },
  manager: {
    type: String,
    required: true,
  }
}, { timestamps: true, collection: 'stores' });

const Store = mongoose.model('Store', storeSchema);
export default Store;

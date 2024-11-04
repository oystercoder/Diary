// models/Wholesale.js
import mongoose from 'mongoose';

const wholesaleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  // You can add more fields as necessary
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

const Wholesale = mongoose.model('Wholesale', wholesaleSchema);
export default Wholesale;

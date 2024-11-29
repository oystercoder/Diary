// models/Wholesale.js
import mongoose from 'mongoose';

const wholesaleSchema = new mongoose.Schema({
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
  }
}, { timestamps: true });

const Wholesale = mongoose.model('Wholesale', wholesaleSchema);
export default Wholesale;

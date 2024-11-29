import mongoose from 'mongoose';

const diarySchema = new mongoose.Schema({
  cowId: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  time: {
    type: String,
    enum: ['Morning', 'Evening'],
    required: true
  },
  quality: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Diary = mongoose.model('Diary', diarySchema);
export default Diary;
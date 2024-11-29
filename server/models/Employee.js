import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String },
  joiningDate: { type: Date, default: Date.now },
  salary: { type: Number, required: true },
  status: { type: String, default: 'Active' }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;

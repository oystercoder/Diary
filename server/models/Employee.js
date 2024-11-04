// models/Employee.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contactNumber: { type: String, required: true },
  role: { type: String, required: true },
  idProof: { type: String, required: true }, // Path to the file
  joiningDate: { type: Date, required: true },
  salary: { type: Number, required: true },
});

export const Employee = mongoose.model('Employee', employeeSchema);

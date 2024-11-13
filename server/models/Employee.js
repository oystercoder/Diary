import mongoose from 'mongoose';

// Employee schema definition
const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contactNumber: { type: String, required: true },
    role: { type: String, required: true },
    idProof: { type: String, required: true }, // Path to the file (for ID proof)
    joiningDate: { type: Date, required: true },
    salary: { type: Number, required: true },

    // New fields for credentials
    email: { type: String, unique: true, sparse: true,required: false }, // Make sure email is unique
    password: { type: String ,required:false}, // Password field
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create and export the Employee model
export const Employee = mongoose.model('Employee', employeeSchema);

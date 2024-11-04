import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { Employee } from '../models/Employee.js';

// Create a router
const router = express.Router();

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST route to submit employee data
router.post('/', upload.single('idProof'), async (req, res) => {
  console.log("Entered the backend....");
  console.log(req.body);

  try {
    // Access the fields from req.body
    const { name, location, contactNumber, role, joiningDate, salary } = req.body;
    console.log(name);

    // Validate the required fields
    if (!name || !location || !contactNumber || !role || !joiningDate || !salary) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const idProof = req.file.path; // Get the path of the uploaded file

    const newEmployee = new Employee({
      name,
      location,
      contactNumber,
      role,
      idProof, // Store the file path
      joiningDate,
      salary,
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee added successfully!', employee: newEmployee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Error adding employee', error });
  }
});
router.get('/', async (req, res) => {
    try {
      const employees = await Employee.find();
      res.json(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: 'Error fetching employees', error });
    }
  });

export { router as employeeRouter };

  
 
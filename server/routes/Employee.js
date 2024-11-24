import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcryptjs';
// To hash the password (if provided)
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

// POST route to submit employee data including credentials (email and password are optional)
router.post('/', upload.single('idProof'), async (req, res) => {
  console.log("Entered the backend....");
  console.log(req.body);

  try {
    // Access the fields from req.body
    const { name, location, contactNumber, role, joiningDate, salary, email, password } = req.body;
    console.log(name);

    // Validate the required fields
    if (!name || !location || !contactNumber || !role || !joiningDate || !salary) {
      return res.status(400).json({ message: 'All fields except email and password are required' });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const idProof = req.file.path; // Get the path of the uploaded file

    // Create the new employee object
    const newEmployeeData = {
      name,
      location,
      contactNumber,
      role,
      idProof, // Store the file path
      joiningDate,
      salary,
    };

    // If email and password are provided, hash the password and add email and password to the data
    if (email && password) {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Add email and password to the new employee data
      newEmployeeData.email = email;
      newEmployeeData.password = hashedPassword;
    }

    // Create a new employee instance
    const newEmployee = new Employee(newEmployeeData);

    // Save the employee data to the database
    await newEmployee.save();

    // Return the response
    res.status(201).json({ message: 'Employee added successfully!', employee: newEmployee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: 'Error adding employee', error });
  }
});

// Assuming Employee model is imported

router.put('/:id', async (req, res) => {
  try {
    const {  password } = req.body;

    // Check if email and password are provided
    if ( !password) {
      return res.status(400).json({ message: 'Email and password are required to update credentials' });
    }

    // Find the employee by ID
    const employee = await Employee.findById(req.params.id);
    

    // Check if the email is already taken by another employee
    
   
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the employee record with the new email and password
   
    employee.password = hashedPassword;

    // Save the updated employee record
    await employee.save();

    res.status(200).json({ message: 'Credentials updated successfully', employee });
  } catch (error) {
    console.error('Error updating employee credentials:', error);
    res.status(500).json({ message: 'Error updating employee credentials', error });
  }
});


// GET route to fetch all employees
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


  
 
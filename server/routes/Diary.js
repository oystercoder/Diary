import express from 'express'
import { Router } from 'express';
import { Diary } from '../models/Diary.js';
import mongoose from 'mongoose';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { diary, managerName } = req.body;
    const newDiaryEntry = new Diary({ diary, managerName });
    await newDiaryEntry.save();
    res.status(201).json({ message: 'Diary entry saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving diary entry', error });
  }
});

router.get('/', async (req, res) => {
  try {
    const diaryEntries = await Diary.find(); // Changed variable name to avoid conflict
    res.json(diaryEntries);
  } catch (error) {
    console.error('Error fetching diary:', error);
    res.status(500).json({ message: 'Error fetching diary', error });
  }
});
router.patch('/:id', async (req, res) => {
  const { id } = req.params; // Get the ID from the request URL
  const updatedData = req.body; // Get the updated data from the request body
  console.log(updatedData); // Log the data to check what is being sent

  try {
    // Validate if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ObjectId' });
    }

    // Attempt to update the item using the ObjectId
    const updatedItem = await Diary.findByIdAndUpdate(
      id, // Using id directly because mongoose.Types.ObjectId is not necessary with .findById()
      updatedData, // Use the entire updated data from the request body
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    if (!updatedItem) {
      // If no item is found, respond with a 404 error
      return res.status(404).json({ message: 'Item not found' });
    }

    // If update is successful, respond with the updated item
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' }); // Handle server errors
  }
});
router.delete('/:id', async (req, res) => {
  console.log("enteres")
  const { id } = req.params;
  console.log(id)
   // Get the ID from the request
   if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  

  try {
    // Convert the string ID to a MongoDB ObjectId
    const objectId = new mongoose.Types.ObjectId(id);
    console.log(objectId)

    // Attempt to delete the item using the ObjectId
    const deletedItem = await Diary.findByIdAndDelete(objectId);

    if (!deletedItem) {
      // If no item is found, respond with a 404 error
      return res.status(404).json({ message: 'Item not found' });
    }

    // If deletion is successful, respond with success
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' }); // Handle server errors
  }
});

export { router as diaryRouter };
// server/routes/stockRouter.js
import express from 'express';
import mongoose from 'mongoose';
import Stock from '../models/Stock.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    await newStock.save();
    res.status(201).json({
      message: 'Stock transaction created successfully!',
      stock: newStock,
    });
  } catch (error) {
    console.error('Error creating stock transaction:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log("Fetching stock entries...");
    
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log("Database connection state:", mongoose.connection.readyState);
      throw new Error('Database not connected');
    }

    // Get collection info
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Find all documents
    const stocks = await Stock.find({})
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log(`Found ${stocks.length} stock entries:`, stocks);

    // Send response
    res.json(stocks);
  } catch (error) {
    console.error('Error in GET /stock:', error);
    res.status(500).json({ 
      message: 'Error fetching stock transactions', 
      error: error.message,
      connectionState: mongoose.connection.readyState 
    });
  }
});



// DELETE request to remove stock item
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
    const deletedItem = await Stock.findByIdAndDelete(objectId);

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


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { paid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const stock = await Stock.findById(id);
    if (!stock) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Only update initial payment if it hasn't been set yet
    if (!stock.paid || stock.paid === 0) {
      stock.paid = Number(paid);
      stock.paidDate = new Date();
    } else {
      // If initial payment exists, add this as an additional payment
      stock.payments.push({
        date: new Date(),
        amount: Number(paid)
      });
    }

    const updatedStock = await stock.save();
    res.status(200).json(updatedStock);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: error.message });
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
    const updatedItem = await Stock.findByIdAndUpdate(
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

// Add payment to a transaction
router.post('/:id/payments', async (req, res) => {
  try {
    const { amount, date } = req.body;
    const stock = await Stock.findById(req.params.id);
    
    if (!stock) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Always add as an additional payment
    const newPayment = {
      date: date || new Date(),
      amount: Number(amount)
    };
    stock.payments.push(newPayment);
    
    await stock.save();
    
    res.status(200).json(stock);
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get payment history for a transaction
router.get('/:id/payments', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Create payment history array
    const payments = [];
    let runningTotal = 0;
    
    // Add initial payment if it exists
    if (stock.paid > 0) {
      runningTotal = Number(stock.paid);
      payments.push({
        date: stock.paidDate,
        amount: Number(stock.paid),
        type: 'initial',
        runningTotal: runningTotal
      });
    }

    // Add subsequent payments with running total
    if (stock.payments && stock.payments.length > 0) {
      stock.payments.forEach(payment => {
        runningTotal += Number(payment.amount);
        payments.push({
          date: payment.date,
          amount: Number(payment.amount),
          type: 'additional',
          runningTotal: runningTotal
        });
      });
    }

    res.status(200).json({
      payments,
      totalPrice: stock.totalPrice,
      totalPaid: runningTotal,
      remainingDue: stock.totalPrice - runningTotal
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add this route for testing
router.post('/test', async (req, res) => {
  try {
    const testStock = new Stock({
      productName: "Test Product",
      quantity: 100,
      unit: "Liters",
      pricePerUnit: 50,
      totalPrice: 5000,
      paid: 2000,
      type: "purchase",
      dealerName: "Test Dealer",
      due: new Date(),
      paidDate: new Date(),
      payments: []
    });

    await testStock.save();
    console.log("Test stock created:", testStock);
    res.status(201).json({ message: 'Test stock created', stock: testStock });
  } catch (error) {
    console.error('Error creating test stock:', error);
    res.status(500).json({ message: error.message });
  }
});

// Test route to check database connection
router.get('/test', async (req, res) => {
  try {
    // Check connection state
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Count documents
    const count = await Stock.countDocuments();
    console.log('Number of documents:', count);

    // Send response
    res.json({
      connectionState: mongoose.connection.readyState,
      collections: collections.map(c => c.name),
      documentCount: count
    });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add test route
router.get('/test', async (req, res) => {
  try {
    const count = await Stock.countDocuments();
    const stocks = await Stock.find().lean();
    res.json({
      message: 'Stock router is working',
      documentCount: count,
      connectionState: mongoose.connection.readyState,
      documents: stocks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get transactions by dealer name
router.get('/dealer/:dealerName', async (req, res) => {
  try {
    const { dealerName } = req.params;
    const transactions = await Stock.find({ dealerName })
      .sort({ paidDate: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching dealer transactions:', error);
    res.status(500).json({ message: 'Failed to fetch dealer transactions' });
  }
});

export { router as stockRouter };


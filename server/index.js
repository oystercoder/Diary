import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import {userRouter} from './routes/users.js'
import { diaryRouter } from './routes/Diary.js'
import { employeeRouter } from './routes/Employee.js'

import fileUpload from 'express-fileupload';
import { storeRouter } from './routes/Store.js'
import { cattleRouter } from './routes/Cattle.js'
import { productRouter } from './routes/Products.js'
import { wholesaleRouter } from './routes/Wholesale.js'



const app=express();
app.use(express.json())
app.use(cors())
app.use('/auth',userRouter)
app.use('/diary',diaryRouter)
app.use('/employees',employeeRouter)
app.use('/stores', storeRouter);
app.use('/cattle', cattleRouter);
app.use('/products', productRouter);
app.use('/wholesale', wholesaleRouter);
app.use(fileUpload());


  
  // Start server




mongoose.connect("mongodb+srv://sushmasriya1jobs:sushma@cluster0.nj3yq.mongodb.net/")
mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected to the database');
});

// Check for connection errors
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

//mongoose.connect("mongodb:https://localhost:27017")



app.listen(3001, () => {
    console.log('Server is running on port 3001');
})
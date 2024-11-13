import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { userModel } from '../models/Users.js';
import { Router } from 'express';

const router=express.Router();
router.post('/login',async(req,res)=>{
    const {email,password}=req.body
    console.log("Email:", email);
    console.log("login router is workinggggg")
    console.log("Password:", password);
    const user = await userModel.findOne({email});
    if(!user)
        {
            return res.status(401).json({message:"enter valid Email Id"})

        }
        
const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
        {
            return res.status(401).json({message:"enter valid Password"})
        }
        const token=jwt.sign({id:user._id},"secret")
        res.status(200).json({token,userID:user._id,message:"login success"})


})
router.post('/register',async(req,res)=>{
    const {email,password}=req.body
    //usermodel.users.insertOne({username:"soumy",password:"1emen"})
    
   
    //const user=await usermodel.findOne({username})
   
        const user = await userModel.findOne({email});

        if (user) {
            // console.log(user); // User found
             return res.status(401).json({message:"user already exists"});
            //return res.json({message:"user exists"})
           
        } 
            
            const newpassword=await bcrypt.hash(password,10);
            const newuser=new userModel({email,password:newpassword})
            await newuser.save()
            res.status(200).json({ message: 'user stored succesufully' });
        
    
    
   // console.log(user)
  //  res.json(user);
})

// Backend: Updating login credentials (authentication database)
// Backend: Updating employee credentials in the employee database
router.put('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await userModel.findOne({ email });
  
      if (user) {
        // Hash the new password
        const newPassword = await bcrypt.hash(password, 10);
  
        // Update the user's password in the database
        user.password = newPassword;
  
        // Save the updated user document
        await user.save();
  
        res.status(200).json({ message: 'Password updated successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

export {router as userRouter}
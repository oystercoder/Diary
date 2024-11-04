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
        const isMatch=password==user.password
        if(!isMatch)
        {
            return res.status(401).json({message:"enter valid Password"})
        }
        const token=jwt.sign({id:user._id},"secret")
        res.status(200).json({token,userID:user._id,message:"login success"})


})

export {router as userRouter}
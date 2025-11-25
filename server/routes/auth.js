import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Folder from '../models/Folder.js';

const router =express.Router();
const { ObjectId } = mongoose.Types;

router.post('/', async(req, res)=>{
    try{
        const {email, password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:'Email and password are required'})
        }
        const findUser= await User.findOne({email, password})
        if(!findUser){
            return res.status(400).json({ message: 'Неверный email или пароль' });
        }
        return res.status(200).json(findUser)
    }
    catch(err){
        console.error('Login error: ', err)
        res.status(500).json(err)
    }
})

router.post('/register', async(req, res)=>{
    try{
        const {username, email, password}=req.body;
        if(!email||!username||!password){
            return res.status(400).json({message:"Email and password are required"})
        }
        const existUser=await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"Пользователь с таким email уже существует "})
        }
        
        const newUser=new User({username, email, password})
        await newUser.save()
        
        const firstFolder= new Folder({
            folderName:"Default",
            privilege:false,
            user: newUser._id})
        await firstFolder.save()
     
        const user = newUser.toObject()
        res.status(201).json(user) 
    }
    catch(err){
        console.error('Registration error:', err);
        res.status(500).json({message:"Server error: ", error:err.message})
    }
})

export default router;
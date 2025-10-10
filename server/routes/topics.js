import express from 'express'
import mongoose from 'mongoose'
import Folder from '../models/Folder.js'
import User from '../models/User.js'
import Topic from '../models/Topic.js'

const router =express.Router();
router.post('/homepage/newflashcardset/topic', async(req, res)=>{
    try{
        const {title,description,folderID, userID}=req.body
    if(!title||!description||!folderID|| !userID){
        return res.status(400).json({message:"title,description,folderID, userID are required"})
    }
    const user = await User.findById(userID)
    if(!user){
         return res.status(400).json({message:"user isnt founded"})
    }
    const folder = await Folder.findById(folderID)
    if(!folder){
         return res.status(400).json({message:"folder isnt founded"})
    }
    const topic = new Topic({
        name:title, 
        cards:[], 
        user:user._id, 
        description, 
        folder: folder._id
    })
    await topic.save()
    folder.topic.push(topic._id)
    await folder.save();
    return res.status(201).json(topic)
    }
    catch(err){
         console.error('Create folder error: ', err)
        res.status(500).json(err)
    }
    
})
export default router
//{_id:{ $in user.folder }}
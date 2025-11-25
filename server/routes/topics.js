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
    const folderDefault= await Folder.findOne({user:user._id, folderName:'Default'})
    const topic = new Topic({
        topicname:title, 
        user:user._id, 
        description, 
        folders:[ folder._id, folderDefault], 
        privilege:false, 
        topicSize:0,
        folderName:[ folder.folderName,'Default' ], 
    })
    await topic.save()
    return res.status(201).json(topic)
    }
    catch(err){
         console.error('Create folder error: ', err)
        res.status(500).json(err)
    }
    
})
router.get('/homepage/newflashcardset/topic', async(req, res)=>{
    try{
        const userID=req.query.userID
        console.log('полуичла данные с фронта вот например id', userID)
        if(!userID)
            return res.status(400).json({message:"userID was skipped"})

        const folderDefault = await Folder.findOne({user:userID, folderName:'Default'})
        if(!folderDefault)
            return res.status(400).json({message:"folder default wasn't founded"})
        const topics = await Topic.find({folders:folderDefault._id})
        if(!topics)
            return res.status(400).json({message:"topics waren't founded"})
        console.log("папки дефолт у пользователя",topics)
        return res.status(200).json(topics)
    }
    catch(err){
        console.error('Finding all topics error: ', err)
        res.status(500).json(err)
    }
})
router.patch('/homepage/topic', async(req, res)=>{
    try{
        const {topicId} = req.body
        if(!topicId){
            return res.status(404).json({message:'topicId is required'})
        }
        const topic = await Topic.findById(topicId)
        if(!topic){
            return res.status(404).json({message:"topic isnt found"})
        }
        topic.privilege = ! topic.privilege
        await topic.save()
        return res.status(200).json(topic)
    }
    catch(err){
        console.error('patch topic error: ', err)
        res.status(500).json(err)
    }
})
router.get('/homepage/topic/favorite', async(req, res)=>{
    try{
        const userID= req.query.userID
        if(!userID){
            return res.status(400).json({message:"user isnt founded"})
        }
        const topics= await Topic.find({user:userID, privilege:true}) 
        if(!topics)
            return res.status(400).json({message:"topics arent founded"})
        return res.status(200).json(topics)
    }
    catch(err){
        console.error('Finding all topics error: ', err)
        res.status(500).json(err)
    }
})
export default router
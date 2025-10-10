import express from 'express'
import mongoose from 'mongoose'
import Folder from '../models/Folder.js'
import User from '../models/User.js'

const router =express.Router();

router.post('/homepage/:id', async(req, res)=>{
    try{
        const {nameFolder}=req.body;
        const {id}=req.params;

        if(!nameFolder){
            return res.status(400).json({message:'Name folder are required'})
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const findUser= await User.findById(id)
        if(!findUser){
            return res.status(400).json({message:"User isn't exist"})
        }
        const userFolders= await Folder.find({_id:{ $in: findUser.folder}})
        const findFolder = userFolders.some(el=>el.folderName===nameFolder)

        if(findFolder){
            return res.status(400).json({message:"Folder exist"})
        }
        const newFolder=  new Folder({
            folderName:nameFolder,
            privilege:false, 
            topic:[], 
            user:id
        })
        await newFolder.save()
        findUser.folder.push(newFolder._id)
        await  findUser.save()
       

       return res.status(200).json(newFolder)

    }
    catch(err){
        console.error('Create folder error: ', err)
        res.status(500).json(err)
    
    }
})

router.get('/homepage/:id', async(req, res)=>{
    try{
        const {id}= req.params;
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await User.findById(id)
        if(!user){
            return res.status(400).json({message:"user isnt founded"})
        }
        const folders = await Folder.find({_id: {$in:user.folder}})
        return res.status(200).json(folders)
    }
    catch(err){
        console.error('Find folder error: ', err)
        res.status(500).json(err)
    }
})

export default router;

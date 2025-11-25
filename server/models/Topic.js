import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    topicname:{type:String, trim: true}, 
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    description: {type:String, trim: true}, 
    createdAt:{type:Date, default:Date.now},
    recentlyWatched:{type:Date, default:Date.now},
    folders:[{type:mongoose.Schema.Types.ObjectId, ref:'Folder'}], 
    privilege:Boolean,
    topicSize:{type:Number},
    folderName:[{type:String, trim:true}]
})
export default mongoose.model('Topic', topicSchema);
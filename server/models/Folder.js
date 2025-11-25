import mongoose from "mongoose";

const folderShema= new mongoose.Schema({
    folderName:{type:String, trim: true}, 
    privilege:Boolean,
    createdAt:{type:Date,default:Date.now},
    recentlyWatched:{type:Date, default:Date.now},
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
})
export default mongoose.model('Folder', folderShema)

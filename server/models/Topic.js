import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    name:{type:String, trim: true}, 
    cards:[{type:mongoose.Schema.Types.ObjectId, ref:'Card'}],
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    description: {type:String, trim: true}, 
    createdAt:{type:Date, default:Date.now},
    recentlyWatched:{type:Date, default:Date.now},
    folder:{type:mongoose.Schema.Types.ObjectId, ref:'Folder'}
})
export default mongoose.model('Topic', topicSchema);
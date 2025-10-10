import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    term:{type:String, trim: true}, 
    definition: {type:String, trim: true}, 
    positionInTheCollection:Number,
    privilege:Boolean,
    topic:{type:mongoose.Schema.Types.ObjectId, ref:"Topic"},
    createdAt:{type:Date,default:Date.now},
    recentlyWatched:{type:Date, default:Date.now}
})

export default mongoose.model('Card', cardSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type:String, required:true, trim: true}, 
    email:{type:String, unique:true, required: true , trim: true}, 
    password:{type:String, required:true, trim: true},
    folder:[{type:mongoose.Schema.Types.ObjectId, ref:"Folder"}]
})
export default mongoose.model('User', userSchema);


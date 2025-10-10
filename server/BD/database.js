import mongoose from "mongoose";

const MONGOBD_URI= 'mongodb://localhost:27017/training-cards';

export const connectBD=async()=>{
    try{
        await mongoose.connect(MONGOBD_URI)
        console.log('бд подкличилась')
    }
    catch(error){
        console.error("ошибка у бд", error)
        process.exit(1)
    }
}
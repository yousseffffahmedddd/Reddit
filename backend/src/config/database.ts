import mongoose from 'mongoose';

export const connectDatabase= async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("databse is connected")
    }
    catch(error){
        console.error("databse connection error:", error);
        process.exit(1);
    }
}
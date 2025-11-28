import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDatabase = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("❌ MONGO_URI is missing in .env");
        process.exit(1); // Stop the server immediately
    }

    try {
        await mongoose.connect(uri);
        console.log("✅ Connected to MongoDB Atlas Successfully");
    } catch (error: any) {
        console.error("❌ Failed to connect to MongoDB Atlas");
        console.error("Error:", error.message);
        process.exit(1); // Stop the server if connection fails
    }
};

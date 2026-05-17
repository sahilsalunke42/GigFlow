import mongoose from "mongoose";
import dnsLookup from "./dns";

const connectDB = async () => {
    try {
        dnsLookup;
        await mongoose.connect(process.env.MONGODB_URI as string, {
            dbName: 'gigflow',
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectDB;
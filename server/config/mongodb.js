import mongoose from "mongoose";

// Function to connect application with MongoDB database
const connectDB = async () => {

    // Event listener triggered when MongoDB connection is successful
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    })

    // Connect to MongoDB database using connection URI
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)
}

// Export database connection function
export default connectDB;
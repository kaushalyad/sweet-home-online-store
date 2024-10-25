import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Set up Mongoose event listeners
        mongoose.connection.on('connected', () => {
            console.log("MongoDB connected successfully.");
        });

        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
            process.exit(1); // Exit process if MongoDB connection fails
        });

        mongoose.connection.on('disconnected', () => {
            console.log("MongoDB connection disconnected.");
        });

        // Connect to MongoDB with TLS configuration options
        await mongoose.connect(`${process.env.MONGODB_URI}/sweet-home-database`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            tls: true,
            tlsAllowInvalidCertificates: true, // Allow if necessary for compatibility
        });

    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1); // Exit the process with failure code if connection fails
    }
};

export default connectDB;

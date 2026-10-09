const mongoose = require("mongoose");

/**
 * Establishes connection to MongoDB database using Mongoose
 */
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        const con = await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`[Database] MongoDB Connected: ${con.connection.host}:${con.connection.port}/${con.connection.name}`);
    } catch (error) {
        console.error(`[Database Error] Connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
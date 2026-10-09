const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database using the environment variable `MONGO_DB_DATABASE`.
 * 
 * @async
 * @function
 * @returns {Promise<void>} - Resolves when the connection is established successfully, or rejects with an error.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_DATABASE);
        console.log('🚀 Database  🚀connected🚀 successfully 🚀');
    } catch (error) {
        console.error('❌ Database ❌connection❌ failed: ❌', error);
        process.exit(1); // Stop the server if DB connection fails
    }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected successfully.");
    } catch (err) {
        console.error("DB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectToDatabase;

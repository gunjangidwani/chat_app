const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopoLogy: true
    });
    console.log(`Mongo Connected ${conn.connection.host} `);
    
  } catch (error) {
      console.log(`Error Connecting, ${error.message}`);
  }
}

module.exports = connectDB;
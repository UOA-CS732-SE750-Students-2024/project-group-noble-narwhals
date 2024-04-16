import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


// connect to MongoDB
async function connect() {
  try {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('Connected to MongoDB Atlas successfully'))
    .catch(err => console.error('Failed to connect to MongoDB Atlas:', err));
      console.log('Connected to MongoDB Atlas successfully');
  } catch (err) {
      console.error('Failed to connect to MongoDB Atlas:', err);
  }
}
connect().catch(console.error);


  

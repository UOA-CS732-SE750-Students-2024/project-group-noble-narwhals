import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
import User from './userSchema.js';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');
    
    const newUser = new User({
      _id: number,  
      name: "xinran wang",
      email: "xinranwang@example.com",
      password: "password",
      gender: "Non-binary",
      profileTag: ["gaming", "fishing"],
      avatar: "http://example.com/avatar.jpg",
      myGroup: ["group1", " group2"],
      likedGroup: ["group3", " group4"],
      applyInProgress: ["group5", "group6"],
    });

     

    newUser.save()
    .then(() => {
      console.log('Test user created successfully');
      
    })
    .catch(err => {
      console.error('Failed to create test user:', err);
      
    });

})
.catch(err => {
  console.error('Failed to connect to MongoDB Atlas:', err);
});

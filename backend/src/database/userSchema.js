import mongoose from 'mongoose';

// define User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  gender: String,
  tag:[String],
  avatar: String,
  myGroup: [String],
  likedGroup: [String],
  applyInProgress: [String],
  
});

// create user model
const User = mongoose.model('User', userSchema);


export default User;

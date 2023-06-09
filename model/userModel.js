const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please tell us your name!'],
    unique:true
  },
   password: {
    type: String,
    required: [true, 'Please provide yourpassword'],
  
  },
})
const User = mongoose.model('User', userSchema);
module.exports = User;

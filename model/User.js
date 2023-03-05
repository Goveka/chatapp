const mongoose = require('mongoose'); 

const userSchema= new mongoose.Schema({
 username: String,
 password: String,
 profilePic: String,
 hobbies: String,
 selfDescription: String,
 securityQuestion: String
})


module.exports= mongoose.model('User', userSchema)

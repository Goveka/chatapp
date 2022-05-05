const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
  messages:{
    type: String
  },
 client:{
   type: String
 }
})


module.exports= mongoose.model('Messages', userSchema)

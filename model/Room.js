const { default: mongoose } = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomId: {type: String},
    users: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}],
    messages: [{
        senderId: String,
        message:  String,
        timestamp: {type: Date, default:Date.now},
    }],
});

module.exports= mongoose.model('Room', roomSchema)
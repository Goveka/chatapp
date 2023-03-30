const { default: mongoose } = require("mongoose");

const liveChatSchema = new mongoose.Schema({
        senderId: String,
        message:  String,
        timestamp: String,
        imgUrl: String,
});

module.exports= mongoose.model('LiveChat', liveChatSchema)
const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  roomId: String,
  senderId: String,
  message: String,
  mediaUrl: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const nodemailer = require("nodemailer");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs").promises;
require("dotenv").config();
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const { v4: uuidv4 } = require("uuid");

// Routes
const login = require("./handlers/login");
const signUp = require("./handlers/signUp");
const developerRoute = require("./modules/developers/dev.routes");
const clientRoute = require("./modules/client/client.routes");
const jobsRoute = require("./modules/jobs/job.routes");
const questionsRoute = require("./modules/question/questions.routes");
const uploadMiddleware = require("./middleware/upload");
const forgotPassword = require("./handlers/forgotPass");
const auth = require("./middleware/auth");
const user = require("./handlers/user");
const getUserByID = require("./handlers/getUserById");
const settings = require("./handlers/settings");
// Models
require("./models/userModel");
require("./models/jobModel");
require("./models/applicationModel");
require("./models/reviewModel");
require("./models/msgModel");
require("./models/questionModel");

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  },
});

// Middleware
app.use(cors("*"));
app.use(express.json());
app.use(
  "/images",
  express.static(path.join(__dirname, "public/profile-pictures"))
);
app.use("/resumes", express.static(path.join(__dirname, "public/resumes")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
// Database Connection
mongoose
  .connect(process.env.mongo_connect, {})
  .then(() => console.log("mongo connected"))
  .catch((e) => console.log(e));

//VideoCall client using Twilio
const twilioClient = require("twilio")(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);
const findOrCreateRoom = async (roomName) => {
  try {
    // see if the room exists already. If it doesn't, this will throw
    // error 20404.
    await twilioClient.video.v1.rooms(roomName).fetch();
  } catch (error) {
    // the room was not found, so create it
    if (error.code == 20404) {
      await twilioClient.video.v1.rooms.create({
        uniqueName: roomName,
        type: "group",
      });
    } else {
      // let other errors bubble up
      throw error;
    }
  }
};
const getAccessToken = (roomName) => {
  // create an access token
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    // generate a random unique identity for this participant
    { identity: uuidv4() }
  );
  // create a video grant for this specific room
  const videoGrant = new VideoGrant({
    room: roomName,
  });

  // add the video grant
  token.addGrant(videoGrant);
  // serialize the token and return it
  return token.toJwt();
};

// Routes
app.post("/login", login);
app.post("/signUp/:role", uploadMiddleware, signUp);
app.post("/settings", uploadMiddleware, settings);
app.post("/forgot-password", forgotPassword.forgotPassword);
app.post("/reset-password/:token", forgotPassword.resetPassword);
app.use("/developer", developerRoute);
app.use("/client", clientRoute);
app.use("/jobs", jobsRoute);
app.use("/questions", questionsRoute);
app.get("/getUser/:id", getUserByID);
app.post("/join-room", async (req, res) => {
  // return 400 if the request has an empty body or no roomName
  if (!req.body || !req.body.roomName) {
    return res.status(400).send("Must include roomName argument.");
  }
  const roomName = req.body.roomName;
  // find or create a room with the given roomName
  findOrCreateRoom(roomName);
  // generate an Access Token for a participant in this room
  const token = getAccessToken(roomName);
  console.log(token);
  res.send({
    token: token,
  });
});
app.use(auth);
app.get("/user", user);

// WebSocket Logic
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Handle room creation or joining
  socket.on("start_chat", async (data) => {
    const { userId1, userId2 } = data;
    const MessageModel = mongoose.model("Message");
    const UserModel = mongoose.model("User");
    const updateUser1 = await UserModel.findByIdAndUpdate(
      userId1,
      {
        $addToSet: { chats: userId2 },
      },
      { new: true }
    );

    const updateUser2 = await UserModel.findByIdAndUpdate(
      userId2,
      {
        $addToSet: { chats: userId1 },
      },
      { new: true }
    );
    // Generate a unique room ID based on user IDs
    const roomId = [userId1, userId2].sort().join("_"); // Ensures consistent room ID order
    socket.join(roomId);

    console.log(`User ${socket.id} joined room: ${roomId}`);

    // Notify other users in the room (optional)
    socket.to(roomId).emit("user_joined", { userId: userId1 });
    // Load past messages from database for this room
    try {
      const pastMessages = await MessageModel.find({ roomId }).sort({
        timestamp: 1,
      });
      socket.emit("past_messages", pastMessages);
    } catch (error) {
      console.error("Error fetching past messages:", error);
    }
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    const { roomId, message, senderId } = data;
    const MessageModel = mongoose.model("Message");
    try {
      // Save message to DB
      const newMessage = await MessageModel.create({
        roomId,
        senderId,
        message,
      });

      io.to(roomId).emit("receive_message", {
        senderId,
        message,
        messageId: newMessage._id,
      });
      console.log(`Message saved to db and sent to room ${roomId}: ${message}`);
    } catch (error) {
      console.error("Error saving message to database:", error);
      // consider informing user that the message was not saved.
    }
  });
  socket.on("on_call", async (data) => {
    const { roomId } = data;
    io.to(roomId).emit("recieve_call", {
      roomId,
    });
  });
  // Handle file upload
  socket.on("send_media", async (data) => {
    const { roomId, senderId, fileData, fileType, fileName } = data;
    const MessageModel = mongoose.model("Message");
    try {
      if (!fileData) {
        console.error("File data is missing.");
        return;
      }

      // Generate file path and name
      const filePath = path.join(
        __dirname,
        "public/uploads",
        Date.now() + "-" + fileName
      );

      // Create a buffer from the base64 data
      const buffer = Buffer.from(fileData, "base64");

      // Write the file to the disk
      await fs.writeFile(filePath, buffer);
      console.log("File saved successfully:", filePath);

      // Generate a URL from the file
      const mediaUrl = `/uploads/${path.basename(filePath)}`; // Updated to match the static directory

      // Save message metadata to the DB
      const newMediaMessage = await MessageModel.create({
        roomId,
        senderId,
        mediaUrl,
      });

      // Emit to the room
      io.to(roomId).emit("receive_media", {
        senderId,
        mediaUrl,
        messageId: newMediaMessage._id,
      });
      console.log("Media metadata saved to db.");
    } catch (error) {
      console.error("Error saving media to database:", error);
    }
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
server.listen(8000, () => {
  console.log("Server started on port 8000");
});

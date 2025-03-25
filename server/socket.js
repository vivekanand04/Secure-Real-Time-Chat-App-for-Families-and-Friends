// Import necessary modules
import { Server as SocketIOServer } from "socket.io"; // Importing Socket.IO for real-time communication
import Message from "./model/MessagesModel.js"; // Importing Message model for storing messages in the database
import Channel from "./model/ChannelModel.js"; // Importing Channel model for managing group chats

// Function to set up the WebSocket server
const setupSocket = (server) => {
  // Creating a new WebSocket server using Socket.IO
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN, // Allow connections from a specific frontend origin
      methods: ["GET", "POST"], // Allow GET and POST requests
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    },
  });

  // Map to store active users and their respective socket IDs
  const userSocketMap = new Map();

  // Function to notify users when a new channel is created
  const addChannelNotify = async (channel) => {
    if (channel && channel.members) {
      // Loop through all members of the channel
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member.toString()); // Get the socket ID of each member
        if (memberSocketId) {
          // Send a notification to the member's socket
          io.to(memberSocketId).emit("new-channel-added", channel);
        }
      });
    }
  };

  // Function to handle sending private messages between users
  const sendMessage = async (message) => {
    const recipientSocketId = userSocketMap.get(message.recipient); // Get recipient's socket ID
    const senderSocketId = userSocketMap.get(message.sender); // Get sender's socket ID

    // Save the message to the database
    const createdMessage = await Message.create(message);

    // Retrieve the saved message and populate sender and recipient details
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color")
      .exec();

    // If recipient is online, send the message in real-time
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }

    // Send the message back to the sender for confirmation
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  // Function to send messages in a group channel
  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    // Create and store the message in the database
    const createdMessage = await Message.create({
      sender,
      recipient: null, // No direct recipient for channel messages
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    // Fetch the saved message and populate sender details
    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .exec();

    // Add the message ID to the respective channel in the database
    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    // Retrieve channel details along with its members
    const channel = await Channel.findById(channelId).populate("members");

    // Format message data to include channel ID
    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      // Send the message to all channel members who are online
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("recieve-channel-message", finalData);
        }
      });

      // Notify the channel admin separately if online
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("recieve-channel-message", finalData);
      }
    }
  };

  // Function to handle user disconnection
  const disconnect = (socket) => {
    console.log("Client disconnected", socket.id);

    // Remove the user from the active user map when they disconnect
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  // Handling new WebSocket connections
  io.on("connection", (socket) => {
    // Get the user ID from the connection query parameters
    const userId = socket.handshake.query.userId;

    if (userId) {
      // Store the user's socket ID in the map for real-time communication
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided during connection.");
    }

    // Listen for events from the client
    socket.on("add-channel-notify", addChannelNotify); // Notify users about new channels
    socket.on("sendMessage", sendMessage); // Handle sending private messages
    socket.on("send-channel-message", sendChannelMessage); // Handle sending messages in channels
    socket.on("disconnect", () => disconnect(socket)); // Handle user disconnection
  });
};

export default setupSocket;

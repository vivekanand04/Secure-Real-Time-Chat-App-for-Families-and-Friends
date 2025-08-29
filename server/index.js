import express from "express"; // Importing Express.js framework to create the server.

import dotenv from "dotenv"; // Importing dotenv to manage environment variables.

import cors from "cors"; // Importing CORS middleware to enable Cross-Origin Resource Sharing.

import cookieParser from "cookie-parser"; // Importing cookie-parser to parse cookies in incoming requests.

import mongoose from "mongoose"; // Importing Mongoose to interact with MongoDB.

import authRoutes from "./routes/AuthRoutes.js"; // Importing authentication-related routes.

import contactsRoutes from "./routes/ContactRoutes.js"; // Importing routes for handling user contacts.

import messagesRoutes from "./routes/MessagesRoute.js"; // Importing routes for handling chat messages.

import setupSocket from "./socket.js"; // Importing function to configure WebSocket connections.

import channelRoutes from "./routes/ChannelRoutes.js"; // Importing routes for handling chat channels.

dotenv.config(); // Loading environment variables from a `.env` file.

const app = express(); // Creating an Express application instance.

const port = process.env.PORT||3000; // Retrieving the port number from environment variables.

const databaseURL = process.env.DATABASE_URL; // Retrieving the database connection URL from environment variables.

app.use(
  cors({
    origin: [process.env.ORIGIN], // Allowing requests only from the specified frontend origin.
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowing these HTTP methods.
    credentials: true, // Allowing cookies and authentication headers to be sent with requests.
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
// it is a miidleware that triggered when a request starts with "/uploads/profiles". Serving static profile images stored in the "uploads/profiles" directory.

app.use("/uploads/files", express.static("uploads/files"));
// Serving static uploaded files stored in the "uploads/files" directory.

app.use(cookieParser()); // Using cookie-parser middleware to handle cookies in requests.

app.use(express.json()); // Enabling Express to parse JSON data in request bodies.

app.use("/api/auth", authRoutes); // Setting up authentication-related API routes under `/api/auth`.

app.use("/api/contacts", contactsRoutes); // Setting up contact-related API routes under `/api/contacts`.

app.use("/api/messages", messagesRoutes); // Setting up message-related API routes under `/api/messages`.

app.use("/api/channel", channelRoutes); // Setting up chat channel-related API routes under `/api/channel`.

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
// Starting the Express server on the specified port and logging the running URL.

setupSocket(server);
// Initializing WebSocket server by passing the Express server instance.

mongoose
  .connect(databaseURL) // Connecting to MongoDB using the provided database URL.
  .then(() => {
    console.log("DB Connection Successful"); // Logging success message if the connection is successful.
  })
  .catch((err) => {
    console.log(err.message); // Logging an error message if the connection fails.
  });

// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import mongoose from "mongoose";
// import authRoutes from "./routes/AuthRoutes.js";
// import contactsRoutes from "./routes/ContactRoutes.js";
// import messagesRoutes from "./routes/MessagesRoute.js";
// import setupSocket from "./socket.js";
// import channelRoutes from "./routes/ChannelRoutes.js";

// dotenv.config();

// const app = express();
// const port = process.env.PORT;
// const databaseURL = process.env.DATABASE_URL;

// app.use(
//   cors({
//     origin: [process.env.ORIGIN],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true,
//   })
// );

// app.use("/uploads/profiles", express.static("uploads/profiles"));
// app.use("/uploads/files", express.static("uploads/files"));

// app.use(cookieParser());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/contacts", contactsRoutes);
// app.use("/api/messages", messagesRoutes);
// app.use("/api/channel", channelRoutes);

// const server = app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

// setupSocket(server);

// mongoose
//   .connect(databaseURL)
//   .then(() => {
//     console.log("DB Connetion Successfull");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

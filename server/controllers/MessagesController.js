import Message from "../model/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId; // Extracts the logged-in user's ID from the request
    const user2 = req.body.id; // Extracts the recipient's ID from the request body

    if (!user1 || !user2) {
      // Checks if both user IDs are present
      return res.status(400).send("Both user IDs are required."); // Returns a 400 Bad Request error if missing
    }

    const messages = await Message.find({
      // Queries the database for messages between user1 and user2
      $or: [
        // Uses the $or operator to find messages where either user is the sender or recipient
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 }); // Sorts messages in ascending order based on the timestamp (oldest first)

    return res.status(200).json({ messages }); // Sends the retrieved messages as a JSON response with status 200 (OK)
  } catch (err) {
    console.log(err); // Logs any errors that occur during execution
    return res.status(500).send("Internal Server Error"); // Returns a 500 Internal Server Error response in case of failure
  }
};


export const uploadFile = async (request, response, next) => {
  try {
    if (request.file) {
      // Check if a file is uploaded
      console.log("in try if"); // Log message for debugging
      const date = Date.now(); // Get current timestamp
      let fileDir = `uploads/files/${date}`; // Define directory path with timestamp
      let fileName = `${fileDir}/${request.file.originalname}`; // Define full file path

      mkdirSync(fileDir, { recursive: true }); // Create directory if it doesn't exist
      renameSync(request.file.path, fileName); // Move uploaded file to new location

      return response.status(200).json({ filePath: fileName }); // Respond with file path
    } else {
      return response.status(404).send("File is required."); // Handle missing file case
    }
  } catch (error) {
    console.log({ error }); // Log error for debugging
    return response.status(500).send("Internal Server Error."); // Handle server errors
  }
};

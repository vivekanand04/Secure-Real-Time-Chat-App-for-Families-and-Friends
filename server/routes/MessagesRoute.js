import { Router } from "express";
import { getMessages, uploadFile,deleteMessage } from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";


const messagesRoutes = Router();
const upload = multer({ dest: "uploads/files/" });
messagesRoutes.post("/get-messages", verifyToken, getMessages);
messagesRoutes.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile
);
messagesRoutes.delete("/delete/:messageId", verifyToken,(req,res,next)=>{
  console.log("hit the delete route");
  next();
  
} ,deleteMessage);

export default messagesRoutes;

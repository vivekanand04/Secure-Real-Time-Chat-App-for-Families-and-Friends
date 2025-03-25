import { Router } from "express"; // Importing Router from Express to create route handlers.

import {
  getUserInfo, // Function to retrieve user details.
  login, // Function to handle user login.
  signup, // Function to handle user registration.
  logout, // Function to log out the user and invalidate the session.
  updateProfile, // Function to update user profile details.
  addProfileImage, // Function to handle profile image upload.
  removeProfileImage, // Function to delete a user's profile image.
} from "../controllers/AuthController.js"; // Importing authentication-related controller functions.

import { verifyToken } from "../middlewares/AuthMiddleware.js"; // Importing middleware to verify user authentication using tokens.

import multer from "multer"; // Importing Multer, a middleware for handling multipart/form-data (file uploads).

const authRoutes = Router(); // Creating an instance of Express Router to define authentication routes.

const upload = multer({ dest: "uploads/profiles/" }); // Configuring Multer to store uploaded profile images in "uploads/profiles/" directory.

authRoutes.post("/signup", signup); // Defining a POST route for user signup, calling the signup function.

authRoutes.post("/login", login); // Defining a POST route for user login, calling the login function.

authRoutes.post("/logout", logout); // Defining a POST route for user logout, calling the logout function.

authRoutes.get("/userinfo", verifyToken, getUserInfo);
// Defining a GET route to fetch user details, using verifyToken middleware to ensure only authenticated users can access it.

authRoutes.post("/update-profile", verifyToken, updateProfile);
// Defining a POST route to update user profile information, ensuring authentication using verifyToken middleware.
  
authRoutes.post(
  "/add-profile-image", // Defining a POST route to upload a profile image.
  verifyToken, // Ensures only authenticated users can upload images.
  upload.single("profile-image"), // Multer middleware processes the uploaded file under "profile-image" key.
  addProfileImage // Calls the function to store the uploaded image.
);

authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
// Defining a DELETE route to remove a user's profile image, ensuring authentication using verifyToken middleware.

export default authRoutes; // Exporting the authRoutes object so it can be used in the main server file.

// import { Router } from "express";
// import {
//   getUserInfo,
//   login,
//   signup,
//   logout,
//   updateProfile,
//   addProfileImage,
//   removeProfileImage,
// } from "../controllers/AuthController.js";
// import { verifyToken } from "../middlewares/AuthMiddleware.js";
// import multer from "multer";

// const authRoutes = Router();
// const upload = multer({ dest: "uploads/profiles/" });

// authRoutes.post("/signup", signup);
// authRoutes.post("/login", login);
// authRoutes.post("/logout", logout);
// authRoutes.get("/userinfo", verifyToken, getUserInfo);
// authRoutes.post("/update-profile", verifyToken, updateProfile);
// authRoutes.post(
//   "/add-profile-image",
//   verifyToken,
//   upload.single("profile-image"),
//   addProfileImage
// );
// authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);

// export default authRoutes;

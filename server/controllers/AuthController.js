import jwt from "jsonwebtoken"; // Importing JSON Web Token (JWT) for authentication
import User from "../model/UserModel.js"; // Importing the User model from the database schema
import { compare } from "bcrypt"; // Importing bcrypt for password hashing and comparison
import { renameSync, unlinkSync } from "fs"; // Importing file system functions for file manipulation (not used in this function)

// Setting the maximum age for the JWT token (3 days)
const maxAge = 3 * 24 * 60 * 60 * 1000;


const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge, // Token expires in 3 days
  });
};


export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body; // Extract email and password from request body

    if (email && password) {
      // Check if both email and password are provided
      // Create a new user in the database (password is hashed in UserModel before saving)
      const user = await User.create({ email, password });

      // Create and set a JWT token in the user's browser cookies
      res.cookie("jwt", createToken(email, user.id), {
        maxAge, // Cookie expiration time (3 days)
        secure: true, // Ensures cookie is sent only over HTTPS
        sameSite: "None", // Allows cross-site requests with credentials
      });

      // Return the user details in response (excluding password for security)
      return res.status(201).json({
        user: {
          id: user?.id,
          email: user?.email,
          firstName: user.firstName, // First name of the user (if provided)
          lastName: user.lastName, // Last name of the user (if provided)
          image: user.image, // Profile image of the user (if provided)
          profileSetup: user.profileSetup, // Boolean flag indicating profile completion
        },
      });
    } else {
      // If email or password is missing, return a 400 (Bad Request) error
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    console.log(err); // Log any server errors
    return res.status(500).send("Internal Server Error"); // Return a 500 (Internal Server Error) response
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send("User not found");
      }
      const auth = await compare(password, user.password);
      if (!auth) {
        return res.status(400).send("Invalid Password");
      }
      res.cookie("jwt", createToken(email, user.id), {
        maxAge,
        secure: true,
        sameSite: "None",
      });
      return res.status(200).json({
        user: {
          id: user?.id,
          email: user?.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          profileSetup: user.profileSetup,
        },
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (request, response, next) => {
  try {
    if (request.userId) {
      const userData = await User.findById(request.userId);
      if (userData) {
        return response.status(200).json({
          id: userData?.id,
          email: userData?.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          image: userData.image,
          profileSetup: userData.profileSetup,
          color: userData.color,
        });
      } else {
        return response.status(404).send("User with the given id not found.");
      }
    } else {
      return response.status(404).send("User id not found.");
    }
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const logout = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return response.status(200).send("Logout successful");
  } catch (err) {
    return response.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (request, response, next) => {
  try {
    const { userId } = request; 

    const { firstName, lastName, color } = request.body;

    if (!userId) {
      return response.status(400).send("User ID is required.");
    }

    if (!firstName || !lastName) {
      return response.status(400).send("Firstname and Last name is required.");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      profileSetup: userData.profileSetup,
      color: userData.color,
    });
  } catch (error) {
    return response.status(500).send("Internal Server Error.");
  }
};

export const addProfileImage = async (request, response, next) => {
  try {
    if (request.file) {
      const date = Date.now();
      let fileName = "uploads/profiles/" + date + request.file.originalname;
      renameSync(request.file.path, fileName);
      const updatedUser = await User.findByIdAndUpdate(
        request.userId,
        { image: fileName },
        {
          new: true,
          runValidators: true,
        }
      );
      return response.status(200).json({ image: updatedUser.image });
    } else {
      return response.status(404).send("File is required.");
    }
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error.");
  }
};

export const removeProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;

    if (!userId) {
      return response.status(400).send("User ID is required.");
    }

    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).send("User not found.");
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return response
      .status(200)
      .json({ message: "Profile image removed successfully." });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error.");
  }
};

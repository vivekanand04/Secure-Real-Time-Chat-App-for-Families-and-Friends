// Importing mongoose for database modeling
import mongoose from "mongoose";

// Importing bcrypt for password hashing
import bcrypt from "bcrypt";

// Defining a Mongoose schema for the user model
const userSchema = new mongoose.Schema({
  email: {
    type: String, // Email is stored as a string
    required: [true, "Email is Required"], // Email field is required
    unique: true, // Ensures no duplicate emails exist
  },
  password: {
    type: String, // Password is stored as a string
    required: [true, "Password is Required"], // Password field is required
  },
  firstName: {
    type: String, // First name is stored as a string
    required: false, // Not required
  },
  lastName: {
    type: String, // Last name is stored as a string
    required: false, // Not required
  },
  image: {
    type: String, // Image URL is stored as a string
    required: false, // Not required
  },
  profileSetup: {
    type: Boolean, // Boolean value to check if profile is set up
    default: false, // Defaults to false
  },
  color: {
    type: Number, // Stores a numerical value for color
    required: false, // Not required
  },
});

// Pre-save middleware that runs before saving a user data to mongoDB databse
userSchema.pre("save", async function (next) {
  // Generates a salt for hashing
  const salt = await bcrypt.genSalt();
  // Hashes the password before saving it to the database using bcrypt
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Calls the next middleware function
});

// Static method for user login
userSchema.statics.login = async function (email, password) {
  // Finds a user by email
  const user = await this.findOne({ email });

  // If user exists, compare the provided password with the hashed password
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user; // Returns the user if authentication is successful
    }
    throw Error("incorrect password"); // Throws error if password is incorrect
  }
  throw Error("incorrect email"); // Throws error if email is not found
};

// Creating a Mongoose model named 'Users' based on the userSchema
const User = mongoose.model("Users", userSchema);

// Exporting the User model to be used in other parts of the application
export default User;

// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: [true, "Email is Required"],
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: [true, "Password is Required"],
//   },
//   firstName: {
//     type: String,
//     required: false,
//   },
//   lastName: {
//     type: String,
//     required: false,
//   },
//   image: {
//     type: String,
//     required: false,
//   },
//   profileSetup: {
//     type: Boolean,
//     default: false,
//   },
//   color: {
//     type: Number,
//     required: false,
//   },
// });

// userSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.statics.login = async function (email, password) {
//   const user = await this.findOne({ email });
//   if (user) {
//     const auth = await bcrypt.compare(password, user.password);
//     if (auth) {
//       return user;
//     }
//     throw Error("incorrect password");
//   }
//   throw Error("incorrect email");
// };

// const User = mongoose.model("Users", userSchema);
// export default User;

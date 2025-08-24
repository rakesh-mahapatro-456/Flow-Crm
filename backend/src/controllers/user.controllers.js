import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); 


const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const cookieOptions = {
  httpOnly: true, //xss safe 
  secure: process.env.NODE_ENV === "production", // only HTTPS in production
  sameSite: "strict", // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000 //7d
};

export const signup = async (req, res) => {
  const { name,username,email,password } = req.body;

  // Validation
  if ( !name||!email || !password || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);//salt with 10 and then hash 

  // Create new user
  const newUser = new User({
    name,
    username,
    email,
    passwordHash: hashedPassword,
  });

  // Save to DB
  await newUser.save();

  // Generate JWT
  const token = createToken(newUser._id);

  //send cookie - keep jwt inside it 
  res.cookie("token", token, cookieOptions);

  return res.status(201).json({
    message: "User registered successfully",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = createToken(user._id);

  //send cookie - keep jwt inside it 
  res.cookie("token", token, cookieOptions);

  // Return response
  return res.status(200).json({
    message: "Login successful",
  });
};

export const getUser = async(req,res)=>{
  res.status(200).json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
}

export const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "Logged out successfully" });
};
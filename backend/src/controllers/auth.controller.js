

import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Tenant from "../models/tenant.model.js"; 
import cloudinary from "../lib/cloudinary.js";
import { signJwt, setTokenCookie } from "../lib/utils.js"; 


const generateTokenAndSetCookie = (user, res) => {
  const payload = {
    userId: user._id,
    customerId: user.customerId,
    role: user.role,
  };

  
  const token = signJwt(payload);

  
  setTokenCookie(res, token);
};


export const signup = async (req, res) => {
  try {
    const { fullName, email, password, customerId, role } = req.body;

    if (!fullName || !email || !password || !customerId) {
      return res
        .status(400)
        .json({ message: "fullName, email, password, and customerId are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    
    const tenant = await Tenant.findById(customerId);
    if (!tenant) {
      return res.status(400).json({ message: "Invalid tenant (customerId)." });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      customerId,
      role: role || "User",
    });

    await newUser.save();

    
    generateTokenAndSetCookie(newUser, res);

    
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      customerId: newUser.customerId,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    
    generateTokenAndSetCookie(user, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      customerId: user.customerId,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const logout = (req, res) => {
  try {
    
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required." });
    }

    
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("CheckAuth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

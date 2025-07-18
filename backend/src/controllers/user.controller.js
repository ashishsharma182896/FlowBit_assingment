import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};


export const listUsers = async (req, res) => {
  try {
    const users = await User.find({ customerId: req.user.customerId }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, customerId: req.user.customerId }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found in your tenant" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email, and password are required" });
    }

    const existingUser = await User.findOne({ email, customerId: req.user.customerId });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists in your tenant" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      customerId: req.user.customerId,
      role: role || "User", 
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      customerId: newUser.customerId,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, email, password, role } = req.body;

    
    const user = await User.findOne({ _id: userId, customerId: req.user.customerId });
    if (!user) {
      return res.status(404).json({ message: "User not found in your tenant" });
    }

    
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (role) user.role = role;

    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      customerId: user.customerId,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own user account" });
    }

    
    const user = await User.findOneAndDelete({ _id: userId, customerId: req.user.customerId });

    if (!user) {
      return res.status(404).json({ message: "User not found in your tenant" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

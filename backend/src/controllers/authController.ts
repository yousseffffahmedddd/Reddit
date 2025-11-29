import { Request, Response } from "express";
import User from "../models/User.js";
import { hashPassword, verifyPassword } from "../utils/Password.js";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        error:
          existingUser.email === email
            ? "User already exists with this email"
            : "Username is already taken",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    });

    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "Account created successfully for SignupLogin-Page",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("SignupLogin-Page signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    });

    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      message: "Login successful to SignupLogin-Page",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.error("SignupLogin-Page login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

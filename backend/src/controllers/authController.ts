import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserSchema";
import { OAuth2Client } from "google-auth-library";

// Secret key for signing tokens
const JWT_SECRET = (process.env.JWT_SECRET) as string;

// Google OAuth client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// 1. SIGN UP
export const signup = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already used" });
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            passwordHash: hashedPassword,
        });

        await newUser.save();

        // Create Token
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

// 2. LOG IN
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        // Create Token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};
export const logout = async (req: Request, res: Response) => {
    try {

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error logging out" });
    }
};

// 3. GOOGLE OAUTH
export const googleAuth = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        console.log('Google OAuth request received with token:', token ? 'present' : 'missing');
        console.log('Google Client ID:', GOOGLE_CLIENT_ID);

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log('Google token payload:', payload);
        
        if (!payload) {
            return res.status(400).json({ message: "Invalid Google token" });
        }

        const { sub: googleId, email, name, picture } = payload;
        console.log('Extracted payload data:', { googleId, email, name, picture });

        // Check if user already exists
        let user = await User.findOne({ email });
        
        if (user) {
            // Update Google ID if not present
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                username: name || email?.split('@')[0] || `user_${googleId.slice(-6)}`,
                email,
                googleId,
                avatarUrl: picture,
            });
            console.log('Creating new Google OAuth user:', {
                username: user.username,
                email: user.email,
                googleId: user.googleId
            });
            try {
                await user.save();
                console.log('User saved successfully with ID:', user._id);
            } catch (validationError) {
                console.error('User save validation error:', validationError);
                return res.status(400).json({ 
                    message: "Error creating user", 
                    error: validationError 
                });
            }
        }

        // Create JWT token
        const jwtToken = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            message: "Google authentication successful",
            token: jwtToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatarUrl: user.avatarUrl,
            }
        });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({ message: "Error with Google authentication", error });
    }
};

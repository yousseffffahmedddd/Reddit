import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads/profiles");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Ensure posts uploads directory exists
const postsUploadDir = path.join(__dirname, "../../uploads/posts");
if (!fs.existsSync(postsUploadDir)) {
    fs.mkdirSync(postsUploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename: userId-timestamp.extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `profile-${uniqueSuffix}${ext}`);
    },
});

// File filter - only allow images
const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
    }
};

// Create multer instance
export const uploadProfilePicture = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
});

// Configure storage for posts
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, postsUploadDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename: post-timestamp.extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `post-${uniqueSuffix}${ext}`);
    },
});

// Create multer instance for posts
export const uploadPostImage = multer({
    storage: postStorage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size for posts
    },
});

export default uploadProfilePicture;


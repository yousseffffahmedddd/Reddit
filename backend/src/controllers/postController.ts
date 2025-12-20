import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Post from "../models/PostSchema.ts";
import User from "../models/UserSchema.ts";
import Community from "../models/CommunitySchema.ts";
import Comment from "../models/CommentSchema.ts";

// Get the project root directory
const PROJECT_ROOT = path.resolve(process.cwd());

type Request = express.Request;
type Response = express.Response;

// Helper function to convert image file to base64 data URL
const getImageAsDataUrl = (imagePath: string): string | null => {
    try {
        console.log('Checking if file exists:', imagePath);
        if (!fs.existsSync(imagePath)) {
            console.log('File does not exist:', imagePath);
            return null;
        }
        
        console.log('Reading file:', imagePath);
        const imageBuffer = fs.readFileSync(imagePath);
        const mimeType = path.extname(imagePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
        console.log('File size:', imageBuffer.length, 'bytes, MIME type:', mimeType);
        const base64 = imageBuffer.toString('base64');
        const dataUrl = `data:${mimeType};base64,${base64}`;
        console.log('Data URL length:', dataUrl.length);
        return dataUrl;
    } catch (error) {
        console.error('Error converting image to data URL:', error);
        return null;
    }
};

// --- 1. CREATE POST (Existing) ---
export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, postType, imageUrl, linkUrl, author, community } = req.body;

        if (!title || !author || !community) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // For image and link posts, content is optional
        const postContent = content || (postType === 'image' ? imageUrl : linkUrl) || '';

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(author)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }
        if (!mongoose.Types.ObjectId.isValid(community)) {
            return res.status(400).json({ message: "Invalid community ID" });
        }

        const newPost = await Post.create({
            title,
            content: postContent,
            postType: postType || 'text',
            imageUrl: postType === 'image' ? imageUrl : undefined,
            linkUrl: postType === 'link' ? linkUrl : undefined,
            author: mongoose.Types.ObjectId.isValid(author) ? new mongoose.Types.ObjectId(author) : author,
            community: mongoose.Types.ObjectId.isValid(community) ? new mongoose.Types.ObjectId(community) : community,
            votes: [] // Ensure your Schema initializes this!
        });

        // Manually populate the created post
        const authorDoc = await User.findById(newPost.author).select('username').lean();
        const communityDoc = await Community.findById(newPost.community).select('name').lean();

        let populatedPost = {
            ...newPost.toObject(),
            author: authorDoc ? { _id: authorDoc._id, username: authorDoc.username } : { _id: newPost.author, username: 'Unknown' },
            community: communityDoc ? { _id: communityDoc._id, name: communityDoc.name } : { _id: newPost.community, name: 'Unknown' },
        };

        // Convert image URL to data URL to hide the file path
        if (populatedPost.imageUrl && (populatedPost.imageUrl.includes('/uploads/posts/') || populatedPost.imageUrl.startsWith('/uploads/posts/'))) {
            // Extract the relative path from the URL
            let relativePath = populatedPost.imageUrl;
            if (relativePath.startsWith('http')) {
                // Extract path from full URL
                const url = new URL(relativePath);
                relativePath = url.pathname;
            }
            
            const imagePath = path.join(PROJECT_ROOT, 'uploads', relativePath);
            const dataUrl = getImageAsDataUrl(imagePath);
            if (dataUrl) {
                populatedPost.imageUrl = dataUrl;
            }
        }

        res.status(201).json(populatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 2. GET ALL POSTS (Missing) ---
export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query; // Optional: current user ID to check their votes

        // Get posts without populate first
        const posts = await Post.find().sort({ createdAt: -1 }).lean();

        // Manually populate author, community, and get comment counts
        const populatedPosts = await Promise.all(
            posts.map(async (post: any) => {
                try {
                    const author = await User.findById(post.author).select('username').lean();
                    const community = await Community.findById(post.community).select('name').lean();
                    const commentCount = await Comment.countDocuments({ postId: post._id });

                    let processedPost = {
                        ...post,
                        author: author ? { _id: author._id, username: author.username } : { _id: post.author, username: 'Unknown' },
                        community: community ? { _id: community._id, name: community.name } : { _id: post.community, name: 'Unknown' },
                        commentCount,
                    };

                    // Convert image URL to data URL to hide the file path
                    if (processedPost.imageUrl && (processedPost.imageUrl.includes('/uploads/posts/') || processedPost.imageUrl.startsWith('/uploads/posts/'))) {
                        // Extract the relative path from the URL
                        let relativePath = processedPost.imageUrl;
                        if (relativePath.startsWith('http')) {
                            // Extract path from full URL
                            const url = new URL(relativePath);
                            relativePath = url.pathname;
                        }
                        
                        const imagePath = path.join(PROJECT_ROOT, 'uploads', relativePath);
                        const dataUrl = getImageAsDataUrl(imagePath);
                        if (dataUrl) {
                            processedPost.imageUrl = dataUrl;
                            console.log('Image URL converted to data URL');
                        } else {
                            console.log('Failed to convert image to data URL');
                        }
                    }

                    return processedPost;
                } catch (error) {
                    console.error('Error populating post:', post._id, error);
                    return {
                        ...post,
                        author: { _id: post.author, username: 'Unknown' },
                        community: { _id: post.community, name: 'Unknown' },
                    };
                }
            })
        );

        // Calculate score for each post before sending to frontend
        const postsWithScores = populatedPosts.map((post: any) => {
            // Calculate sum of votes
            const score = post.votes ? post.votes.reduce((acc: number, vote: any) => acc + vote.value, 0) : 0;
            // Count upvotes and downvotes
            const upvotes = post.votes ? post.votes.filter((v: any) => v.value === 1).length : 0;
            const downvotes = post.votes ? post.votes.filter((v: any) => v.value === -1).length : 0;

            // Check if current user voted
            let userVote = 0;
            if (userId && post.votes) {
                const userVoteObj = post.votes.find((v: any) => v.userId.toString() === userId);
                if (userVoteObj) {
                    userVote = userVoteObj.value;
                }
            }

            return {
                ...post,
                score,
                upvotes,
                downvotes,
                userVote,
                commentCount: post.commentCount || 0
            };
        });

        res.status(200).json(postsWithScores);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 3. VOTE ON POST (Missing) ---
export const votePost = async (req: Request, res: Response) => {
    try {
        const { postId, userId, value } = req.body;

        // Find post
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Check if user already voted
        const existingVoteIndex = post.votes.findIndex((v: any) => v.userId.toString() === userId);

        if (existingVoteIndex !== -1) {
            // User already voted
            const existingVote = post.votes[existingVoteIndex];

            if (existingVote.value === value) {
                // Toggling off (removing vote)
                post.votes.splice(existingVoteIndex, 1);
            } else {
                // Changing vote (e.g., up to down)
                post.votes[existingVoteIndex].value = value;
            }
        } else {
            // New vote
            post.votes.push({ userId: new mongoose.Types.ObjectId(userId), value });
        }

        await post.save();

        // Return the new score
        const newScore = post.votes.reduce((acc: number, v: any) => acc + v.value, 0);

        res.status(200).json({ success: true, score: newScore });

    } catch (err) {
        console.error("Vote Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 4. GET POST BY ID ---
export const getPostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const post = await Post.findById(postId).lean();
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Manually populate author and community
        const author = await User.findById(post.author).select('username').lean();
        const community = await Community.findById(post.community).select('name').lean();

        let populatedPost = {
            ...post,
            author: author ? { _id: author._id, username: author.username } : { _id: post.author, username: 'Unknown' },
            community: community ? { _id: community._id, name: community.name } : { _id: post.community, name: 'Unknown' },
        };

        // Convert image URL to data URL to hide the file path
        if (populatedPost.imageUrl && (populatedPost.imageUrl.includes('/uploads/posts/') || populatedPost.imageUrl.startsWith('/uploads/posts/'))) {
            // Extract the relative path from the URL
            let relativePath = populatedPost.imageUrl;
            if (relativePath.startsWith('http')) {
                // Extract path from full URL
                const url = new URL(relativePath);
                relativePath = url.pathname;
            }
            
            const imagePath = path.join(PROJECT_ROOT, 'uploads', relativePath);
            const dataUrl = getImageAsDataUrl(imagePath);
            if (dataUrl) {
                populatedPost.imageUrl = dataUrl;
            }
        }

        res.status(200).json(populatedPost);
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 5. UPDATE POST ---
export const updatePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const { title, content, postType, imageUrl, linkUrl, author, community } = req.body;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if author is provided and valid
        if (author && !mongoose.Types.ObjectId.isValid(author)) {
            return res.status(400).json({ message: "Invalid author ID" });
        }

        // Check if community is provided and valid
        if (community && !mongoose.Types.ObjectId.isValid(community)) {
            return res.status(400).json({ message: "Invalid community ID" });
        }

        // Update fields
        if (title) post.title = title;
        if (content) post.content = content;
        if (postType) post.postType = postType;
        if (imageUrl) post.imageUrl = imageUrl;
        if (linkUrl) post.linkUrl = linkUrl;
        if (author && mongoose.Types.ObjectId.isValid(author)) {
            post.author = new mongoose.Types.ObjectId(author);
        }
        if (community && mongoose.Types.ObjectId.isValid(community)) {
            post.community = new mongoose.Types.ObjectId(community);
        }

        await post.save();

        // Manually populate the updated post
        const authorDoc = await User.findById(post.author).select('username').lean();
        const communityDoc = await Community.findById(post.community).select('name').lean();

        let populatedPost = {
            ...post.toObject(),
            author: authorDoc ? { _id: authorDoc._id, username: authorDoc.username } : { _id: post.author, username: 'Unknown' },
            community: communityDoc ? { _id: communityDoc._id, name: communityDoc.name } : { _id: post.community, name: 'Unknown' },
        };

        // Convert image URL to data URL to hide the file path
        if (populatedPost.imageUrl && (populatedPost.imageUrl.includes('/uploads/posts/') || populatedPost.imageUrl.startsWith('/uploads/posts/'))) {
            // Extract the relative path from the URL
            let relativePath = populatedPost.imageUrl;
            if (relativePath.startsWith('http')) {
                // Extract path from full URL
                const url = new URL(relativePath);
                relativePath = url.pathname;
            }
            
            const imagePath = path.join(PROJECT_ROOT, 'uploads', relativePath);
            const dataUrl = getImageAsDataUrl(imagePath);
            if (dataUrl) {
                populatedPost.imageUrl = dataUrl;
            }
        }

        res.status(200).json(populatedPost);
    } catch (err) {
        console.error("Error updating post:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// --- 6. DELETE POST ---
export const deletePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Delete associated image file if it exists
        if (post.imageUrl && post.imageUrl.includes('/uploads/posts/')) {
            try {
                // Extract the relative path from the URL
                let relativePath = post.imageUrl;
                if (relativePath.startsWith('http')) {
                    // Extract path from full URL
                    const url = new URL(relativePath);
                    relativePath = url.pathname;
                }
                
                const imagePath = path.join(PROJECT_ROOT, 'uploads', relativePath);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (error) {
                console.error('Error deleting image file:', error);
                // Continue with post deletion even if image deletion fails
            }
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Helper for hot score calculation
const hotScore = (post: any) => {
    const score = (post.upvotes || 0) - (post.downvotes || 0);
    const order = Math.log10(Math.max(Math.abs(score), 1));
    // The 'post' object from .lean() will have createdAt as a Date object
    const seconds = (new Date(post.createdAt).getTime() / 1000) - 1134028003;
    return order + seconds / 45000;
  };
  
  // --- GET POPULAR POSTS ---
  export const getPopularPosts = async (req: Request, res: Response) => {
      try {
          const { userId } = req.query; // Optional: current user ID to check their votes
  
          // Get posts without populate first. Not sorting here, will sort by hot score later.
          const posts = await Post.find().lean();
  
          // Manually populate author, community, and get comment counts
          const populatedPosts = await Promise.all(
              posts.map(async (post: any) => {
                  try {
                      const author = await User.findById(post.author).select('username').lean();
                      const community = await Community.findById(post.community).select('name').lean();
                      const commentCount = await Comment.countDocuments({ postId: post._id });
  
                      let processedPost = {
                          ...post,
                          author: author ? { _id: author._id, username: author.username } : { _id: post.author, username: 'Unknown' },
                          community: community ? { _id: community._id, name: community.name } : { _id: post.community, name: 'Unknown' },
                          commentCount,
                      };
  
                      // Convert image URL to data URL to hide the file path
                      if (processedPost.imageUrl && (processedPost.imageUrl.includes('/uploads/posts/') || processedPost.imageUrl.startsWith('/uploads/posts/'))) {
                          let relativePath = processedPost.imageUrl;
                          if (relativePath.startsWith('http')) {
                              const url = new URL(relativePath);
                              relativePath = url.pathname;
                          }
                          
                          const imagePath = path.join(PROJECT_ROOT, 'uploads', relativePath);
                          const dataUrl = getImageAsDataUrl(imagePath);
                          if (dataUrl) {
                              processedPost.imageUrl = dataUrl;
                          }
                      }
  
                      return processedPost;
                  } catch (error) {
                      console.error('Error populating post:', post._id, error);
                      return {
                          ...post,
                          author: { _id: post.author, username: 'Unknown' },
                          community: { _id: post.community, name: 'Unknown' },
                      };
                  }
              })
          );
  
          // Calculate score for each post
          const postsWithScores = populatedPosts.map((post: any) => {
              const score = post.votes ? post.votes.reduce((acc: number, vote: any) => acc + vote.value, 0) : 0;
              const upvotes = post.votes ? post.votes.filter((v: any) => v.value === 1).length : 0;
              const downvotes = post.votes ? post.votes.filter((v: any) => v.value === -1).length : 0;
  
              let userVote = 0;
              if (userId && post.votes) {
                  const userVoteObj = post.votes.find((v: any) => v.userId.toString() === userId);
                  if (userVoteObj) {
                      userVote = userVoteObj.value;
                  }
              }
  
              return {
                  ...post,
                  score,
                  upvotes,
                  downvotes,
                  userVote,
                  commentCount: post.commentCount || 0
              };
          });
          
          // Sort by hot score
          const sortedPosts = postsWithScores.sort((a, b) => hotScore(b) - hotScore(a));
  
          res.status(200).json(sortedPosts);
      } catch (err) {
          console.error("Error fetching popular posts:", err);
          res.status(500).json({ message: "Server error" });
      }
  };
import { Request, Response } from "express";
import Post from "../models/PostSchema";

export const summarizePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({ message: "postId is required" });
        }

        // Fetch real post from DB
        const post = await Post.findById(postId).populate("community");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const prompt = `
You are summarizing a Reddit post.

Title: ${post.title}
Community: r/${(post.community as any).name}

Post:
${post.content}

Summarize this post in 3–5 concise bullet points.
Use clear, neutral language.
`;

        const response = await fetch(
            "https://models.inference.ai.azure.com/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 180,
                }),
            }
        );

        if (!response.ok) {
            const text = await response.text();
            return res.status(502).json({ message: "AI service error", details: text });
        }

        // Type the JSON to avoid 'unknown' error
        type ChatCompletion = {
            choices?: Array<{ message?: { content?: string } }>
        };
        const data = (await response.json()) as ChatCompletion;

        const summary = data?.choices?.[0]?.message?.content ?? "No summary available.";

        res.status(200).json({
            summary,
        });
    } catch (error) {
        console.error("AI summarize error:", error);
        res.status(500).json({ message: "AI summarization failed" });
    }
};

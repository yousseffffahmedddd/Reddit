import { Request, Response } from "express";
import { searchReddit } from "../services/redditService";
import { answerWithRedditContext } from "../services/aiService";

export async function askChatbot(req: Request, res: Response) {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Question is required" });
        }

        // 1. Fetch real Reddit data
        const redditResults = await searchReddit(question);

        // 2. Ask AI with Reddit context
        const answer = await answerWithRedditContext(
            question,
            redditResults
        );

        res.json({
            answer,
            sources: redditResults.map((p) => ({
                title: p.title,
                subreddit: p.subreddit,
                url: p.url,
                score: p.score,
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Chatbot failed" });
    }
}

// filepath: /home/awail/WebstormProjects/Reddit_clone/frontend/apis/aiApi.ts

// ---- Types ----
export interface SummarizeRequest {
    postId: string;
}

export interface SummarizeResponse {
    summary: string;
}

export interface ChatbotRequest {
    question: string;
}

export interface ChatbotSource {
    title: string;
    subreddit: string;
    url: string;
    score: number;
}

export interface ChatbotResponse {
    answer: string;
    sources: ChatbotSource[];
}

const AI_API_URL = "http://localhost:3000/apis/ai";
const CHATBOT_API_URL = "http://localhost:3000/api/chatbot";

// ---- API Functions ----

/**
 * Summarize a post using AI
 * @param postId - The ID of the post to summarize
 * @returns The AI-generated summary
 */
export const summarizePost = async (postId: string): Promise<SummarizeResponse> => {
    try {
        const res = await fetch(`${AI_API_URL}/summarize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Summarization failed");
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

/**
 * Ask the Reddit chatbot a question
 * @param question - The question to ask
 * @returns The AI answer with Reddit sources
 */
export const askChatbot = async (question: string): Promise<ChatbotResponse> => {
    try {
        const res = await fetch(`${CHATBOT_API_URL}/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Chatbot request failed");
        return data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};


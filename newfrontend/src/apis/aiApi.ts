// filepath: /home/awail/WebstormProjects/islam_front/src/apis/aiApi.ts

const API_BASE_URL =  'http://44.192.94.63:3000';
const AI_API_URL = `${API_BASE_URL}/apis/ai`;
const CHATBOT_API_URL = `${API_BASE_URL}/api/chatbot`;

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
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Summarization failed";
        throw new Error(message);
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
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Chatbot request failed";
        throw new Error(message);
    }
};


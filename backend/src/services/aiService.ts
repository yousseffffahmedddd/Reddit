import OpenAI from "openai";

if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is missing in environment variables");
}

const client = new OpenAI({
    apiKey: process.env.GITHUB_TOKEN,
    baseURL: "https://models.inference.ai.azure.com",
});

export async function answerWithRedditContext(
    question: string,
    redditPosts: {
        title: string;
        subreddit: string;
        score: number;
        text: string;
    }[]
) {
    const context = redditPosts
        .map(
            (p) => `
Title: ${p.title}
Subreddit: ${p.subreddit}
Score: ${p.score}
Content: ${p.text}
`
        )
        .join("\n---\n");

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content:
                    "You answer questions using Reddit discussions as evidence. Be neutral and concise.",
            },
            {
                role: "user",
                content: `Question:\n${question}\n\nReddit discussions:\n${context}`,
            },
        ],
        temperature: 0.4,
    });

    return response.choices[0].message.content;
}

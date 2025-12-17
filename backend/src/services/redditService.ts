import axios from "axios";

// ---- Reddit response types (minimal, safe) ----
interface RedditPostData {
    title: string;
    subreddit: string;
    permalink: string;
    score: number;
    selftext?: string;
}

interface RedditChild {
    data: RedditPostData;
}

interface RedditListing {
    data: {
        children: RedditChild[];
    };
}
// -----------------------------------------------

const BASE_URL = "https://www.reddit.com/search.json";

export async function searchReddit(query: string) {
    const response = await axios.get<RedditListing>(BASE_URL, {
        params: {
            q: query,
            sort: "relevance",
            t: "month",
            limit: 5,
        },
        headers: {
            "User-Agent": "redditclone-bot/1.0",
        },
    });

    const posts = response.data.data.children;

    return posts.map((item) => {
        const post = item.data;
        return {
            title: post.title,
            subreddit: `r/${post.subreddit}`,
            url: `https://reddit.com${post.permalink}`,
            score: post.score,
            text: post.selftext?.slice(0, 700) || "",
        };
    });
}

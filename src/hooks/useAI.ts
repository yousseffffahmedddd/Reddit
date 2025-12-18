'use client';

import { useMutation } from '@tanstack/react-query';
import { summarizePost, askChatbot } from '@/apis/aiApi';

// Re-export types for convenience
export type { SummarizeResponse, ChatbotResponse, ChatbotSource } from '@/apis/aiApi';

// Hooks
export function useSummarizePost() {
    return useMutation({
        mutationFn: summarizePost,
    });
}

export function useAskChatbot() {
    return useMutation({
        mutationFn: askChatbot,
    });
}
'use client';

import { useState } from 'react';
import { Send, Bot, ExternalLink, ThumbsUp } from 'lucide-react';
import { Button, Input, Loader } from '@/components/ui';
import { useAskChatbot } from '@/hooks';
import type { ChatbotResponse, ChatbotSource } from '@/hooks/useAI';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatbotSource[];
}

export default function AskPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  
  const { mutate: askChatbot, isPending } = useAskChatbot();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isPending) return;
    
    const userQuestion = question.trim();
    setQuestion('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    
    // Ask the chatbot
    askChatbot(userQuestion, {
      onSuccess: (response: ChatbotResponse) => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: response.answer,
            sources: response.sources,
          },
        ]);
      },
      onError: (error) => {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `Sorry, I encountered an error: ${error.message}`,
          },
        ]);
      },
    });
  };
  
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <Bot className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Ask Reddit AI</h1>
        <p className="mt-2 text-muted-foreground">
          Ask questions and get answers based on Reddit discussions
        </p>
      </div>
      
      {/* Chat Messages */}
      <div className="mb-4 min-h-[400px] space-y-4 rounded-lg border bg-card p-4">
        {messages.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p>Ask a question to get started!</p>
              <p className="mt-2 text-sm">Try asking about topics discussed on Reddit</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {/* Show sources for assistant messages */}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-4 border-t border-border/50 pt-3">
                    <p className="mb-2 text-sm font-medium">Sources:</p>
                    <div className="space-y-2">
                      {message.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded bg-background/50 p-2 text-sm hover:bg-background"
                        >
                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate font-medium">{source.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>r/{source.subreddit}</span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {source.score}
                              </span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isPending && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-muted px-4 py-3">
              <Loader text="Thinking..." />
            </div>
          </div>
        )}
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1"
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending || !question.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}


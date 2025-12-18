'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Search, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input, Avatar, Loader } from '@/components/ui';
import { useAuthStore, useConversations, useMessages, useSendMessage, useCreateConversation, useChatUsers, useSearchChatUsers } from '@/hooks';
import type { Conversation } from '@/hooks/useChat';

export default function ChatPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedConversation);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: createConversation } = useCreateConversation();
  const { data: allUsers } = useChatUsers();
  const { data: searchedUsers } = useSearchChatUsers(searchQuery);
  
  const usersToShow = searchQuery ? searchedUsers : allUsers;
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (!isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="text-center">
          <MessageCircle className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Chat</h1>
          <p className="mt-2 text-muted-foreground">Please log in to access chat</p>
        </div>
      </div>
    );
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;
    
    sendMessage({
      conversationId: selectedConversation,
      text: messageText.trim(),
    });
    setMessageText('');
  };
  
  const handleStartConversation = (otherUserId: string) => {
    createConversation(otherUserId, {
      onSuccess: (conversation) => {
        setSelectedConversation(conversation._id);
        setShowNewChat(false);
        setSearchQuery('');
      },
    });
  };
  
  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return null;
    const participants = conversation.participants;
    if (Array.isArray(participants) && participants.length > 0) {
      if (typeof participants[0] === 'string') {
        return participants.find(p => p !== user.id) as string | undefined;
      }
      const participant = participants.find(p => 
        typeof p === 'object' && p._id !== user.id
      );
      return participant as { _id: string; username: string } | undefined;
    }
    return null;
  };
  
  return (
    <div className="mx-auto flex h-[calc(100vh-100px)] max-w-6xl gap-4">
      {/* Conversations List */}
      <div className="w-80 flex-shrink-0 rounded-lg border bg-card">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Messages</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNewChat(!showNewChat)}
            >
              {showNewChat ? 'Cancel' : 'New Chat'}
            </Button>
          </div>
        </div>
        
        {showNewChat ? (
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-[400px] space-y-2 overflow-y-auto">
              {usersToShow?.filter(u => u._id !== user?.id).map((chatUser) => (
                <button
                  key={chatUser._id}
                  onClick={() => handleStartConversation(chatUser._id)}
                  className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-muted"
                >
                  <Avatar src={null} alt={chatUser.username} size="sm" />
                  <span className="font-medium">{chatUser.username}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto">
            {conversationsLoading ? (
              <div className="flex justify-center p-4">
                <Loader />
              </div>
            ) : conversations?.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No conversations yet
              </div>
            ) : (
              conversations?.map((conversation) => {
                const other = getOtherParticipant(conversation);
                const otherName = typeof other === 'object' ? other?.username : 'Unknown';
                
                return (
                  <button
                    key={conversation._id}
                    onClick={() => setSelectedConversation(conversation._id)}
                    className={cn(
                      'flex w-full items-center gap-3 border-b p-4 hover:bg-muted',
                      selectedConversation === conversation._id && 'bg-muted'
                    )}
                  >
                    <Avatar src={null} alt={otherName || ''} size="sm" />
                    <div className="flex-1 text-left">
                      <p className="font-medium">{otherName}</p>
                      {conversation.lastMessage && (
                        <p className="truncate text-sm text-muted-foreground">
                          {conversation.lastMessage.text}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
      
      {/* Chat Area */}
      <div className="flex flex-1 flex-col rounded-lg border bg-card">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar src={null} alt="Chat" size="sm" />
                <span className="font-medium">Conversation</span>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messagesLoading ? (
                <div className="flex justify-center">
                  <Loader />
                </div>
              ) : messages?.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages?.map((message) => {
                    const senderId = typeof message.sender === 'string' 
                      ? message.sender 
                      : message.sender._id;
                    const isOwn = senderId === user?.id;
                    
                    return (
                      <div
                        key={message._id}
                        className={cn(
                          'flex',
                          isOwn ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[70%] rounded-lg px-4 py-2',
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          <p>{message.text}</p>
                          {message.createdAt && (
                            <p className={cn(
                              'mt-1 text-xs',
                              isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            )}>
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isSending || !messageText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="mx-auto h-12 w-12" />
              <p className="mt-2">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


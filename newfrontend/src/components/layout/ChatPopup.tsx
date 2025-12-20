'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, MessageCircle, ArrowLeft, Plus, Search } from 'lucide-react';
import { Button, Input, Avatar, Loader } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAuthStore, useConversations, useMessages, useSendMessage, useCreateConversation, useChatUsers, useSearchChatUsers } from '@/hooks';
import type { Conversation } from '@/hooks/useChat';

export function ChatPopup() {
  const { user, isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [view, setView] = useState<'list' | 'chat' | 'new_chat'>('list');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Data hooks
  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedConversationId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: createConversation } = useCreateConversation();
  const { data: allUsers } = useChatUsers();
  const { data: searchedUsers } = useSearchChatUsers(searchQuery);

  const usersToShow = searchQuery ? searchedUsers : allUsers;

  // Scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized && view === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, view]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || !selectedConversationId) return;

    sendMessage({
      conversationId: selectedConversationId,
      text: inputValue,
    });
    setInputValue('');
  };

  const handleStartConversation = (otherUserId: string) => {
    createConversation(otherUserId, {
      onSuccess: (conversation) => {
        setSelectedConversationId(conversation._id);
        setView('chat');
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
      return participant as { _id: string; username: string; avatarUrl?: string } | undefined;
    }
    return null;
  };

  // Get active conversation details for header
  const activeConversation = conversations?.find(c => c._id === selectedConversationId);
  const otherParticipant = activeConversation ? getOtherParticipant(activeConversation) : null;
  const otherName = typeof otherParticipant === 'object' ? otherParticipant?.username : 'Chat';
  const otherAvatar = typeof otherParticipant === 'object' ? otherParticipant?.avatarUrl ?? null : null;
  const isOnline = false; // We don't have real-time online status yet

  if (!isAuthenticated) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-4 lg:right-[340px] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
        aria-label="Open chat"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 right-4 lg:right-[340px] z-50 w-80 rounded-t-lg border border-border bg-card shadow-2xl transition-all duration-300 ease-in-out",
        isMinimized ? "h-14" : "h-[500px]"
      )}
    >
      {/* Header */}
      <div
        className="flex h-14 items-center justify-between rounded-t-lg bg-primary px-3 py-2 text-primary-foreground cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          {(view === 'chat' || view === 'new_chat') && !isMinimized && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setView('list');
                if (view === 'new_chat') setSearchQuery('');
              }}
              className="mr-1 rounded-full p-1 hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          
          {view === 'chat' && !isMinimized ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Avatar src={otherAvatar} alt={otherName} size="xs" className="bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30" />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-1 ring-primary" />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm leading-none truncate max-w-[120px]">{otherName}</p>
                <p className="text-[10px] opacity-80">Active now</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-bold">{view === 'new_chat' ? 'New Chat' : 'Chat'}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="rounded p-1.5 hover:bg-primary-foreground/10 transition-colors"
            aria-label="Minimize"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="rounded p-1.5 hover:bg-primary-foreground/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="flex h-[calc(100%-56px)] flex-col bg-card">
          {view === 'list' && (
            <>
              <div className="p-2 border-b border-border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2 text-muted-foreground"
                  onClick={() => setView('new_chat')}
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {conversationsLoading ? (
                  <div className="flex justify-center py-4"><Loader size="sm" /></div>
                ) : conversations?.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">No conversations yet</div>
                ) : (
                  conversations?.map((conv) => {
                    const other = getOtherParticipant(conv);
                    const name = typeof other === 'object' ? other?.username : 'Unknown';
                    const avatar = typeof other === 'object' ? (other as any)?.avatarUrl : null;
                    
                    return (
                      <button
                        key={conv._id}
                        onClick={() => {
                          setSelectedConversationId(conv._id);
                          setView('chat');
                        }}
                        className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-secondary/50 transition-colors text-left"
                      >
                        <div className="relative shrink-0">
                          <Avatar src={avatar} alt={name} size="md" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-semibold text-sm truncate">{name}</span>
                            {/* We could add timestamp if available in conversation object */}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage?.text || 'No messages'}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          {view === 'new_chat' && (
            <div className="flex-1 flex flex-col">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {usersToShow?.filter(u => u._id !== user?.id).map((chatUser) => (
                  <button
                    key={chatUser._id}
                    onClick={() => handleStartConversation(chatUser._id)}
                    className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-muted text-left"
                  >
                    <Avatar src={chatUser.avatarUrl ?? null} alt={chatUser.username} size="sm" />
                    <span className="font-medium text-sm">{chatUser.username}</span>
                  </button>
                ))}
                {usersToShow?.length === 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground">No users found</div>
                )}
              </div>
            </div>
          )}

          {view === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto bg-secondary/10 p-4 space-y-3">
                {messagesLoading ? (
                  <div className="flex justify-center py-4"><Loader size="sm" /></div>
                ) : messages?.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">No messages yet</div>
                ) : (
                  messages?.map((msg) => {
                    const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id;
                    const isOwn = senderId === user?.id;
                    
                    return (
                      <div
                        key={msg._id}
                        className={cn(
                          "flex max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-2 text-sm shadow-sm",
                          isOwn
                            ? "self-end rounded-br-none bg-primary text-primary-foreground"
                            : "self-start rounded-bl-none bg-card border border-border text-foreground"
                        )}
                      >
                        <p>{msg.text}</p>
                        <span className={cn(
                          "text-[10px]",
                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="shrink-0 flex items-center gap-2 border-t border-border bg-card px-3 py-3"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message..."
                  className="h-9 flex-1 rounded-full bg-secondary border-transparent focus:bg-card focus:border-primary"
                  autoFocus
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!inputValue.trim() || isSending}
                  className="h-9 w-9 rounded-full shrink-0"
                >
                  {isSending ? <Loader size="sm" className="text-primary-foreground" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
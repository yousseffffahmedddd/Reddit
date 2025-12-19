'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Textarea } from '@/components/ui';
import { useCreateComment, useAuthStore } from '@/hooks';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export function CommentForm({
  postId,
  parentId,
  onSuccess,
  onCancel,
  autoFocus = false,
  placeholder = 'What are your thoughts?',
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isAuthenticated } = useAuthStore();
  const { mutate: createComment, isPending, error } = useCreateComment();

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !isAuthenticated) return;

    createComment(
      {
        postId,
        parentId,
        content: content.trim(),
      },
      {
        onSuccess: () => {
          setContent('');
          onSuccess?.();
        },
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="rounded border border-border bg-card p-3 text-center text-sm text-muted-foreground">
        Log in or sign up to leave a comment
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={parentId ? 3 : 4}
        className="resize-none text-sm"
      />

      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          isLoading={isPending}
          disabled={!content.trim()}
        >
          {parentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
}

'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ImageUploadProps {
  currentImage: string | null;
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  type?: 'avatar' | 'banner';
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  currentImage,
  onUpload,
  onDelete,
  type = 'avatar',
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please use JPEG, PNG, GIF, or WebP.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete();
      setPreviewUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const displayImage = previewUrl || currentImage;

  if (type === 'banner') {
    return (
      <div className={cn('relative', className)}>
        <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted md:h-48">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Banner"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-muted-foreground">No banner image</span>
            </div>
          )}

          {!disabled && (
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-background/80 backdrop-blur"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Camera className="mr-1 h-4 w-4" />
                    {displayImage ? 'Change' : 'Add Banner'}
                  </>
                )}
              </Button>
              {displayImage && onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-background/80 backdrop-blur"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }

  // Avatar type
  return (
    <div className={cn('relative inline-block', className)}>
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted">
        {displayImage ? (
          <img
            src={displayImage}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {!disabled && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </button>
        )}
      </div>

      {displayImage && onDelete && !disabled && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white transition-colors hover:bg-destructive/90"
        >
          {isDeleting ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {error && (
        <p className="mt-2 text-center text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}


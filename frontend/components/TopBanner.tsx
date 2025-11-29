"use client";

import { useEffect } from "react";

interface TopBannerProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function TopBanner({
  message,
  isVisible,
  onClose,
}: TopBannerProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg border border-green-600">
        <div className="flex items-center justify-between gap-4">
          <span className="font-medium">✓ {message}</span>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-lg font-bold ml-2"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

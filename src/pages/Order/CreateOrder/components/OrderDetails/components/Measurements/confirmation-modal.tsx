'use client';

import type React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,

  onConfirm,
  onCancel,
  title,
  message,
  subtitle,
  confirmText = 'YES',
  cancelText = 'NO',
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[50000]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="relative p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <p className="mb-2">{message}</p>
          {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}
        </div>

        <div className="flex border-t border-gray-200">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-blue-600 font-medium border-r border-gray-200 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-blue-600 font-medium hover:bg-gray-50"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

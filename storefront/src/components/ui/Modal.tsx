import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-[var(--yn-radius-md)] shadow-xl overflow-hidden border border-[var(--yn-border)] animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--yn-border)]">
          {title && <h3 className="text-lg font-bold font-heading text-[var(--yn-text)]">{title}</h3>}
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-xl font-bold p-1 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

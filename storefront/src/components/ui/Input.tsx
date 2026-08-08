import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[var(--yn-text)]">
          {label} {props.required && <span className="text-[var(--yn-error)]">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-[var(--yn-border)] rounded-[var(--yn-radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--yn-accent)] transition-all ${
          error ? 'border-[var(--yn-error)] focus:ring-[var(--yn-error)]' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-[var(--yn-error)]">{error}</span>}
    </div>
  );
}

import React, { useRef } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export default function OtpInput({ value, onChange, error }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const otpArr = value.padEnd(6, '').split('');
    otpArr[index] = char;
    const newOtp = otpArr.join('').trim();
    onChange(newOtp);

    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2 justify-center">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-11 h-12 text-center text-xl font-bold border border-[var(--yn-border)] rounded-[var(--yn-radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--yn-accent)] bg-stone-50"
          />
        ))}
      </div>
      {error && <span className="text-xs text-[var(--yn-error)] font-medium">{error}</span>}
    </div>
  );
}

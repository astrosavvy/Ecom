"use client";

import React, { useRef, useEffect } from "react";
import { KeyRound, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Card1BOtpDetachedProps {
  phone: string;
  otp: string;
  setOtp: (val: string) => void;
  onVerify: (val: string) => void;
  onResend?: () => void;
  onBypass?: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function Card1BOtpDetached({
  phone,
  otp,
  setOtp,
  onVerify,
  onResend,
  onBypass,
  isLoading,
  error,
}: Card1BOtpDetachedProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const char = e.target.value.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const otpArr = otp.padEnd(6, "").split("");
    otpArr[index] = char;
    const newOtp = otpArr.join("").trim();
    setOtp(newOtp);

    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.length === 6) {
      onVerify(newOtp);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 220, damping: 20, mass: 0.9 }}
      className="w-full flex flex-col justify-between h-full p-4 sm:p-6 select-none text-left"
    >
      {/* Compact Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] font-mono uppercase tracking-wider">
          <KeyRound size={10} className="animate-pulse" />
          <span>INSTANT ASTRAL ACCESS</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#FDFCF8] tracking-tight">
          Verify Your Code
        </h3>
        <p className="text-xs text-stone-300">
          6-digit passcode sent to <span className="font-mono text-[#D4AF37] font-semibold">+91 {phone}</span>
        </p>
      </div>

      {/* OTP Inputs + Actions */}
      <div className="space-y-3 my-auto">
        <div className="flex justify-between gap-2 sm:gap-3 max-w-sm mx-auto">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[i] || ""}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`w-10 sm:w-11 h-12 sm:h-13 text-center text-lg font-mono font-extrabold rounded-xl bg-white/5 border transition-all duration-200 focus:outline-none ${
                otp[i]
                  ? "border-[#D4AF37] text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)] bg-[#D4AF37]/5"
                  : "border-white/10 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-400 font-medium text-center">{error}</p>
        )}

        <button
          type="button"
          disabled={isLoading || otp.length < 6}
          onClick={() => onVerify(otp)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#07080E] font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            <>
              <CheckCircle2 size={14} />
              <span>Verify & Continue</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>

        {/* Guest Pass Bypass */}
        {onBypass && (
          <button
            type="button"
            onClick={onBypass}
            className="w-full py-1.5 text-[11px] font-mono text-[#D4AF37]/80 hover:text-[#D4AF37] text-center hover:underline flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>OTP not received? Proceed with Guest Pass →</span>
          </button>
        )}
      </div>

      {/* Resend */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-stone-400">
        <span>Didn&apos;t receive code?</span>
        <button
          type="button"
          onClick={onResend}
          className="text-[#D4AF37] hover:underline font-bold transition-all cursor-pointer"
        >
          Resend OTP
        </button>
      </div>
    </motion.div>
  );
}

"use client";

import React, { useRef, useEffect } from "react";
import { KeyRound, ArrowRight, RefreshCw, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Card1BOtpDetachedProps {
  phone: string;
  otp: string;
  setOtp: (val: string) => void;
  onVerify: (val: string) => void;
  onResend?: () => void;
  onBypass?: () => void;
  onBack?: () => void;
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
  onBack,
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
      initial={{ y: 15, opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -15, opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="w-full flex flex-col justify-between h-full p-6 sm:p-8 select-none text-left"
    >
      {/* Header with Back Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider backdrop-blur-md">
            <KeyRound size={11} className="animate-pulse" />
            <span>INSTANT ASTRAL ACCESS</span>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-stone-300 hover:text-white text-[11px] font-mono transition-all cursor-pointer"
            >
              <ArrowLeft size={12} />
              <span>Change Number</span>
            </button>
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FDFCF8] tracking-tight">
          Verify Verification Code
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
          Enter the 6-digit sacred pass sent to <span className="font-mono text-[#D4AF37] font-semibold">+91 {phone}</span>
        </p>
      </div>

      {/* High-Contrast Pearl 6-Digit OTP Boxes */}
      <div className="space-y-4 my-auto">
        <div className="flex justify-center gap-2 sm:gap-3 max-w-sm mx-auto">
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
              className={`w-11 sm:w-13 h-14 sm:h-15 text-center text-xl font-mono font-extrabold rounded-2xl border transition-all duration-200 focus:outline-none ${
                otp[i]
                  ? "border-[#D4AF37] text-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.35)] bg-white/[0.12]"
                  : "border-white/20 text-white bg-white/[0.08] hover:bg-white/[0.12] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-400 font-medium text-center">{error}</p>
        )}

        {/* Fluid Golden Shimmer Button */}
        <button
          type="button"
          disabled={isLoading || otp.length < 6}
          onClick={() => onVerify(otp)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#FDF0CD] to-[#B8860B] text-[#07080E] font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.55)] hover:scale-[1.015] active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <RefreshCw size={15} className="animate-spin" />
              <span>Verifying Astral Pass...</span>
            </div>
          ) : (
            <>
              <CheckCircle2 size={16} />
              <span>Verify & Continue</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>

        {/* Discrete Fast Fallback Button */}
        {onBypass && (
          <button
            type="button"
            onClick={onBypass}
            className="w-full py-1 text-[11px] font-mono text-[#D4AF37]/90 hover:text-[#D4AF37] text-center hover:underline flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>OTP not received? Proceed with Guest Pass →</span>
          </button>
        )}
      </div>

      {/* Resend Cooldown */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-300">
        <span>Didn't receive code?</span>
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

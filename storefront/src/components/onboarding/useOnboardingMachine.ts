"use client";

import { useState, useCallback } from "react";
import {
  calculateVedicRashi,
  getWesternSunSign,
  calculateAstrologySynergy,
  AstroKundaliProfile,
  SynergyResult,
} from "@/lib/astrologyEngine";

export type OnboardingStep =
  | "CARD_1_PHONE"
  | "CARD_1B_OTP"
  | "CARD_2_PERSONAL_ASTRO"
  | "CARD_3_GIFT_INTENT"
  | "CARD_4_RECIPIENT_ASTRO"
  | "DISSOLVING"
  | "COMPLETED";

export interface RecipientData {
  relationship: string;
  name: string;
  dob: string;
  tob?: string;
  pob?: string;
}

export function useOnboardingMachine() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("CARD_1_PHONE");
  const [isGooeySeparating, setIsGooeySeparating] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<AstroKundaliProfile>({
    name: "",
    dob: "1998-05-15",
    tob: "08:30",
    pob: "Mumbai, India",
    sunSign: getWesternSunSign("1998-05-15"),
    moonSign: calculateVedicRashi("1998-05-15", "08:30").rashi,
    nakshatra: calculateVedicRashi("1998-05-15", "08:30").nakshatra,
  });

  // Gift Intent
  const [recipient, setRecipient] = useState<RecipientData>({
    relationship: "Brother",
    name: "",
    dob: "2000-08-10",
    tob: "",
    pob: "",
  });

  const [synergy, setSynergy] = useState<SynergyResult | null>(null);

  /**
   * Card 1: Submit Phone Number -> Trigger Gooey Separation to Card 1B
   */
  const submitPhone = useCallback(async (phoneNumber: string) => {
    setError(null);
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setPhone(cleaned);
    setIsLoading(true);

    try {
      // Begin Gooey Detachment Animation
      setIsGooeySeparating(true);
      setCurrentStep("CARD_1B_OTP");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Card 1B: Verify OTP
   */
  const verifyOtp = useCallback(async (enteredOtp: string) => {
    setError(null);
    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // Advance to Card 2 (Personal Astrology)
      setIsGooeySeparating(false);
      setCurrentStep("CARD_2_PERSONAL_ASTRO");
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Bypass OTP if code is delayed or in testing mode
   */
  const bypassOtp = useCallback(() => {
    setError(null);
    setIsGooeySeparating(false);
    // Set fallback phone if empty
    if (!phone) setPhone("9876543210");
    setCurrentStep("CARD_2_PERSONAL_ASTRO");
  }, [phone]);

  /**
   * Testing Mode: Fast-track to Returning User with Pre-computed Kundali
   */
  const loadDemoReturningUser = useCallback(() => {
    setError(null);
    setIsGooeySeparating(false);
    setPhone("9876543210");
    setUserProfile({
      name: "Aaditya Sharma",
      email: "aaditya.sharma@example.com",
      dob: "1995-08-18",
      tob: "07:15",
      pob: "Jaipur, Rajasthan",
      sunSign: getWesternSunSign("1995-08-18"),
      moonSign: calculateVedicRashi("1995-08-18", "07:15").rashi,
      nakshatra: calculateVedicRashi("1995-08-18", "07:15").nakshatra,
    });
    // Advance directly to gift recipient card
    setCurrentStep("CARD_3_GIFT_INTENT");
  }, []);

  /**
   * Testing Mode: Reset to Fresh New User Journey
   */
  const loadDemoNewUser = useCallback(() => {
    setError(null);
    setIsGooeySeparating(false);
    setPhone("");
    setOtp("");
    setCurrentStep("CARD_1_PHONE");
  }, []);

  /**
   * Card 2: Personal Astrology Profile Submit
   */
  const submitPersonalAstro = useCallback(
    (data: { name: string; dob: string; tob?: string; pob?: string }) => {
      const sun = getWesternSunSign(data.dob);
      const { rashi, nakshatra } = calculateVedicRashi(data.dob, data.tob);

      const profile: AstroKundaliProfile = {
        name: data.name || "Seeker",
        dob: data.dob,
        tob: data.tob,
        pob: data.pob,
        sunSign: sun,
        moonSign: rashi,
        nakshatra,
      };

      setUserProfile(profile);
      setCurrentStep("CARD_3_GIFT_INTENT");
    },
    []
  );

  /**
   * Card 3: Gift Intent Chip Selection
   */
  const selectGiftIntent = useCallback(
    (relationship: string) => {
      setRecipient((prev) => ({ ...prev, relationship }));
      if (relationship === "Self") {
        // Compute Self Synergy and skip recipient form directly to dissolve
        const selfSynergy = calculateAstrologySynergy(userProfile, {
          name: userProfile.name,
          dob: userProfile.dob,
          relationship: "Self",
        });
        setSynergy(selfSynergy);
        setCurrentStep("DISSOLVING");
      } else {
        setCurrentStep("CARD_4_RECIPIENT_ASTRO");
      }
    },
    [userProfile]
  );

  /**
   * Card 4: Recipient Astrological Details & Synergy Calculation
   */
  const submitRecipientAstro = useCallback(
    (data: { name: string; dob: string; tob?: string; pob?: string }) => {
      const recData = {
        ...recipient,
        ...data,
      };
      setRecipient(recData);

      const computedSynergy = calculateAstrologySynergy(userProfile, {
        name: recData.name || recData.relationship,
        dob: recData.dob,
        relationship: recData.relationship,
      });

      setSynergy(computedSynergy);
      setCurrentStep("DISSOLVING");
    },
    [recipient, userProfile]
  );

  /**
   * Complete Dissolve Transition
   */
  const completeDissolve = useCallback(() => {
    setCurrentStep("COMPLETED");
  }, []);

  const reset = useCallback(() => {
    setCurrentStep("CARD_1_PHONE");
    setIsGooeySeparating(false);
    setOtp("");
    setError(null);
  }, []);

  return {
    currentStep,
    isGooeySeparating,
    phone,
    otp,
    setOtp,
    error,
    isLoading,
    userProfile,
    recipient,
    synergy,
    submitPhone,
    verifyOtp,
    bypassOtp,
    loadDemoReturningUser,
    loadDemoNewUser,
    submitPersonalAstro,
    selectGiftIntent,
    submitRecipientAstro,
    completeDissolve,
    reset,
  };
}

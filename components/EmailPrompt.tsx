"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  walletAddress: string;
  onDismiss: () => void;
}

export default function EmailPrompt({ walletAddress, onDismiss }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: walletAddress, email }),
      });
      if (!res.ok) throw new Error("Failed to save email.");
      setSubmitted(true);
    } catch {
      setError("Could not save email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-brand-gray rounded-[20px] p-[26px_29px] flex flex-col gap-2 max-w-md">
        <p className="text-brand-green font-display font-bold italic text-lg">
          Got it! We&apos;ll keep you in the loop.
        </p>
        <button
          onClick={onDismiss}
          className="text-brand-blue text-sm hover:opacity-70 transition-opacity text-left"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-gray rounded-[20px] p-[26px_29px] flex flex-col gap-4 max-w-md">
      <div>
        <p className="text-brand-orange font-display font-bold italic text-xl mb-1">
          Stay in the Loop
        </p>
        <p className="text-brand-white/70 font-sans text-sm">
          Add your email to receive order updates and future season
          announcements.
        </p>
      </div>
      <div className="flex gap-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-brand-orange focus:ring-brand-orange bg-brand-gray text-white flex-1"
        />
        <Button
          variant="brand-orange"
          size="sm"
          className="h-[44px] w-auto px-5"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "SAVING..." : "SAVE"}
        </Button>
      </div>
      {error && <p className="text-brand-red text-xs font-sans">{error}</p>}
      <button
        onClick={onDismiss}
        className="text-brand-blue/60 text-xs hover:opacity-70 transition-opacity text-left"
      >
        No thanks
      </button>
    </div>
  );
}

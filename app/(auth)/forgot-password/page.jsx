"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Icon from "@/components/Icon";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setIsSent(true);
  };

  if (isSent) {
    return (
      <div className="text-center flex flex-col items-center animate-fade-in py-4">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 ring-4 ring-success/5">
          <Icon name="Check" size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2 text-base-content">Check your email</h3>
        <p className="text-base-content/70 mb-8 max-w-xs mx-auto">
          We've sent password reset instructions to <span className="font-semibold text-base-content block mt-1">{email}</span>
        </p>
        <Link href="/login" className="w-full">
          <Button variant="ghost" className="w-full gap-2 hover:bg-base-200">
            <Icon name="ArrowLeft" size={18} />
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="alert alert-info text-sm py-3 rounded-lg bg-info/10 text-info-content border border-info/20 shadow-sm">
        <Icon name="Info" size={18} className="shrink-0" />
        <span>Enter your email address and we'll send you a link to reset your password.</span>
      </div>

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        icon="Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="animate-fade-in"
      />

      <Button 
        type="submit" 
        className="w-full mt-4 animate-fade-in" 
        style={{ animationDelay: "0.1s" }}
        loading={loading}
        disabled={loading}
        variant="primary"
      >
        Send Reset Link
      </Button>

      <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <Link href="/login" className="link link-hover text-sm text-base-content/70 flex items-center justify-center gap-2 hover:text-primary transition-colors">
          <Icon name="ArrowLeft" size={16} />
          Back to Login
        </Link>
      </div>
    </form>
  );
}
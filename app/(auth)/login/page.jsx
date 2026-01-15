"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if already logged in
    if (api.isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.login({
        email: formData.email,
        password: formData.password,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="alert alert-error text-sm py-2 rounded-lg shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        icon="Mail"
        value={formData.email}
        onChange={handleChange}
        required
        className="animate-fade-in"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        icon="Lock"
        value={formData.password}
        onChange={handleChange}
        required
        className="animate-fade-in"
        style={{ animationDelay: "0.1s" }}
        bottomRightLabel={
          <Link href="/forgot-password" className="link link-primary link-hover text-xs">
            Forgot password?
          </Link>
        }
      />

      <Button 
        type="submit" 
        className="w-full mt-4 animate-fade-in" 
        style={{ animationDelay: "0.2s" }}
        loading={loading}
        disabled={loading}
        variant="primary"
      >
        Sign In
      </Button>

      <div className="text-center mt-6 text-sm text-base-content/70 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        Don't have an account?{" "}
        <Link href="/register" className="link link-primary font-semibold no-underline hover:underline transition-all">
          Create Account
        </Link>
      </div>
    </form>
  );
}
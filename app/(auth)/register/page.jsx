"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await api.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <div className="alert alert-error text-sm py-2 rounded-lg shadow-sm mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      <Input
        label="Full Name"
        name="name"
        placeholder="John Doe"
        icon="User"
        value={formData.name}
        onChange={handleChange}
        required
        className="animate-fade-in"
      />

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
        style={{ animationDelay: "0.1s" }}
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
        style={{ animationDelay: "0.2s" }}
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="••••••••"
        icon="CheckCircle"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        className="animate-fade-in"
        style={{ animationDelay: "0.3s" }}
      />

      <Button 
        type="submit" 
        className="w-full mt-4 animate-fade-in" 
        style={{ animationDelay: "0.4s" }}
        loading={loading}
        disabled={loading}
        variant="primary"
      >
        Create Account
      </Button>

      <div className="text-center mt-6 text-sm text-base-content/70 animate-fade-in" style={{ animationDelay: "0.5s" }}>
        Already have an account?{" "}
        <Link href="/login" className="link link-primary font-semibold no-underline hover:underline transition-all">
          Sign In
        </Link>
      </div>
    </form>
  );
}
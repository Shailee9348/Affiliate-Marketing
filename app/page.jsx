"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Icon from "@/components/Icon";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Small delay to ensure storage is ready and prevent immediate flicker
    const checkAuth = () => {
      try {
        if (api.isAuthenticated()) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      }
    };

    const timer = setTimeout(checkAuth, 500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 p-4">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo / Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 animate-pulse">
          <Icon name="BarChart2" size={40} className="text-primary-content" />
        </div>
        
        {/* Loading State */}
        <div className="flex flex-col items-center gap-2">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/60 font-medium animate-pulse">
            Initializing AffiliatePro...
          </p>
        </div>
      </div>
    </div>
  );
}
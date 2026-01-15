"use client";

import { usePathname } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";

export default function Layout({ children }) {
  const pathname = usePathname();

  const getLayoutProps = () => {
    switch (pathname) {
      case "/register":
        return {
          title: "Create Account",
          subtitle: "Join our affiliate network and start earning"
        };
      case "/forgot-password":
        return {
          title: "Reset Password",
          subtitle: "Enter your email to recover your account"
        };
      case "/login":
      default:
        return {
          title: "Welcome Back",
          subtitle: "Sign in to access your affiliate dashboard"
        };
    }
  };

  const { title, subtitle } = getLayoutProps();

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {children}
    </AuthLayout>
  );
}
"use client";

import Icon from "@/components/Icon";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full bg-base-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[100px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-content mb-6 shadow-xl shadow-primary/30 transform transition-transform hover:scale-105 duration-300">
            <Icon name="BarChart2" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-base-content mb-2 tracking-tight">
            {title || "Welcome Back"}
          </h1>
          <p className="text-base-content/60 text-sm max-w-xs mx-auto">
            {subtitle || "Sign in to access your affiliate dashboard and analytics"}
          </p>
        </div>
        
        {/* Main Card Content */}
        <div className="w-full card bg-base-100 shadow-2xl border border-base-200/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="card-body p-8">
            {children}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <p className="text-xs text-base-content/40 font-medium">
            &copy; {new Date().getFullYear()} Affiliate Analytics Pro. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <a href="#" className="text-xs text-base-content/50 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-base-content/50 hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/Icon";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error("Application Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-2xl max-w-md w-full border border-base-200 animate-fade-in">
        <div className="card-body items-center text-center p-8">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mb-6 ring-8 ring-error/5">
            <Icon name="AlertTriangle" size={40} />
          </div>
          
          {/* Title & Description */}
          <h2 className="card-title text-2xl font-bold mb-2 text-base-content">
            Something went wrong!
          </h2>
          
          <p className="text-base-content/60 mb-6">
            We encountered an unexpected error while processing your request.
          </p>

          {/* Error Details (Collapsible/Scrollable) */}
          {error?.message && (
            <div className="bg-base-200/50 p-4 rounded-lg w-full mb-6 text-left border border-base-300">
              <p className="text-xs font-mono text-error break-all line-clamp-4">
                Error: {error.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col w-full gap-3">
            <Button 
              onClick={() => reset()} 
              variant="primary" 
              className="w-full shadow-lg shadow-primary/20"
              icon="RefreshCw"
            >
              Try Again
            </Button>
            
            <Button 
              onClick={() => window.location.href = "/dashboard"} 
              variant="ghost" 
              className="w-full hover:bg-base-200"
              icon="Home"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
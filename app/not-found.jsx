"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/Icon";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center max-w-lg relative z-10 animate-fade-in-up">
        {/* 404 Visual */}
        <div className="relative mb-8 inline-block">
          <h1 className="text-[10rem] font-black text-base-content/5 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-base-100 p-6 rounded-full shadow-2xl border border-base-200 animate-bounce">
              <Icon name="FileQuestion" size={48} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-bold text-base-content mb-3">Page Not Found</h2>
        <p className="text-base-content/60 mb-8 text-lg leading-relaxed">
          Oops! The page you are looking for seems to have wandered off into the digital void or never existed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" icon="Home" className="w-full sm:w-auto shadow-lg shadow-primary/20">
              Back to Dashboard
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="lg" 
            icon="ArrowLeft" 
            onClick={() => router.back()}
            className="w-full sm:w-auto bg-base-100"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
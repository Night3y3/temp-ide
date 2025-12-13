"use client";

import { Hero } from "./Hero";
import { Features } from "./Features";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn } from "lucide-react";

interface LandingPageProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function LandingPage({ onCreateAccount, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 relative">
        <Hero onCreateAccount={onCreateAccount} onLogin={onLogin} />
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-800">
        <Features />
      </section>

      {/* Footer CTA */}
      <section className="border-t border-slate-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Coding?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Get your IDE environment ready in minutes with AI-powered setup.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onCreateAccount}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 text-lg font-semibold shadow-lg shadow-blue-500/25"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Account
            </Button>
            <Button
              onClick={onLogin}
              variant="ghost"
              size="lg"
              className="text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-800 hover:border-slate-700 px-8 py-4 text-lg font-semibold transition-all"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


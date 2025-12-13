"use client";

import { motion } from "framer-motion";
import { Sparkles, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function Hero({ onCreateAccount, onLogin }: HeroProps) {
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-blue-400 font-medium">AI-Powered IDE Setup</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
          Describe Your Project.
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Get Your IDE Ready.
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Tell our AI what you want to build, and get a cloud-based IDE with a single-file starter code ready to go. No infrastructure setup needed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={onCreateAccount}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-blue-500/25"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Create Account
          </Button>
          <Button
            onClick={onLogin}
            variant="ghost"
            size="lg"
            className="text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-800 hover:border-slate-700 px-8 py-6 text-lg font-semibold transition-all"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Login
          </Button>
        </div>
      </motion.div>
    </div>
  );
}


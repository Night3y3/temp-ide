"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-slate-900 border-slate-800 shadow-2xl w-[500px] h-fit transition-all duration-200">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <LogIn className="text-blue-400 h-6 w-6" />
          <Badge variant="outline" className="text-blue-400 border-blue-400/30">Login</Badge>
        </div>
        <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
        <CardDescription className="text-slate-400">
          Sign in to access your projects
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
              required
            />
          </div>

          <div className="h-6 flex items-center">
            {error ? (
              <p className="text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </p>
            ) : (
              <span className="opacity-0">Placeholder</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-[0.98]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onSwitchToSignup}
            className="w-full text-slate-400 hover:text-white"
          >
            Don't have an account? Sign up
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}


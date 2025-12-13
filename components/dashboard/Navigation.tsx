"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut, Plus, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserEmail(data.user?.email || null);
        }
      } catch {
        // Ignore errors
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      // Ignore errors
    }
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <LayoutDashboard className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-sm text-slate-400 hidden sm:block">{userEmail}</span>
            )}
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-slate-300 hover:text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-slate-300 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}


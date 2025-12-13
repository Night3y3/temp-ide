"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { ProjectList } from "@/components/dashboard/ProjectList";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6">Your Projects</h2>
        <ProjectList />
      </div>
    </AuthGuard>
  );
}


"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { Loader2, RefreshCw } from "lucide-react";

import { triggerTermination } from "@/actions/kestra";
import { syncProjectStatuses } from "@/actions/syncStatus";

interface Project {
  id: string;
  name: string;
  description: string;
  url: string | null;
  instanceId: string | null;
  status: string;
  createdAt: string;
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      await syncProjectStatuses();
      await fetchProjects();
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setSyncing(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete project");
      await fetchProjects();
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  }

  async function handleTerminate(instanceId: string) {
    if (!confirm("Are you sure you want to terminate this environment?")) return;

    try {
      const res = await triggerTermination(instanceId);
      if (!res.success) throw new Error(res.error || "Termination failed");

      // Optimistic update or refetch
      await fetchProjects();
    } catch (err: any) {
      alert(err.message || "Failed to terminate environment");
    }
  }

  useEffect(() => {
    // Sync statuses on initial load, then fetch projects
    syncProjectStatuses().then(() => fetchProjects());
  }, []);

  useEffect(() => {
    const hasProvisioning = projects.some((p) => p.status === "provisioning");
    let interval: NodeJS.Timeout;

    if (hasProvisioning) {
      interval = setInterval(fetchProjects, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [projects]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchProjects}
          className="mt-4 text-blue-400 hover:text-blue-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">No projects yet</p>
        <a
          href="/"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Create your first project
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Refresh Status'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDelete}
            onTerminate={handleTerminate}
          />
        ))}
      </div>
    </>
  );
}


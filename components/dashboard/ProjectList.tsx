"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  url: string | null;
  status: string;
  createdAt: string;
}

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchProjects();
  }, []);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
      ))}
    </div>
  );
}


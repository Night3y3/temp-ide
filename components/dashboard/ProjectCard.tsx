import { Globe, Trash2, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  name: string;
  description: string;
  url: string | null;
  status: string;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => Promise<void>;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case "provisioning":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Provisioning</Badge>;
      case "terminated":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Terminated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-xl mb-2">{project.name}</CardTitle>
            <CardDescription className="text-slate-400 line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          {getStatusBadge(project.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {project.url && (
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-blue-400" />
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 hover:underline truncate"
            >
              {project.url}
            </a>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          <span>Created {formatDate(project.createdAt)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {project.url && project.status === "active" && (
          <Button
            onClick={() => window.open(project.url!, "_blank")}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Globe className="mr-2 h-4 w-4" />
            Open IDE
          </Button>
        )}
        <Button
          variant="destructive"
          onClick={() => onDelete(project.id)}
          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/30"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}


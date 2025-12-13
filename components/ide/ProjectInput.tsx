import { Terminal, ChevronRight, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface ProjectInputProps {
    userId: string;
    setUserId: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    onAnalyze: () => void;
    error: string | null;
}

export function ProjectInput({ userId, setUserId, description, setDescription, onAnalyze, error }: ProjectInputProps) {
    return (
        // FIX 1: Add 'h-fit' and prevent layout shifts with a fixed width container
        <Card className="bg-slate-900 border-slate-800 shadow-2xl w-[500px] h-fit transition-all duration-200">
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Terminal className="text-blue-400 h-6 w-6" />
                    <Badge variant="outline" className="text-blue-400 border-blue-400/30">Agentic IDE</Badge>
                </div>
                <CardTitle className="text-white text-2xl">New Project</CardTitle>
                <CardDescription className="text-slate-400">
                    Describe your dream app. AI will handle the infrastructure.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">User ID</label>
                    <Input
                        placeholder="e.g. dev_01"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Project Description</label>
                    {/* FIX 2: Add 'resize-none' to prevent user resizing breakage */}
                    <Textarea
                        placeholder="e.g. A Python Flask app that tracks crypto prices..."
                        className="h-32 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 resize-none focus-visible:ring-blue-500"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* FIX 3: Reserve fixed height for error message so card doesn't jump */}
                <div className="h-6 flex items-center">
                    {error ? (
                        <p className="text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                            <AlertCircle className="h-4 w-4" /> {error}
                        </p>
                    ) : (
                        <span className="opacity-0">Placeholder</span> // Invisible text to keep height
                    )}
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    onClick={onAnalyze}
                    disabled={!userId || !description}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-[0.98]"
                >
                    Analyze & Plan <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
import { CheckCircle2, Globe, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SuccessViewProps {
    finalUrl: string;
    instanceId: string | null;
    onReset: () => void;
    onTerminate: () => Promise<void>;
    isTerminating: boolean;
}

export function SuccessView({ finalUrl, instanceId, onReset, onTerminate, isTerminating }: SuccessViewProps) {
    return (
        <div className="w-full max-w-lg">
            <Card className="bg-slate-900 border-green-900/50 shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)]">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-green-500/10 p-3 rounded-full w-fit mb-4">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl text-white">Environment Ready</CardTitle>
                    <CardDescription className="text-slate-400">
                        Deployed successfully.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    <div className="bg-black/40 p-4 rounded-lg border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Access URL</span>
                            <Globe className="h-4 w-4 text-blue-400" />
                        </div>
                        <a
                            href={finalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-blue-400 hover:text-blue-300 hover:underline truncate font-mono text-lg"
                        >
                            {finalUrl}
                        </a>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex gap-3 items-start">
                        <div className="mt-1">⚠️</div>
                        <div className="text-sm text-yellow-200/80">
                            <p className="font-semibold text-yellow-200">Credentials</p>
                            <p className="mt-1">If prompted, password is: <code className="bg-yellow-500/20 px-1 rounded">mypassword</code></p>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button
                        onClick={() => window.open(finalUrl, '_blank')}
                        className="w-full bg-green-600 hover:bg-green-500 text-white"
                    >
                        Open IDE
                    </Button>

                    {instanceId && (
                        <Button
                            variant="destructive"
                            disabled={isTerminating}
                            onClick={onTerminate}
                            className="w-full border-red-900/50 hover:bg-red-900/50 bg-transparent text-red-400"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isTerminating ? "Destroying..." : "Destroy Environment"}
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <div className="text-center mt-6">
                <button onClick={onReset} className="text-slate-500 hover:text-white text-sm transition-colors">
                    Start New Project
                </button>
            </div>
        </div>
    );
}
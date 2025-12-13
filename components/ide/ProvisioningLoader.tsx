import { Server } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ProvisioningLoader() {
    return (
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm w-full max-w-md">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="relative h-20 w-20">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    <Server className="absolute inset-0 m-auto h-8 w-8 text-green-500" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">Building Infrastructure</h2>
                    <div className="text-sm text-slate-400 space-y-1 font-mono">
                        <p className="animate-pulse">Attempting to contact Agent...</p>
                        <p className="animate-pulse delay-75">Provisioning EC2 Instance...</p>
                        <p className="animate-pulse delay-150">Configuring SSL & Nginx...</p>
                        <p className="animate-pulse delay-300">Installing dependencies...</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
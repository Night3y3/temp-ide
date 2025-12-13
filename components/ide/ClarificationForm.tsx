import { Server } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlanResponse } from "@/components/types";

interface ClarificationFormProps {
    plan: PlanResponse;
    answers: Record<string, string>;
    setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    onBack: () => void;
    onProvision: () => void;
}

export function ClarificationForm({ plan, answers, setAnswers, onBack, onProvision }: ClarificationFormProps) {
    const isComplete = Object.keys(answers).length >= plan.questions.length;

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-2xl w-full max-w-2xl">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-white text-xl">Technical Plan</CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                            {plan.analysis}
                        </CardDescription>
                    </div>
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                        {plan.questions.length} Decisions
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {plan.questions.map((q) => (
                    <div key={q.id} className="space-y-3">
                        <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {q.question}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: option }))}
                                    className={`
                    text-left px-4 py-3 rounded-lg border text-sm transition-all
                    ${answers[q.id] === option
                                            ? "bg-blue-600/20 border-blue-500 text-blue-200 ring-1 ring-blue-500"
                                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-900"}
                  `}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-slate-800 pt-6">
                <Button variant="ghost" onClick={onBack} className="text-slate-400">
                    Back
                </Button>
                <Button
                    onClick={onProvision}
                    disabled={!isComplete}
                    className="bg-green-600 hover:bg-green-500 text-white px-8"
                >
                    Start Provisioning <Server className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
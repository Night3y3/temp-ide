"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Terminal, CheckCircle2, Server, Globe, Cpu, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { triggerProvisioning } from "@/actions/kestra";

// --- Types ---
type Step = 'input' | 'analyzing' | 'clarification' | 'provisioning' | 'completed';

interface PlanResponse {
  analysis: string;
  questions: {
    id: string;
    question: string;
    options: string[];
  }[];
}

export default function AgenticIDE() {
  const [step, setStep] = useState<Step>('input');

  // Data State
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- HANDLER: Get Clarification Questions ---
  async function handleAnalyze() {
    if (!userId || !description) return;
    setStep('analyzing');

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        body: JSON.stringify({ prompt: description }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setPlan(data);
      setStep('clarification');
    } catch (e) {
      setError("AI Architect failed to analyze. Please try again.");
      setStep('input');
    }
  }

  // --- HANDLER: Submit Final to Kestra ---
  async function handleProvision() {
    setStep('provisioning');

    // 1. Construct the Mega Prompt
    const clarifications = Object.entries(answers)
      .map(([qid, ans]) => `- ${ans}`)
      .join("\n");

    const finalPrompt = `
      PROJECT GOAL: ${description}
      
      TECHNICAL SPECIFICATIONS:
      ${clarifications}
    `.trim();

    const safePrompt = finalPrompt.replace(/\r/g, "");

    // 2. Call Server Action
    const result = await triggerProvisioning(userId, safePrompt);

    if (result.success && result.url) {
      setFinalUrl(result.url);
      setStep('completed');
    } else {
      setError(result.error || "Provisioning failed");
      setStep('input'); // Reset or handle error state
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100">

      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <AnimatePresence mode="wait">

        {/* --- STEP 1: INPUT --- */}
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg relative z-10"
          >
            <Card className="bg-slate-900 border-slate-800 shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="text-blue-400 h-6 w-6" />
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">Agentic IDE</Badge>
                </div>
                <CardTitle className="text-white text-2xl">New Project</CardTitle>
                <CardDescription className="text-slate-400">
                  Describe what you want to build. Our Agent will handle the infrastructure.
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
                  <Textarea
                    placeholder="e.g. A Python Flask app that tracks stock prices using an external API..."
                    className="h-32 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleAnalyze}
                  disabled={!userId || !description}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-all"
                >
                  Analyze & Plan <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* --- STEP 2: ANALYZING LOADING --- */}
        {step === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-4 z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
              <Cpu className="h-16 w-16 text-blue-400 mx-auto animate-bounce relative z-10" />
            </div>
            <h2 className="text-xl font-semibold text-white">Consulting AI Architect...</h2>
            <p className="text-slate-400 text-sm">Analyzing requirements and tech stack options</p>
          </motion.div>
        )}

        {/* --- STEP 3: CLARIFICATION (MCQ) --- */}
        {step === 'clarification' && plan && (
          <motion.div
            key="clarification"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-2xl relative z-10"
          >
            <Card className="bg-slate-900 border-slate-800 shadow-2xl">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-xl">Technical Plan</CardTitle>
                    <CardDescription className="text-slate-400 mt-1">
                      {plan.analysis}
                    </CardDescription>
                  </div>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                    {plan.questions.length} Decisions Needed
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
                <Button variant="ghost" onClick={() => setStep('input')} className="text-slate-400">
                  Back
                </Button>
                <Button
                  onClick={handleProvision}
                  disabled={Object.keys(answers).length < plan.questions.length}
                  className="bg-green-600 hover:bg-green-500 text-white px-8"
                >
                  Start Provisioning <Server className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* --- STEP 4: PROVISIONING LOADING --- */}
        {step === 'provisioning' && (
          <motion.div
            key="provisioning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md relative z-10"
          >
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
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

                <div className="text-xs text-slate-500 bg-black/20 px-3 py-1 rounded-full">
                  Estimated time: 2-3 minutes
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* --- STEP 5: SUCCESS --- */}
        {step === 'completed' && finalUrl && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg relative z-10"
          >
            <Card className="bg-slate-900 border-green-900/50 shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)]">
              <CardHeader className="text-center">
                <div className="mx-auto bg-green-500/10 p-3 rounded-full w-fit mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-white">Environment Ready</CardTitle>
                <CardDescription className="text-slate-400">
                  Your temporary IDE has been deployed successfully.
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
                    <p className="font-semibold text-yellow-200">Credentials Required</p>
                    <p className="mt-1">If prompted for a password, use: <code className="bg-yellow-500/20 px-1 rounded">mypassword</code></p>
                  </div>
                </div>

              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => window.open(finalUrl, '_blank')}
                  className="w-full bg-green-600 hover:bg-green-500 text-white"
                >
                  Open IDE
                </Button>
              </CardFooter>
            </Card>

            <div className="text-center mt-6">
              <button onClick={() => { setStep('input'); setAnswers({}); setUserId(""); setDescription("") }} className="text-slate-500 hover:text-white text-sm transition-colors">
                Start New Project
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}
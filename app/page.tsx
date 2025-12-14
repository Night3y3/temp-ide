"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Step, PlanResponse } from "@/components/types";

// Import Modular Components
import { ProjectInput } from "@/components/ide/ProjectInput";
import { ClarificationForm } from "@/components/ide/ClarificationForm";
import { ProvisioningLoader } from "@/components/ide/ProvisioningLoader";
import { SuccessView } from "@/components/ide/SuccessView";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { LandingPage } from "@/components/landing/LandingPage";
import { triggerProvisioning, triggerTermination } from "@/actions/kestra";

export default function AgenticIDEPage() {
  const router = useRouter();
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [showLanding, setShowLanding] = useState(true);

  // State
  const [step, setStep] = useState<Step>('input');
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTerminating, setIsTerminating] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Auth handlers
  function handleAuthSuccess() {
    setIsAuthenticated(true);
    router.refresh();
  }

  // Handlers
  async function handleAnalyze() {
    if (!projectName || !description) return;
    setStep('analyzing');
    setError(null);

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

  async function handleProvision() {
    setStep('provisioning');

    try {
      // Create project in database first
      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          description: description,
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create project");
      }

      const { project } = await createRes.json();
      setProjectId(project.id);

      // Combine prompt + answers
      const clarifications = Object.entries(answers).map(([_, ans]) => `- ${ans}`).join("\n");
      const finalPrompt = `PROJECT GOAL: ${description}\nTECH SPECS:\n${clarifications}`;

      const safePrompt = finalPrompt.replace(/\r/g, "");
      const result = await triggerProvisioning(projectName, safePrompt, project.id);

      if (result.success && result.url) {
        setFinalUrl(result.url);
        setInstanceId(result.instanceId || null);
        setStep('completed');
      } else {
        setError(result.error || "Provisioning failed");
        setStep('input');
      }
    } catch (err: any) {
      setError(err.message || "Provisioning failed");
      setStep('input');
    }
  }

  async function handleTerminate() {
    if (!instanceId || !confirm("Are you sure?")) return;
    setIsTerminating(true);
    const res = await triggerTermination(instanceId);
    if (res.success) {
      // Update project status
      if (projectId) {
        await fetch(`/api/projects/${projectId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "terminated" }),
        });
      }
      alert("Environment Destroyed");
      handleReset();
    }
    setIsTerminating(false);
  }

  function handleReset() {
    setStep('input');
    setAnswers({});
    setProjectName("");
    setDescription("");
    setInstanceId(null);
    setFinalUrl(null);
    setProjectId(null);
  }

  // Animation Helper
  const animProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    );
  }

  // Show landing page or auth forms if not authenticated
  if (!isAuthenticated) {
    if (showLanding) {
      return (
        <main className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="relative z-10">
            <LandingPage
              onCreateAccount={() => {
                setShowLanding(false);
                setAuthMode("signup");
              }}
              onLogin={() => {
                setShowLanding(false);
                setAuthMode("login");
              }}
            />
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <button
          onClick={() => setShowLanding(true)}
          className="absolute top-4 left-4 text-slate-400 hover:text-white text-sm transition-colors z-20"
        >
          ← Back
        </button>
        <AnimatePresence mode="wait">
          {authMode === "login" ? (
            <motion.div key="login" {...animProps} className="z-10">
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToSignup={() => setAuthMode("signup")}
              />
            </motion.div>
          ) : (
            <motion.div key="signup" {...animProps} className="z-10">
              <SignupForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setAuthMode("login")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      {/* Navigation */}
      <div className="absolute top-4 right-4 z-20">
        <a
          href="/dashboard"
          className="text-slate-400 hover:text-white text-sm transition-colors"
        >
          Dashboard
        </a>
      </div>

      <AnimatePresence mode="wait">

        {step === 'input' && (
          <motion.div key="input" {...animProps} className="z-10">
            <ProjectInput
              projectName={projectName} setProjectName={setProjectName}
              description={description} setDescription={setDescription}
              onAnalyze={handleAnalyze} error={error}
            />
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div key="analyzing" {...animProps} className="text-center space-y-4 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
              <Cpu className="h-16 w-16 text-blue-400 mx-auto animate-bounce relative z-10" />
            </div>
            <h2 className="text-xl font-semibold text-white">Consulting AI Architect...</h2>
          </motion.div>
        )}

        {step === 'clarification' && plan && (
          <motion.div key="clarification" {...animProps} className="z-10">
            <ClarificationForm
              plan={plan}
              answers={answers}
              setAnswers={setAnswers}
              onBack={() => setStep('input')}
              onProvision={handleProvision}
            />
          </motion.div>
        )}

        {step === 'provisioning' && (
          <motion.div key="provisioning" {...animProps} className="z-10">
            <ProvisioningLoader />
          </motion.div>
        )}

        {step === 'completed' && finalUrl && (
          <motion.div key="completed" {...animProps} className="z-10">
            <SuccessView
              finalUrl={finalUrl}
              instanceId={instanceId}
              onReset={handleReset}
              onTerminate={handleTerminate}
              isTerminating={isTerminating}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}
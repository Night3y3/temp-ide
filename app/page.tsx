"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";
import { Step, PlanResponse } from "@/components/types";

// Import Modular Components
import { ProjectInput } from "@/components/ide/ProjectInput";
import { ClarificationForm } from "@/components/ide/ClarificationForm";
import { ProvisioningLoader } from "@/components/ide/ProvisioningLoader";
import { SuccessView } from "@/components/ide/SuccessView";
import { triggerProvisioning, triggerTermination } from "@/actions/kestra";

export default function AgenticIDEPage() {
  // State
  const [step, setStep] = useState<Step>('input');
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [instanceId, setInstanceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTerminating, setIsTerminating] = useState(false);

  // Handlers
  async function handleAnalyze() {
    if (!userId || !description) return;
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

    // Combine prompt + answers
    const clarifications = Object.entries(answers).map(([_, ans]) => `- ${ans}`).join("\n");
    const finalPrompt = `PROJECT GOAL: ${description}\nTECH SPECS:\n${clarifications}`;

    const safePrompt = finalPrompt.replace(/\r/g, "");
    const result = await triggerProvisioning(userId, safePrompt);

    if (result.success && result.url) {
      setFinalUrl(result.url);
      setInstanceId(result.instanceId || null);
      setStep('completed');
    } else {
      setError(result.error || "Provisioning failed");
      setStep('input');
    }
  }

  async function handleTerminate() {
    if (!instanceId || !confirm("Are you sure?")) return;
    setIsTerminating(true);
    const res = await triggerTermination(instanceId);
    if (res.success) {
      alert("Environment Destroyed");
      handleReset();
    }
    setIsTerminating(false);
  }

  function handleReset() {
    setStep('input');
    setAnswers({});
    setUserId("");
    setDescription("");
    setInstanceId(null);
    setFinalUrl(null);
  }

  // Animation Helper
  const animProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <AnimatePresence mode="wait">

        {step === 'input' && (
          <motion.div key="input" {...animProps} className="z-10">
            <ProjectInput
              userId={userId} setUserId={setUserId}
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
"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Code, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Setup",
    description: "Describe your project idea. Our AI generates starter code and sets up your development environment automatically.",
  },
  {
    icon: Code,
    title: "Single-File Starter",
    description: "Get a ready-to-run starter file in your preferred stack: Python, Node.js, Go, C++, Java, and more.",
  },
  {
    icon: Zap,
    title: "Cloud-Based IDE",
    description: "Access VS Code in your browser instantly. No local setup, no configuration—just start coding.",
  },
  {
    icon: LayoutDashboard,
    title: "Project Dashboard",
    description: "Manage all your IDE environments from one place. Track your projects and access them anytime.",
  },
];

export function Features() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Get Started in Minutes
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          From project idea to coding environment—no setup, no hassle.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                  <Icon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}


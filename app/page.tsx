"use client";

import { runKestraFlow } from "@/actions/kestra";
import { useState } from "react";

export default function TestKestraPage() {
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState(""); // State for the input
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTrigger() {
    if (!inputVal) return; // Don't run if empty

    setLoading(true);
    setResult(null);
    setError(null);

    // Pass the input value to the server action
    const response = await runKestraFlow(inputVal);

    if (response.success) {
      setResult(response.message);
    } else {
      setError(response.error);
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Kestra Input Test</h1>
          <p className="text-sm text-gray-500 mt-2">ID: bat_692293</p>
        </div>

        {/* --- INPUT FIELD --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message to Kestra
          </label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type something..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        {/* --- STATUS DISPLAY --- */}
        <div className="min-h-[80px] flex items-center justify-center bg-gray-900 rounded-md p-4 font-mono text-sm">
          {loading && <span className="text-yellow-400 animate-pulse">Sending data...</span>}
          {!loading && result && <span className="text-green-400">{result}</span>}
          {!loading && error && <span className="text-red-400">Error: {error}</span>}
          {!loading && !result && !error && <span className="text-gray-500 opacity-50">Output will appear here</span>}
        </div>

        {/* --- TRIGGER BUTTON --- */}
        <button
          onClick={handleTrigger}
          disabled={loading || !inputVal}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {loading ? "Processing..." : "Send to Kestra"}
        </button>
      </div>
    </main>
  );
}
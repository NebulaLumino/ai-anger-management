"use client";
import { useState } from "react";
import { marked } from "marked";

const FIELDS = [
  { id: "angerTriggers", label: "Anger Triggers", type: "textarea", placeholder: "What situations, people, or events trigger your anger?" },
  { id: "frequency", label: "Frequency of Episodes", type: "text", placeholder: "e.g., Daily, 3x per week, monthly" },
  { id: "severity", label: "Severity Level (1-10)", type: "text", placeholder: "e.g., 7" },
  { id: "physicalSymptoms", label: "Physical Symptoms", type: "textarea", placeholder: "e.g., Racing heart, clenched fists, raised voice" },
  { id: "previousAttempts", label: "Previous Attempts to Manage Anger", type: "textarea", placeholder: "What have you tried before?" },
  { id: "supportSystem", label: "Support System", type: "text", placeholder: "e.g., Family, friends, therapist, none" },
  { id: "courtOrdered", label: "Court-Ordered or Voluntary", type: "text", placeholder: "e.g., Voluntary, DUI-related, custody-related" },
];

export default function Home() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (id: string, val: string) => setForm((f) => ({ ...f, [id]: val }));

  const submit = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data.result || data.error || "No result returned.");
    } catch (e: unknown) {
      setResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="space-y-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950 border border-teal-800 text-teal-300 text-sm mb-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          AI-Powered · Mental Health
        </div>
        <h1 className="text-3xl font-bold text-white">Anger Management Plan Generator</h1>
        <p className="text-zinc-400">Generate structured anger management programs with AI</p>
      </div>

      <div className="bg-[#13131f] border border-[#2e2e45] rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 gap-5">
          {FIELDS.map((f) => (
            <div key={f.id} className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300" htmlFor={f.id}>{f.label}</label>
              {f.type === "textarea" ? (
                <textarea
                  id={f.id}
                  rows={3}
                  placeholder={f.placeholder}
                  value={form[f.id] || ""}
                  onChange={(e) => update(f.id, e.target.value)}
                  className="w-full bg-[#1e1e30] border border-[#2e2e45] rounded-lg px-3 py-2.5 text-sm text-[#ededf4] placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent resize-none"
                />
              ) : (
                <input
                  id={f.id}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.id] || ""}
                  onChange={(e) => update(f.id, e.target.value)}
                  className="w-full bg-[#1e1e30] border border-[#2e2e45] rounded-lg px-3 py-2.5 text-sm text-[#ededf4] placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors"
        >
          {loading ? "Generating..." : "Generate Anger Management Plan"}
        </button>
      </div>

      {result && (
        <div className="bg-[#13131f] border border-[#2e2e45] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#2e2e45]">
            <span className="text-sm font-medium text-zinc-300">Generated Output</span>
            <button onClick={copy} className="text-xs px-3 py-1.5 rounded-md bg-[#27273a] hover:bg-[#323250] text-zinc-400 hover:text-zinc-200 transition-colors">
              {copied ? "✓ Copied" : "Copy Markdown"}
            </button>
          </div>
          <div className="p-5 text-sm text-zinc-300 leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked(result) as string }} />
        </div>
      )}
    </main>
  );
}

"use client";

import { useState } from 'react';

const EXAMPLES = [
      "I screamed at my coworker over a minor mistake and feel guilty",
      "Got cut off in traffic and felt rage I couldn't control",
      "My teenager didn't listen and I lost my temper badly"
    ];

export default function HomePage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Array<{ input: string; response: string }>>([]);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  const handleSubmit = async (e: React.FormEvent, customInput?: string) => {
    e.preventDefault();
    const text = customInput || input;
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResponse('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResponse(data.result);
      setHistory(prev => [{ input: text, response: data.result }, ...prev.slice(0, 9)]);
      setInput('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const accent = 'orange';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-${accent}-500/20 border border-${accent}-500/30 flex items-center justify-center`}>
            <svg className={`w-5 h-5 text-${accent}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-lg">Anger Management & Emotional Regulation</h1>
            <p className="text-xs text-gray-400">Understand your triggers and build lasting emotional regulation skills</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Tab Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'new' ? `bg-${accent}-500/20 text-${accent}-300 border border-${accent}-500/30` : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'}`}
          >
            New Session
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? `bg-${accent}-500/20 text-${accent}-300 border border-${accent}-500/30` : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'}`}
          >
            History ({history.length})
          </button>
        </div>

        {activeTab === 'new' ? (
        <>
          {/* Example Prompts */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Try an example</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex: string, i: number) => (
                <button
                  key={i}
                  onClick={(e) => handleSubmit(e, ex)}
                  className={`px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all text-left line-clamp-2 max-w-xs`}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Main Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe an anger episode
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What happened? What triggered the anger? How intense was it?"
                rows={5}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-${accent}-500/50 focus:ring-2 focus:ring-${accent}-500/20 resize-none transition-all`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl font-semibold bg-${accent}-600 hover:bg-${accent}-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get AI Insight
                </>
              )}
            </button>
          </form>
        </>
        ) : (
        /* History View */
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No sessions yet. Start a new one above.</p>
            </div>
          ) : (
            history.map((item, i) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                  <p className="text-xs text-gray-400 truncate">{item.input}</p>
                </div>
                <div className="p-4">
                  <div className="text-gray-200 text-sm whitespace-pre-wrap">{item.response}</div>
                </div>
              </div>
            ))
          )}
        </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Response */}
        {response && activeTab === 'new' && (
          <div className={`rounded-xl bg-white/5 border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`px-4 py-3 bg-${accent}-500/10 border-b border-${accent}-500/20 flex items-center gap-2`}>
              <div className={`w-2 h-2 rounded-full bg-${accent}-400 animate-pulse`} />
              <span className={`text-sm font-medium text-${accent}-300`}>AI Response</span>
            </div>
            <div className="p-6">
              <pre className="text-gray-200 text-sm whitespace-pre-wrap font-sans">{response}</pre>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-xs text-amber-200/70 leading-relaxed">
            <strong>Note:</strong> This tool is for self-help and educational purposes only, not a replacement for professional therapy or medical advice. If you&apos;re in crisis, please contact a mental health professional or crisis helpline.
          </p>
        </div>
      </main>
    </div>
  );
}

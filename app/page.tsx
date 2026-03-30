'use client';

import { useState } from 'react';

const ACCENT_H = 225;
const ACCENT_CSS = `hsl(${ACCENT_H}, 70%, 55%)`;
const ACCENT_CSS_LIGHT = `hsl(${ACCENT_H}, 70%, 75%)`;
const ACCENT_CSS_BG = `hsl(${ACCENT_H}, 70%, 12%)`;

export default function AngerManagementPage() {
  const [angerPatterns, setAngerPatterns] = useState('');
  const [triggers, setTriggers] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput('');
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ angerPatterns, triggers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setOutput(data.output);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: ACCENT_CSS_BG, border: `1px solid ${ACCENT_CSS}` }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={ACCENT_CSS}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span style={{ color: ACCENT_CSS }}>AI</span> Anger Management Toolkit
          </h1>
          <p className="text-gray-400 text-base">
            Technique selector and trigger journal — get anger management techniques suited to your style and a journal template.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your anger patterns{' '}
              <span className="text-gray-500 font-normal">(how does anger show up for you?)</span>
            </label>
            <textarea
              value={angerPatterns}
              onChange={(e) => setAngerPatterns(e.target.value)}
              placeholder="e.g. I explode and yell, I go silent and withdrawn, I get sarcastic, I hold it in until I snap..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Known triggers{' '}
              <span className="text-gray-500 font-normal">(what sets off your anger?)</span>
            </label>
            <textarea
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              placeholder="e.g. being interrupted, unfair treatment, feeling disrespected, traffic, being micromanaged..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: loading ? ACCENT_CSS_BG : ACCENT_CSS }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Building your toolkit...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Generate My Anger Management Plan
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
            {error}
          </div>
        )}

        {output && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: ACCENT_CSS_BG, backgroundColor: `${ACCENT_CSS_BG}80` }}>
            <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: `${ACCENT_CSS}30` }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACCENT_CSS }} />
              <span className="text-sm font-medium" style={{ color: ACCENT_CSS_LIGHT }}>Anger Management Techniques & Trigger Journal</span>
            </div>
            <div className="p-6 prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-gray-200">
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

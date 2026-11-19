"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface Distortion {
  id: string;
  name: string;
  prompt: string;
  example: string;
}

const DISTORTIONS: Distortion[] = [
  {
    id: "catastrophizing",
    name: "Catastrophizing",
    prompt: "Assuming the worst-case scenario will inevitably happen.",
    example: "'If this meeting goes poorly, I will be fired and lose everything.'",
  },
  {
    id: "all_or_nothing",
    name: "All-or-Nothing Thinking",
    prompt: "Viewing situations in black-and-white categories with zero middle ground.",
    example: "'If I'm not totally flawless, I am a complete failure.'",
  },
  {
    id: "mind_reading",
    name: "Mind Reading",
    prompt: "Assuming you know others are judging or disliking you without evidence.",
    example: "'They didn't reply immediately, so they must think I'm annoying.'",
  },
  {
    id: "emotional_reasoning",
    name: "Emotional Reasoning",
    prompt: "Believing that because you feel something intensely, it must be an objective truth.",
    example: "'I feel overwhelmed and anxious, therefore disaster is imminent.'",
  },
  {
    id: "should_statements",
    name: "Should / Must Statements",
    prompt: "Demanding unrealistic perfection from yourself with punitive 'shoulds'.",
    example: "'I should never struggle with anxiety. I should be stronger.'",
  },
  {
    id: "overgeneralization",
    name: "Overgeneralization",
    prompt: "Taking a single negative event as an endless pattern of defeat.",
    example: "'Nothing ever works out for me.'",
  },
];

export function ThoughtReframerTool() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [situation, setSituation] = useState("");
  const [selectedDistortion, setSelectedDistortion] = useState<string>("catastrophizing");
  const [reframe, setReframe] = useState("");
  const [copied, setCopied] = useState(false);

  const activeDistortion =
    DISTORTIONS.find((d) => d.id === selectedDistortion) || DISTORTIONS[0];

  const handleCopy = () => {
    const textToCopy = `Situation / Loop: ${situation}\nCognitive Distortion: ${activeDistortion.name}\nBalanced Reframe: ${reframe}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setStep(1);
    setSituation("");
    setSelectedDistortion("catastrophizing");
    setReframe("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl border border-teal-200/80 bg-white/90 p-6 sm:p-10 shadow-xl backdrop-blur-md dark:border-teal-900/50 dark:bg-zinc-900/90">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          {[
            { num: 1, label: "Automatic Thought" },
            { num: 2, label: "Identify Distortion" },
            { num: 3, label: "Rational Reframe" },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                if (s.num === 1) setStep(1);
                if (s.num === 2 && situation.trim()) setStep(2);
                if (s.num === 3 && situation.trim()) setStep(3);
              }}
              className={`flex items-center gap-2 text-xs font-semibold cursor-pointer ${step === s.num
                ? "text-teal-700 dark:text-teal-300 font-bold"
                : step > s.num
                  ? "text-zinc-600 dark:text-zinc-400"
                  : "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${step === s.num
                  ? "bg-teal-600 text-white shadow-sm"
                  : step > s.num
                    ? "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                  }`}
              >
                {step > s.num ? "✓" : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Step 1: The Situation & Automatic Thought */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Step 1 of 3
            </span>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Externalize the looping thought or worry
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Write down the exact thought that is causing anxiety or distress without editing yourself.
            </p>
          </div>

          <div className="relative">
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="e.g. 'I made a mistake in the presentation today and I feel like everyone noticed and thinks I don't know what I'm doing...'"
              rows={4}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-500/50 p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500/10 focus:bg-zinc-100/10 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100 dark:focus:border-teal-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              disabled={!situation.trim()}
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-teal-500/20 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Continue to Step 2: Unmask Distortion</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Identify Distortion */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Step 2 of 3
            </span>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Which cognitive distortion is at play?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Our brains take cognitive shortcuts when anxious. Select the distortion that best matches your thought.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DISTORTIONS.map((d) => {
              const isSelected = selectedDistortion === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDistortion(d.id)}
                  className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${isSelected
                    ? "border-teal-500 bg-teal-50/80 dark:border-teal-600 dark:bg-teal-950/40 ring-2 ring-teal-500/20"
                    : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {d.name}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {d.prompt}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              &larr; Back to Thought
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-teal-500/20 hover:bg-teal-700 transition-all cursor-pointer"
            >
              <span>Continue to Step 3: Formulate Reframe</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Rational Reframe */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              Step 3 of 3
            </span>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Construct an evidence-grounded reframe
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Replace the distortion with a compassionate, realistic perspective based on facts rather than fear.
            </p>
          </div>

          {/* Context Summary Card */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/60 space-y-2">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              <span className="font-bold text-zinc-700 dark:text-zinc-300">Original Thought:</span> &quot;{situation}&quot;
            </div>
            <div className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
              <span>Identified Distortion: {activeDistortion.name}</span>
            </div>
          </div>

          {/* Reframe Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
              <span>Your Balanced Counter-Perspective:</span>
              <span className="text-[11px] font-normal text-zinc-400">
                Ask: &quot;What would I tell a close friend who had this exact thought?&quot;
              </span>
            </label>
            <textarea
              value={reframe}
              onChange={(e) => setReframe(e.target.value)}
              placeholder="e.g. 'One minor slip in a meeting does not define my overall capability. Nobody commented on it, and fatigue made me hyper-vigilant rather than factually incompetent.'"
              rows={4}
              className="w-full rounded-2xl border border-teal-200 bg-white p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-teal-900/60 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              &larr; Change Distortion
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!reframe.trim()}
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy Reframe"}</span>
              </button>

              <Link
                href="/offload"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-teal-500/20 hover:bg-teal-700 transition-all"
              >
                <span>Save to Brain Dump</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

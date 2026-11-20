"use client";

import React, { useState, useEffect } from "react";
import { Wind, Play, Pause, RotateCcw, Sparkles, Volume2, VolumeX, Moon } from "lucide-react";

type BreathingPattern = "box" | "478" | "calm";

interface PatternConfig {
  name: string;
  badge: string;
  description: string;
  phases: { name: string; duration: number; instruction: string; color: string }[];
}

const PATTERNS: Record<BreathingPattern, PatternConfig> = {
  box: {
    name: "Box Breathing (4-4-4-4)",
    badge: "Navy SEAL Grounding",
    description: "Equal duration inhale, hold, exhale, and rest to stabilize nervous system stress.",
    phases: [
      { name: "Inhale", duration: 4, instruction: "Breathe in deeply through your nose...", color: "from-teal-400 to-emerald-500" },
      { name: "Hold", duration: 4, instruction: "Hold your breath gently with lungs filled...", color: "from-emerald-400 to-cyan-500" },
      { name: "Exhale", duration: 4, instruction: "Release breath slowly through your mouth...", color: "from-cyan-400 to-indigo-500" },
      { name: "Rest", duration: 4, instruction: "Pause and rest before your next breath...", color: "from-indigo-400 to-teal-500" },
    ],
  },
  "478": {
    name: "4-7-8 Relaxing Breath",
    badge: "Nocturnal Sleep & Panic",
    description: "Extended hold and long exhale to activate deep parasympathetic nervous system response.",
    phases: [
      { name: "Inhale", duration: 4, instruction: "Inhale quietly through your nose...", color: "from-teal-400 to-cyan-500" },
      { name: "Hold", duration: 7, instruction: "Hold breath comfortably, keeping shoulders soft...", color: "from-cyan-400 to-indigo-600" },
      { name: "Exhale", duration: 8, instruction: "Exhale completely through mouth with a gentle whoosh...", color: "from-indigo-500 to-purple-600" },
    ],
  },
  calm: {
    name: "Calm Pacing (4-6)",
    badge: "Heart Rate Deceleration",
    description: "Prolonged exhale to trigger the vagus nerve and slow heart rate.",
    phases: [
      { name: "Inhale", duration: 4, instruction: "Gentle inhale expanding lower ribs...", color: "from-teal-400 to-emerald-500" },
      { name: "Exhale", duration: 6, instruction: "Slow, steady exhale emptying lungs...", color: "from-emerald-500 to-teal-600" },
    ],
  },
};

export function BoxBreathingTool() {
  const [patternKey, setPatternKey] = useState<BreathingPattern>("box");
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const currentPattern = PATTERNS[patternKey];
  const [secondsLeft, setSecondsLeft] = useState(currentPattern.phases[0].duration);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const currentPhase = currentPattern.phases[phaseIndex];

  useEffect(() => {
    setPhaseIndex(0);
    setSecondsLeft(PATTERNS[patternKey].phases[0].duration);
    setIsActive(false);
  }, [patternKey]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            const nextIdx = (phaseIndex + 1) % currentPattern.phases.length;
            if (nextIdx === 0) {
              setCyclesCompleted((c) => c + 1);
            }
            setPhaseIndex(nextIdx);
            return currentPattern.phases[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, phaseIndex, currentPattern]);

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsLeft(currentPattern.phases[0].duration);
  };

  // Visual expansion scaling
  let scaleClass = "scale-100";
  if (isActive) {
    if (currentPhase.name === "Inhale") scaleClass = "scale-130 duration-4000 ease-out";
    else if (currentPhase.name === "Hold") scaleClass = "scale-130 duration-1000";
    else if (currentPhase.name === "Exhale") scaleClass = "scale-85 duration-4000 ease-in";
    else if (currentPhase.name === "Rest") scaleClass = "scale-85 duration-1000";
  }

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl border border-teal-200/80 bg-white/80 p-6 sm:p-10 shadow-xl backdrop-blur-md dark:border-teal-900/50 dark:bg-zinc-900/80">
      {/* Pattern Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {(Object.keys(PATTERNS) as BreathingPattern[]).map((key) => {
          const pat = PATTERNS[key];
          const isSelected = patternKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setPatternKey(key)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {pat.name}
            </button>
          );
        })}
      </div>

      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-0.5 text-[11px] font-bold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 mb-2">
          <Sparkles className="h-3 w-3" />
          {currentPattern.badge}
        </span>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          {currentPattern.description}
        </p>
      </div>

      {/* Main Breathing Circle Animation */}
      <div className="my-8 sm:my-12 flex flex-col items-center justify-center">
        <div className="relative flex h-64 w-64 items-center justify-center">
          {/* Animated Glow Rings */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr ${currentPhase.color} opacity-25 blur-2xl transition-transform duration-1000 ${
              isActive ? "animate-pulse" : ""
            }`}
          />

          {/* Expanding / Contracting Orb */}
          <div
            className={`absolute h-52 w-52 rounded-full border-2 border-teal-400/60 bg-gradient-to-br from-teal-100/60 via-emerald-50/40 to-cyan-100/60 transition-transform ${scaleClass} dark:border-teal-600/60 dark:from-teal-950/50 dark:via-zinc-900/60 dark:to-cyan-950/50 shadow-inner`}
          />

          {/* Center Text */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-black tracking-tight text-teal-950 dark:text-teal-50">
              {isActive ? `${secondsLeft}s` : `${currentPattern.phases[0].duration}s`}
            </span>
            <span className="mt-2 text-sm font-bold tracking-widest uppercase text-teal-700 dark:text-teal-300">
              {isActive ? currentPhase.name : "Ready"}
            </span>
          </div>
        </div>

        {/* Phase Instruction Text */}
        <p className="mt-8 text-center text-sm font-medium text-zinc-700 dark:text-zinc-200 min-h-[2rem] px-4 max-w-sm">
          {isActive
            ? currentPhase.instruction
            : "Click 'Begin Exercise' to start calming your nervous system."}
        </p>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Cycles completed:{" "}
          <strong className="text-base text-teal-700 dark:text-teal-300 font-bold">
            {cyclesCompleted}
          </strong>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
              isActive
                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-500/25"
                : "bg-teal-600 hover:bg-teal-700 shadow-teal-500/25 hover:scale-105"
            }`}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Begin Exercise</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

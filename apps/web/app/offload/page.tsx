"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { UserButton } from "@/components/auth/user-button";
import { CrisisModal } from "@/components/mental-health/crisis-modal";
import { BrainDumpCanvas } from "@/components/mental-health/brain-dump-canvas";
import { OffloadHistory } from "@/components/mental-health/offload-history";
import { DynamicInsights } from "@/components/mental-health/dynamic-insights";
import { BreathingWidget } from "@/components/mental-health/breathing-widget";
import {
  Heart,
  ArrowLeft,
  PhoneCall,
  Wind,
  Brain,
  Bookmark,
  Sparkles,
  PenTool,
} from "lucide-react";

export default function OffloadPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"dump" | "history" | "insights">("dump");
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);


  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-teal-500 selection:text-white">
      {/* Crisis Modal */}
      <CrisisModal isOpen={isCrisisModalOpen} onClose={() => setIsCrisisModalOpen(false)} />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/85 px-4 sm:px-6 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
        <div className="mx-auto flex max-w-6xl flex-col md:flex-row md:items-center justify-between py-2.5 sm:py-3 gap-2.5">
          {/* Top Row on Mobile: Logo & Quick Actions */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2 sm:gap-3">

              <div className="hidden sm:block h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />

              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-sm shadow-teal-500/20 cursor-pointer">
                  <Link href="/">
                    <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Link>
                </div>
                <span className="hidden sm:inline text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Rewire
                </span>
                <span className="hidden sm:inline-flex rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
                  Mental Offloading
                </span>
              </div>
            </div>

            {/* Right Quick Actions (visible on mobile top bar) */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
              <button
                onClick={() => setShowBreathing(!showBreathing)}
                className="inline-flex items-center gap-1 rounded-xl border border-teal-200 bg-teal-50/70 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300"
                title="Toggle Box Breathing"
              >
                <Wind className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span className="text-[11px]">Breathe</span>
              </button>

              {session?.user && <UserButton />}
            </div>
          </div>

          {/* Navigation Tabs (Centered on desktop, horizontal scroll on mobile) */}
          <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-100/90 p-1 dark:border-zinc-800 dark:bg-zinc-900/90 overflow-x-auto max-w-full justify-start sm:justify-center">
            <button
              onClick={() => setActiveTab("dump")}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === "dump"
                ? "bg-white text-teal-700 shadow-sm dark:bg-zinc-800 dark:text-teal-300"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
            >
              <PenTool className="h-3.5 w-3.5" />
              <span>Brain Dump</span>
            </button>

            {session?.user && (
              <>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === "history"
                    ? "bg-white text-teal-700 shadow-sm dark:bg-zinc-800 dark:text-teal-300"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span>Journal History</span>
                </button>

                <button
                  onClick={() => setActiveTab("insights")}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === "insights"
                    ? "bg-white text-teal-700 shadow-sm dark:bg-zinc-800 dark:text-teal-300"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Cognitive Insights</span>
                </button>
              </>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => setShowBreathing(!showBreathing)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/70 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-900/80 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 transition-colors"
              title="Toggle Box Breathing"
            >
              <Wind className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>Breathe</span>
            </button>

            <button
              onClick={() => setIsCrisisModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-900/80 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>988 Lifeline</span>
            </button>

            {session?.user && <UserButton />}
          </div>
        </div>
      </header>

      {/* Floating Breathing Widget Drawer when opened */}
      {showBreathing && (
        <div className="border-b border-teal-200/80 bg-teal-50/50 p-6 backdrop-blur dark:border-teal-900/60 dark:bg-teal-950/30">
          <div className="mx-auto max-w-sm flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
                Grounding Box Breathing
              </span>
              <button
                onClick={() => setShowBreathing(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Hide
              </button>
            </div>
            <BreathingWidget />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        {activeTab === "dump" ? (
          <div>
            {/* Header intro */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-medium text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>Cognitive Offloading & Reframing</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                Dump Your Mind. <br />
                <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Reclaim Mental Clarity.
                </span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-lg mx-auto">
                Write down everything you are worrying about, overthinking, or needing to do onto the paper below without editing yourself. Getting it out of your head reduces mental clutter.
              </p>
            </div>

            <BrainDumpCanvas />
          </div>
        ) : activeTab === "history" ? (

          <div className="max-w-4xl mx-auto">
            <OffloadHistory onClose={() => setActiveTab("dump")} />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <DynamicInsights />
          </div>
        )}
      </main>


      {/* Clinical Footer */}
      <footer className="border-t border-zinc-200/80 bg-white/70 py-6 px-6 text-center text-xs text-zinc-400 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:text-zinc-500">
        <p className="max-w-3xl mx-auto">
          <strong>Clinical Note:</strong> Brain dumping and cognitive reframing are evidence-informed grounding techniques to interrupt overthinking and relieve acute overwhelm. Rewire is an AI companion and does not provide clinical diagnosis or emergency medical care.
        </p>
      </footer>
    </div>
  );
}

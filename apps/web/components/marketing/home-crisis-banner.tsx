"use client";

import React, { useState } from "react";
import { useUserRegion } from "@/lib/use-user-region";
import { CrisisModal } from "@/components/mental-health/crisis-modal";
import { LifeBuoy, PhoneCall } from "lucide-react";

export function HomeCrisisBanner() {
  const { regionData } = useUserRegion();
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  return (
    <>
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
      <section className="bg-rose-50/60 border-t border-rose-200/60 py-12 dark:bg-rose-950/20 dark:border-rose-900/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 mb-3">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Need immediate professional support?
          </h2>
          <p className="mt-2 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            If you are in acute distress, free and confidential support is available 24/7. In{" "}
            {regionData.countryName} ({regionData.flag}), call{" "}
            <strong>{regionData.primaryHelplineName}</strong> at{" "}
            <strong>{regionData.primaryNumber}</strong>, or connect with our international crisis
            network.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={regionData.primaryAction}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>
                Call {regionData.primaryNumber} ({regionData.countryName})
              </span>
            </a>
            <button
              type="button"
              onClick={() => setIsCrisisModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-white px-5 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/60 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <span>Switch Country / Directory</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

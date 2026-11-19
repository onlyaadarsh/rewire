"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { MessageSquare, ArrowRight } from "lucide-react";

export function HeroActions() {
  const { data: session, isPending } = useSession();

  return (
    <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row w-full">
      {isPending ? (
        <div className="h-12 w-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      ) : session?.user ? (
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/chat"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-7 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:from-teal-500 hover:to-emerald-500 hover:shadow-teal-500/35"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Continue Your Conversation</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/sign-in"
            className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 sm:px-7 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:from-teal-500 hover:to-emerald-500 hover:shadow-teal-500/35"
          >
            <span>Begin Free Confidential Reflection</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

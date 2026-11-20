import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { BoxBreathingTool } from "./box-breathing-tool";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Wind,
  ShieldCheck,
  CheckCircle2,
  Brain,
  Sparkles,
  ArrowRight,
  PenTool,
  Clock,
  Heart,
  ChevronDown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Box Breathing Online — Free 4-4-4-4 Anxiety & Panic Timer | HeyRewire",
  description:
    "Practice guided 4-4-4-4 box breathing online to calm acute anxiety, lower heart rate, and clear mental fog. Free in-browser breathing timer with zero sign-up.",
  keywords: [
    "box breathing online",
    "box breathing technique timer",
    "4 7 8 breathing technique timer",
    "calm anxiety breathing exercise",
    "navy seal breathing method online",
    "vagus nerve stimulation breathing",
    "stop panic attack breathing",
  ],
  alternates: {
    canonical: "/tools/box-breathing",
  },
  openGraph: {
    type: "website",
    url: "https://heyrewire.com/tools/box-breathing",
    title: "Box Breathing Online — Free 4-4-4-4 Anxiety & Panic Timer",
    description:
      "Interactive 4-4-4-4 box breathing guide to halt racing thoughts, lower physiological panic, and restore inner equilibrium.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Box Breathing Online - HeyRewire",
      },
    ],
  },
};

const boxBreathingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://heyrewire.com/tools/box-breathing#app",
      name: "Box Breathing Online Timer & Pacing Tool",
      url: "https://heyrewire.com/tools/box-breathing",
      applicationCategory: "HealthApplication",
      operatingSystem: "All modern web browsers",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Interactive 4-4-4-4 Box Breathing visual cadence",
        "4-7-8 Deep sleep and acute panic breathing mode",
        "Parasympathetic vagus nerve regulation pacer",
        "100% free with no sign-in or installation required",
      ],
      description:
        "Free interactive box breathing pacer with 4-4-4-4 and 4-7-8 breathing patterns designed to slow heart rate and halt anxiety spirals.",
    },
    {
      "@type": "HowTo",
      "@id": "https://heyrewire.com/tools/box-breathing#howto",
      name: "How to Practice 4-4-4-4 Box Breathing",
      description:
        "A clinically supported four-step breathing routine used by athletes, therapists, and Navy SEALs to lower cortisol and re-center focus.",
      totalTime: "PT4M",
      step: [
        {
          "@type": "HowToStep",
          name: "Step 1: Slow Inhalation",
          text: "Inhale slowly and deeply through your nose for a count of 4 seconds, feeling your diaphragm and ribcage expand.",
        },
        {
          "@type": "HowToStep",
          name: "Step 2: Gentle Hold",
          text: "Hold your breath smoothly with filled lungs for 4 seconds without straining your throat or tensing your shoulders.",
        },
        {
          "@type": "HowToStep",
          name: "Step 3: Controlled Exhalation",
          text: "Exhale gently through your mouth for 4 seconds, releasing tension and fully emptying your lungs.",
        },
        {
          "@type": "HowToStep",
          name: "Step 4: Rest and Pause",
          text: "Hold your lungs comfortably empty for 4 seconds before starting the next gentle inhale.",
        },
      ],
    },
  ],
};

const BOX_BREATHING_FAQS = [
  {
    q: "What is Box Breathing (Square Breathing)?",
    a: "Box Breathing, also known as square breathing or four-square breathing, is a deep breathing technique where you inhale, hold, exhale, and hold for equal counts of 4 seconds each. It creates a symmetrical four-part cycle that signals your autonomic nervous system to exit fight-or-flight mode.",
  },
  {
    q: "How does Box Breathing stop anxiety and panic attacks?",
    a: "During anxiety, shallow hyperventilation triggers sympathetic arousal. Box breathing stimulates the vagus nerve, which immediately increases parasympathetic nervous activity, lowers heart rate, balances oxygen and CO2 levels in the bloodstream, and halts the adrenaline feedback loop.",
  },
  {
    q: "How many cycles should I do to feel relief?",
    a: "Most people report noticeable physiological decompression within 4 to 6 cycles (approximately 2 to 3 minutes). Doing 10 cycles (about 4 minutes) provides sustained mental clarity and physical relaxation.",
  },
  {
    q: "Can I do Box Breathing while trying to sleep?",
    a: "Yes. For sleep, you can use either standard 4-4-4-4 Box Breathing or switch to the 4-7-8 pattern in our tool above. The prolonged exhalation slows cardiovascular pulse and prepares the brain for theta wave transition into rest.",
  },
];

export default function BoxBreathingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-teal-500 selection:text-white">
      <JsonLd data={boxBreathingJsonLd} />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl dark:from-teal-500/10 dark:via-emerald-500/5" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-semibold text-teal-800 backdrop-blur-sm dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 mb-6">
              <Wind className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>Interactive Nervous System Regulation Tool</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl leading-tight">
              Box Breathing Online <br />
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Calm Acute Anxiety &amp; Panic
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Use this free interactive box breathing timer to lower cortisol, steady your pulse, and ground racing thoughts in under 3 minutes. No apps or sign-up needed.
            </p>
          </div>
        </section>

        {/* Interactive Tool Container */}
        <section className="pb-16 md:pb-24 px-4 sm:px-6">
          <BoxBreathingTool />
        </section>

        {/* Clinical Deep Dive & Instructions */}
        <section className="border-t border-zinc-200/80 bg-white py-16 md:py-20 dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                The Science of Grounding
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
                Why 4-4-4-4 Box Breathing Works So Rapidly
              </h2>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                When you experience anxiety, nocturnal overthinking, or sensory overload, the amygdala fires rapid survival signals. Your breathing becomes shallow, expelling excess carbon dioxide and tricking your physiology into an adrenaline-fueled panic loop.
              </p>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Box Breathing (popularized by Navy SEALs and frontline trauma therapists) directly stimulates the <strong>Vagus Nerve</strong>. The equal 4-second hold phases re-normalize arterial blood gas levels and shift your brainwaves into an alpha state of focused calm.
              </p>
            </div>

            {/* 4-Step Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center gap-2 font-bold text-teal-700 dark:text-teal-400 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-xs dark:bg-teal-950 dark:text-teal-300">1</span>
                  <span>Inhale (4 Seconds)</span>
                </div>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Breathe in smoothly through your nose into the bottom of your lungs. Allow your stomach to gently push outwards while keeping your chest relaxed.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center gap-2 font-bold text-teal-700 dark:text-teal-400 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-xs dark:bg-teal-950 dark:text-teal-300">2</span>
                  <span>Hold Full (4 Seconds)</span>
                </div>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Keep your breath trapped gently without clamping down on your glottis. Maintain soft facial muscles and drop your shoulders away from your ears.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center gap-2 font-bold text-teal-700 dark:text-teal-400 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-xs dark:bg-teal-950 dark:text-teal-300">3</span>
                  <span>Exhale (4 Seconds)</span>
                </div>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Part your lips slightly and exhale completely. Picture all physical tension and knotting in your chest dissipating with the air stream.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center gap-2 font-bold text-teal-700 dark:text-teal-400 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-xs dark:bg-teal-950 dark:text-teal-300">4</span>
                  <span>Rest Empty (4 Seconds)</span>
                </div>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Wait 4 seconds in the stillness before your next inhalation. This brief pause breaks frantic hyperventilation loops.
                </p>
              </div>
            </div>

            {/* Practical Pairing CTA */}
            <div className="rounded-3xl border border-teal-200 bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 p-6 sm:p-8 dark:border-teal-900/50 dark:from-teal-950/40 dark:via-zinc-900 dark:to-cyan-950/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                    <PenTool className="h-3.5 w-3.5" />
                    <span>Next Step: Untangle The Thought</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Nervous system calm? Now offload what triggered it.
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-xl">
                    Breathing regulates the physical body. Cognitive Reframing resolves the mental loop. Externalize what is bothering you onto our private Brain Dump canvas.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link
                    href="/tools/thought-reframer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-700 transition-colors"
                  >
                    <span>CBT Thought Reframer</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/offload"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-300 bg-white px-5 py-2.5 text-xs font-semibold text-teal-800 dark:text-teal-400 hover:bg-teal-700/20 dark:border-teal-800 dark:bg-zinc-900 dark:text-teal-300 transition-colors"
                  >
                    <span>Brain Dump</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Accessible FAQs */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Frequently Asked Questions About Box Breathing
              </h3>
              {BOX_BREATHING_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 transition-all dark:border-zinc-800/80 dark:bg-zinc-900/40 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between text-left font-semibold text-zinc-900 dark:text-zinc-100 text-sm select-none">
                    <span className="pr-4">{faq.q}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

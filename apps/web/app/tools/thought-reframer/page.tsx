import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { ThoughtReframerTool } from "./thought-reframer-tool";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  Wind,
  PenTool,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CBT Thought Record Online — Free Cognitive Reframing Tool | HeyRewire",
  description:
    "Challenge negative thought loops with our free interactive CBT thought record tool. Identify cognitive distortions, untangle catastrophizing, and formulate evidence-based reframes.",
  keywords: [
    "cbt thought record online",
    "cbt thought record",
    "cognitive reframing exercises",
    "catastrophizing examples and how to stop",
    "all or nothing thinking examples",
    "digital thought challenging worksheet",
    "cognitive distortions list cbt",
  ],
  alternates: {
    canonical: "/tools/thought-reframer",
  },
  openGraph: {
    type: "website",
    url: "https://heyrewire.com/tools/thought-reframer",
    title: "CBT Thought Record Online — Free Cognitive Reframing Tool",
    description:
      "Interactive 3-step cognitive reframing tool to isolate automatic thoughts, unmask distortions, and cultivate balanced mental clarity.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CBT Thought Record Online - HeyRewire",
      },
    ],
  },
};

const thoughtReframerJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://heyrewire.com/tools/thought-reframer#app",
      name: "CBT Thought Record & Cognitive Reframing Tool",
      url: "https://heyrewire.com/tools/thought-reframer",
      applicationCategory: "HealthApplication",
      operatingSystem: "All modern web browsers",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "3-Step interactive Cognitive Behavioral Therapy (CBT) thought challenge",
        "Distortion detector: Catastrophizing, All-or-nothing, Mind reading",
        "Evidence-based reframe formulation guide",
        "100% private, client-side reflection canvas",
      ],
      description:
        "Free in-browser cognitive behavioral thought record tool designed to isolate irrational distortions and rebuild balanced self-talk.",
    },
    {
      "@type": "HowTo",
      "@id": "https://heyrewire.com/tools/thought-reframer#howto",
      name: "How to Reframe an Overthinking Spiral Using CBT",
      description:
        "A proven 3-step cognitive reframing framework to challenge negative automated thoughts and reduce emotional distress.",
      totalTime: "PT5M",
      step: [
        {
          "@type": "HowToStep",
          name: "Step 1: Write Down the Automatic Thought",
          text: "Capture the raw, unfiltered worry verbatim without editing or self-censoring.",
        },
        {
          "@type": "HowToStep",
          name: "Step 2: Isolate the Cognitive Distortion",
          text: "Identify which mental filter is warping reality, such as catastrophizing, should-statements, or black-and-white thinking.",
        },
        {
          "@type": "HowToStep",
          name: "Step 3: Construct an Evidence-Based Counter-Perspective",
          text: "Evaluate facts over feelings and write a balanced, compassionate alternative thought that reflects objective reality.",
        },
      ],
    },
  ],
};

const THOUGHT_REFRAME_FAQS = [
  {
    q: "What is a CBT Thought Record?",
    a: "A CBT (Cognitive Behavioral Therapy) Thought Record is a structured psychological worksheet used to track, challenge, and replace maladaptive thinking patterns. By externalizing thoughts onto paper or screen, you disengage from emotional fusion and examine beliefs objectively.",
  },
  {
    q: "Does reframing mean 'toxic positivity'?",
    a: "No. Cognitive reframing is not about pretending everything is fine or repeating generic affirmations. It is about realism and nuance—replacing extreme, distorted assumptions ('I am doomed') with factual, compassionate, actionable perspectives ('This is difficult, but I have managed tough situations before and have actionable steps I can take').",
  },
  {
    q: "What are the most common cognitive distortions?",
    a: "The most frequent cognitive traps include Catastrophizing (expecting catastrophe), All-or-Nothing Thinking (black-and-white extremism), Mind Reading (assuming negative judgments from others), Emotional Reasoning (equating feelings with reality), and Should Statements (punitive self-expectations).",
  },
  {
    q: "Can I save my reframed thoughts in HeyRewire?",
    a: "Yes. Once you construct a reframe in the tool, you can copy it to your clipboard or click 'Save to Brain Dump' to store it in your encrypted, private reflection sanctuary.",
  },
];

export default function ThoughtReframerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-teal-500 selection:text-white">
      <JsonLd data={thoughtReframerJsonLd} />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl dark:from-teal-500/10 dark:via-emerald-500/5" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-semibold text-teal-800 backdrop-blur-sm dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 mb-6">
              <Brain className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>Evidence-Informed CBT Utility</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl leading-tight">
              CBT Thought Record Online <br />
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Challenge Distortions &amp; Reframe Worries
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              When overthinking spirals take hold, don&apos;t wrestle with them in your head. Externalize the thought, identify the cognitive distortion, and build a calm, rational counter-perspective.
            </p>
          </div>
        </section>

        {/* Interactive Tool Container */}
        <section className="pb-16 md:pb-24 px-4 sm:px-6">
          <ThoughtReframerTool />
        </section>

        {/* Educational Content & Cognitive Distortions Glossary */}
        <section className="border-t border-zinc-200/80 bg-white py-16 md:py-20 dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                Cognitive Behavioral Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">
                The Cognitive Model: Thoughts $\neq$ Facts
              </h2>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Pioneered by Dr. Aaron Beck and popularized by Dr. David Burns, Cognitive Behavioral Therapy (CBT) rests on a foundational insight: <strong>it is not events themselves that upset us, but the meaning and interpretations we attach to them.</strong>
              </p>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                When chronic stress or anxiety is triggered, our brain activates automated protective scripts. While meant to protect us from ancestral threats, these scripts often distort reality, exaggerating danger and minimizing our ability to cope.
              </p>
            </div>

            {/* Core Distortion Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Common Cognitive Distortions to Watch For
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    Catastrophizing
                  </h4>
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Magnifying a setback into an insurmountable catastrophe. Anticipating total ruin from an ambiguous or minor event.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    All-or-Nothing (Polarized) Thinking
                  </h4>
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Thinking in absolute extremes. If an outcome is not 100% perfect, classifying it as a complete and utter failure.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Mind Reading
                  </h4>
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Believing you know what others think without asking or verifying facts, usually projecting self-criticism onto them.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-500" />
                    Emotional Reasoning
                  </h4>
                  <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Allowing internal emotions to dictate external facts. &quot;I feel anxious, therefore I must be in grave danger.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Companion Tools Cross-Promo */}
            <div className="rounded-3xl border border-teal-200 bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 p-6 sm:p-8 dark:border-teal-900/50 dark:from-teal-950/40 dark:via-zinc-900 dark:to-cyan-950/40">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                    <Wind className="h-3.5 w-3.5" />
                    <span>Physiological Grounding</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Is your body still tense from the anxiety loop?
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-xl">
                    When racing thoughts escalate physical tension, pairing cognitive reframing with rhythmic Box Breathing creates complete mind-body reset.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Link
                    href="/tools/box-breathing"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-teal-700 transition-colors"
                  >
                    <span>Box Breathing Online</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/offload"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-300 bg-white px-5 py-2.5 text-xs font-semibold text-teal-800 hover:bg-teal-50 dark:border-teal-800 dark:bg-zinc-900 dark:text-teal-300 transition-colors"
                  >
                    <span>Full Brain Dump Canvas</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Accessible FAQs */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Frequently Asked Questions About Thought Challenging
              </h3>
              {THOUGHT_REFRAME_FAQS.map((faq, idx) => (
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

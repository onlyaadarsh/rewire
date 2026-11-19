import React from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export const HOME_FAQS = [
  {
    question: "What is HeyRewire?",
    answer:
      "HeyRewire is an evidence-informed AI mental health companion designed to help break overthinking loops, regulate nervous system stress, and reframe irrational worries through Cognitive Behavioral Therapy (CBT) techniques and brain dump journaling.",
  },
  {
    question: "How does Cognitive Offloading (Brain Dump) work?",
    answer:
      "When your mind is overwhelmed, working memory gets strained. Brain dumping allows you to externalize racing thoughts onto a private digital canvas, isolate cognitive distortions (such as catastrophizing or all-or-nothing thinking), and convert emotional heaviness into actionable micro-steps.",
  },
  {
    question: "Is HeyRewire a replacement for therapy or a licensed doctor?",
    answer:
      "No. HeyRewire is a self-care wellness companion and cognitive reframing habit tool. It does not provide medical diagnoses, psychiatric prescriptions, or emergency intervention. If you are experiencing acute crisis or thoughts of self-harm, please dial 14416 (India), 988 (US & Canada), 111 (UK), or your local emergency hotline.",
  },
  {
    question: "Is my journal and mental health data private?",
    answer:
      "Yes. HeyRewire adheres to a zero data selling principle with encrypted sessions and database isolation. Your private reflections and brain dumps remain strictly yours.",
  },
];

export function FAQSection() {
  return (
    <section
      id="faq"
      className="border-t border-zinc-200/80 bg-white py-16 md:py-24 dark:border-zinc-800/80 dark:bg-zinc-950"
      aria-label="Frequently Asked Questions"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-medium text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300 mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Learn how HeyRewire helps with active cognitive untangling, evidence-informed CBT reframing, and private mental health journaling.
          </p>
        </div>

        <div className="space-y-4">
          {HOME_FAQS.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 transition-all dark:border-zinc-800/80 dark:bg-zinc-900/40 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between text-left font-semibold text-zinc-900 dark:text-zinc-100 text-base select-none">
                <span className="pr-4">{faq.question}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

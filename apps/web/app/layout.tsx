import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TRPCReactProvider } from "@/trpc/client";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://heyrewire.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0d9488" },
    { media: "(prefers-color-scheme: dark)", color: "#042f2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "HeyRewire — Break Overthinking Spirals, Relieve Stress & Track Mood",
    template: "%s | HeyRewire",
  },
  description:
    "Overcome overthinking, navigate depression, and calm stress with HeyRewire. Grounded in CBT techniques, featuring an empathetic AI chat companion, private brain dump journaling, and longitudinal mood analytics.",
  keywords: [
    "heyrewire",
    "stop overthinking",
    "how to stop overthinking at night",
    "anxiety grounding exercises",
    "CBT thought reframing",
    "brain dump journal",
    "cognitive offloading",
    "depression mood tracker",
    "AI mental health companion",
    "box breathing technique",
    "stress relief exercises",
    "emotional regulation tool",
  ],
  authors: [{ name: "HeyRewire Mental Health Team", url: APP_URL }],
  creator: "HeyRewire",
  publisher: "HeyRewire",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "HeyRewire",
    title: "HeyRewire — AI Mental Health Companion for Overthinking & Stress",
    description:
      "Grounded in CBT techniques to break rumination loops, calm racing thoughts, and track emotional wellness over time.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "HeyRewire - Mental Health Companion",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HeyRewire — Break Overthinking Spirals & Calm Stress",
    description:
      "Interactive mental health companion with CBT-grounded journaling, guided breathing, and mood analytics.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const globalStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${APP_URL}/#app`,
      "name": "HeyRewire Mental Health Companion",
      "url": APP_URL,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All modern web browsers, iOS, Android",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "featureList": [
        "Interactive Brain Dump & Cognitive Offloading",
        "CBT-grounded Conversational AI Companion",
        "Longitudinal Mood Tracking and Visual Graphs",
        "Guided Box Breathing Widget for Acute Anxiety",
        "Multi-Regional 24/7 Crisis Hotline Quick Escalation (India Tele-MANAS 14416, US 988, UK 111)",
      ],
      "audience": {
        "@type": "Audience",
        "audienceType": "Individuals struggling with overthinking, depression, stress, and anxiety",
      },
    },
    {
      "@type": "Organization",
      "@id": `${APP_URL}/#org`,
      "name": "HeyRewire Mental Wellness",
      "url": APP_URL,
      "logo": `${APP_URL}/icon.png`,
      "description":
        "Provider of accessible, evidence-informed digital tools for cognitive reframing, emotional regulation, and stress management.",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91 96315 26557",
          "email": "aadarshsingh121@gmail.com",
          "contactType": "Customer Support & Inquiries",
          "availableLanguage": ["English", "Hindi"],
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${APP_URL}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is HeyRewire?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HeyRewire is an evidence-informed AI mental health companion designed to help break overthinking loops, regulate nervous system stress, and reframe irrational worries through Cognitive Behavioral Therapy (CBT) techniques and brain dump journaling.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Cognitive Offloading (Brain Dump) work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "When your mind is overwhelmed, working memory gets strained. Brain dumping allows you to externalize racing thoughts onto a private digital canvas, isolate cognitive distortions (such as catastrophizing or all-or-nothing thinking), and convert emotional heaviness into actionable micro-steps.",
          },
        },
        {
          "@type": "Question",
          "name": "Is HeyRewire a replacement for therapy or a licensed doctor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. HeyRewire is a self-care wellness companion and cognitive reframing habit tool. It does not provide medical diagnoses, psychiatric prescriptions, or emergency intervention. If you are experiencing acute crisis or thoughts of self-harm, please dial 14416 (India), 988 (US & Canada), 111 (UK), or your local emergency hotline.",
          },
        },
        {
          "@type": "Question",
          "name": "Is my journal and mental health data private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. HeyRewire adheres to a zero data selling principle with encrypted sessions and database isolation. Your private reflections and brain dumps remain strictly yours.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <JsonLd data={globalStructuredData} />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

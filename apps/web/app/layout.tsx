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
    default: "Stop Overthinking & Calm Racing Thoughts | HeyRewire",
    template: "%s | HeyRewire",
  },
  description:
  "Quiet racing thoughts, untangle anxiety, and reframe worries with CBT-informed journaling, interactive box breathing, and a private reflection companion.",
  keywords: [
    "stop overthinking",
    "how to stop overthinking at night",
    "calm racing thoughts",
    "cbt thought record",
    "brain dump journal",
    "box breathing online",
    "cognitive reframing exercises",
    "anxiety grounding exercises",
    "depression mood tracker",
    "AI mental health companion",
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
    title: "Stop Overthinking & Calm Racing Thoughts | HeyRewire",
    description:
    "Break rumination spirals with CBT-informed journaling, interactive box breathing, and an empathetic private companion.",
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
    title: "Stop Overthinking & Calm Racing Thoughts | HeyRewire",
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
          "email": "support@heyrewire.com",
          "contactType": "Customer Support & Inquiries",
          "availableLanguage": ["English", "Hindi"],
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

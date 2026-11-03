import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brain Dump & Cognitive Offloading",
  description:
    "Externalize racing thoughts, identify cognitive distortions, and reframe worries into calm, actionable steps with Rewire's private brain dump canvas.",
  alternates: {
    canonical: "/offload",
  },
  openGraph: {
    title: "Brain Dump & Cognitive Offloading | HeyRewire",
    description:
      "Interrupt overthinking spirals. Externalize racing worries and discover evidence-based CBT reframes in a private sanctuary.",
    url: "/offload",
  },
};

export default function OffloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Companion Chat",
  description: "Private conversational reflection and CBT thought reframing with Rewire.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


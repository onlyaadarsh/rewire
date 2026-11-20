import { Metadata } from "next";
import { Suspense } from "react";
import { SignUpCard } from "@/components/auth/sign-up-card";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your confidential Rewire account to begin brain dumping and CBT reframing.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        </div>
      }
    >
      <SignUpCard />
    </Suspense>
  );
}

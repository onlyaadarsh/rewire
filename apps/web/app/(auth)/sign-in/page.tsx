import { Metadata } from "next";
import { Suspense } from "react";
import { SignInCard } from "@/components/auth/sign-in-card";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your private Rewire mental health companion account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        </div>
      }
    >
      <SignInCard />
    </Suspense>
  );
}

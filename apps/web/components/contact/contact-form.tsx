"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {
  Send,
  User,
  Mail,
  Tag,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

interface FieldErrors {
  name?: string[];
  email?: string[];
  subject?: string[];
  message?: string[];
}

export function ContactForm() {
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [botField, setBotField] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  // Auto-populate user details if logged in
  useEffect(() => {
    if (session?.user) {
      if (!name && session.user.name) {
        setName(session.user.name);
      }
      if (!email && session.user.email) {
        setEmail(session.user.email);
      }
    }
  }, [session]); // trigger the effect when user is loggedIn.

  const validateClientSide = (): boolean => {
    const errors: FieldErrors = {};

    if (!name.trim()) {
      errors.name = ["Please enter your name."];
    } else if (name.trim().length < 2) {
      errors.name = ["Name must be at least 2 characters."];
    }

    if (!email.trim()) {
      errors.email = ["Please enter your email address."];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = ["Please enter a valid email address."];
    }

    if (!message.trim()) {
      errors.message = ["Please enter your message."];
    } else if (message.trim().length < 10) {
      errors.message = ["Message must be at least 10 characters long."];
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validateClientSide()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || undefined,
          message: message.trim(),
          botField: botField.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data?.details) {
          setFieldErrors(data.details);
          setGlobalError(data.error || "Please fix the highlighted errors.");
        } else {
          setGlobalError(
            data?.error || "Failed to send your message. Please try again later."
          );
        }
        setIsLoading(false);
        return;
      }

      // Success
      setSubmittedEmail(email.trim());
      setIsSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setFieldErrors({});
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Network error. Please check your connection and try again.";
      setGlobalError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setGlobalError(null);
    setFieldErrors({});
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  };

  return (
    <section
      id="contact-form"
      className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-10 shadow-sm transition-all dark:border-zinc-800/80 dark:bg-zinc-900"
    >
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl dark:bg-teal-500/5" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />

      {isSuccess ? (
        <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 shadow-md shadow-teal-500/10">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Message Sent Successfully!
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Thank you for reaching out. We have received your inquiry and will
              reply to{" "}
              <strong className="text-zinc-900 dark:text-zinc-200">
                {submittedEmail || "your email"}
              </strong>{" "}
              within 24 hours.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-xs hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-all cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-teal-50/80 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300">
              <MessageSquare className="h-3 w-3" />
              <span>Direct Inquiries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Send Us a Message
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Have a question about Rewire, suggestions for new features, or need
              direct account assistance? Drop us a note below.
            </p>
          </div>

          {/* Global Error Banner */}
          {globalError && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs sm:text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200 animate-in fade-in">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Unable to submit message</p>
                <p className="mt-0.5 opacity-90">{globalError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Honeypot field (hidden from genuine users, catches bots) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="botField">Leave this field blank</label>
              <input
                id="botField"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) {
                        setFieldErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    className={`block w-full rounded-xl border bg-zinc-50/50 py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:bg-white focus:outline-hidden dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:bg-zinc-800 ${fieldErrors.name
                      ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-rose-800"
                      : "border-zinc-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:focus:border-teal-400"
                      }`}
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">
                    {fieldErrors.name[0]}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    className={`block w-full rounded-xl border bg-zinc-50/50 py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:bg-white focus:outline-hidden dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:bg-zinc-800 ${fieldErrors.email
                      ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-rose-800"
                      : "border-zinc-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:focus:border-teal-400"
                      }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">
                    {fieldErrors.email[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Subject Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="contact-subject"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
              >
                Subject <span className="text-zinc-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500">
                  <Tag className="h-4 w-4" />
                </div>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="e.g. Account assistance, feedback, or general inquiry"
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    if (fieldErrors.subject) {
                      setFieldErrors((prev) => ({ ...prev, subject: undefined }));
                    }
                  }}
                  className={`block w-full rounded-xl border bg-zinc-50/50 py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:bg-white focus:outline-hidden dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:bg-zinc-800 ${fieldErrors.subject
                    ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-rose-800"
                    : "border-zinc-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:focus:border-teal-400"
                    }`}
                />
              </div>
              {fieldErrors.subject && (
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  {fieldErrors.subject[0]}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
                >
                  Message <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  {message.length} / 5000
                </span>
              </div>
              <textarea
                id="contact-message"
                rows={5}
                required
                placeholder="How can we help you? Feel free to share your thoughts, questions, or issues..."
                value={message}
                maxLength={5000}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (fieldErrors.message) {
                    setFieldErrors((prev) => ({ ...prev, message: undefined }));
                  }
                }}
                className={`block w-full rounded-xl border bg-zinc-50/50 p-4 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:bg-white focus:outline-hidden dark:bg-zinc-800/50 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:bg-zinc-800 ${fieldErrors.message
                  ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-rose-800"
                  : "border-zinc-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:focus:border-teal-400"
                  }`}
              />
              {fieldErrors.message && (
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  {fieldErrors.message[0]}
                </p>
              )}
            </div>

            {/* Submit Button & Assurance */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 hover:from-teal-500 hover:to-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-teal-500/40 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending message...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400 shrink-0" />
                <span>We typically respond within 24 hours.</span>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

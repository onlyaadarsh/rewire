import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@rewire/validation";
import { db } from "@rewire/database";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

const CONTACT_RATE_LIMIT = 5;
const CONTACT_WINDOW_SECONDS = 600; // 10 minutes

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Rate-limiting check (atomic sliding window via Redis with in-memory fallback)
    const rateCheck = await checkRateLimit({
      key: `ratelimit:contact:${clientIp}`,
      limit: CONTACT_RATE_LIMIT,
      windowSeconds: CONTACT_WINDOW_SECONDS,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many messages sent. Please wait ${rateCheck.retryAfter} seconds before trying again.`,
          retryAfter: rateCheck.retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfter),
            "X-RateLimit-Limit": String(rateCheck.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    // Validate request schema
    const validation = ContactFormSchema.safeParse(body);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          error: "Validation failed. Please review the highlighted fields.",
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, botField } = validation.data;

    // Honeypot anti-spam verification: silent success for bots
    if (botField && botField.trim().length > 0) {
      console.warn(`[Contact API] Honeypot triggered by IP: ${clientIp}`);
      return NextResponse.json({
        success: true,
        message: "Thank you for reaching out! Your message has been received.",
      });
    }

    // 1. Persist to database if available
    let savedToDatabase = false;
    try {
      if (db && "contactMessage" in db) {
        await (db as any).contactMessage.create({
          data: {
            name,
            email,
            subject: subject?.trim() || null,
            message,
          },
        });
        savedToDatabase = true;
      }
    } catch (dbError) {
      // Graceful fallback: do not fail user submission if DB table hasn't migrated yet
      console.warn(
        "[Contact API] Database save skipped or failed (table migration may be pending):",
        dbError
      );
    }

    // 2. Email notification (if RESEND_API_KEY is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    const supportEmail =
      process.env.CONTACT_NOTIFICATION_EMAIL ||
      process.env.ADMIN_EMAIL ||
      "contect@thecoder.in";

    if (resendApiKey) {
      try {
       const mailres= await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "Rewire Support <contact@heyrewire.com>",
            to: supportEmail,
            reply_to: email,
            subject: `[Rewire Contact Form] ${subject?.trim() || "New Inquiry from " + name}`,
            text: `New contact submission received:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject?.trim() || "N/A"}\nSaved to DB: ${savedToDatabase ? "Yes" : "No"}\n\nMessage:\n${message}\n\n---\nIP: ${clientIp}\nTime: ${new Date().toISOString()}`,
          }),
        });
        console.log("[Contact API] Email sent:", mailres);
      } catch (emailError) {
        console.error("[Contact API] Failed to dispatch email notification:", emailError);
      }
    } else {
      // Always log to server logs for traceability
      console.info("[Contact Submission Received]", {
        name,
        email,
        subject: subject?.trim() || "N/A",
        messageLength: message.length,
        savedToDatabase,
        receivedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you for contacting us! Your message has been received. Our team will review it and get back to you shortly.",
    });
  } catch (error) {
    console.error("[Contact API] Unexpected error:", error);
    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while sending your message. Please try again or reach out directly to contect@thecoder.in.",
      },
      { status: 500 }
    );
  }
}

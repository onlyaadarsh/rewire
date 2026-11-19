import { NextRequest, NextResponse } from "next/server";
import { ContactFormSchema } from "@rewire/validation";
import { db } from "@rewire/database";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

// Basic in-memory rate-limiter fallback if Redis is not configured
const ipSubmissionTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimitedMemory(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipSubmissionTimestamps.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  ipSubmissionTimestamps.set(ip, validTimestamps);
  return false;
}

async function checkRateLimit(ip: string): Promise<boolean> {
  const redisKey = `ratelimit:contact:${ip}`;
  try {
    const current = await redis.incr(redisKey);
    if (current === 1) {
      await redis.expire(redisKey, 600); // 10 minutes
    }
    return current > MAX_REQUESTS_PER_WINDOW;
  } catch {
    // Fall back to in-memory check if Redis is unreachable
    return isRateLimitedMemory(ip);
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "anonymous";

    // Rate-limiting check
    const isLimited = await checkRateLimit(clientIp);
    if (isLimited) {
      return NextResponse.json(
        {
          error: "Too many messages sent. Please wait a few minutes before trying again.",
        },
        { status: 429 }
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

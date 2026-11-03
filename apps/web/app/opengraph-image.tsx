import { ImageResponse } from "next/og";

export const alt = "HeyRewire — Break Overthinking Spirals, Relieve Stress & Track Mood";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2dd4bf"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginRight: "8px" }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(13, 148, 136, 0.28) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.20) 0%, transparent 50%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "#fafafa",
        }}
      >
        {/* Top Header: Logo & Safety Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #0d9488 0%, #10b981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(13, 148, 136, 0.4)",
              }}
            >
              {/* Heart SVG */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: "800",
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                  lineHeight: "1.1",
                }}
              >
                HeyRewire
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  color: "#2dd4bf",
                  textTransform: "uppercase",
                }}
              >
                Mental Health Companion
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(13, 148, 136, 0.15)",
              border: "1px solid rgba(45, 212, 191, 0.3)",
              color: "#5eead4",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <span>Evidence-Informed &bull; 100% Confidential</span>
          </div>
        </div>

        {/* Center Headline & Subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontSize: "58px",
              fontWeight: "900",
              letterSpacing: "-0.03em",
              lineHeight: "1.15",
              margin: 0,
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Break Overthinking Spirals,</span>
            <span
              style={{
                background: "linear-gradient(90deg, #2dd4bf 0%, #34d399 50%, #38bdf8 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Relieve Stress & Calm Your Mind
            </span>
          </h1>

          <p
            style={{
              fontSize: "22px",
              color: "#a1a1aa",
              lineHeight: "1.4",
              maxWidth: "920px",
              margin: 0,
            }}
          >
            Empathetic AI reflection, CBT-grounded thought reframing, private brain dump journaling, and 4-4-4-4 box breathing exercises.
          </p>
        </div>

        {/* Bottom Feature Badges & URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", color: "#e4e4e7", fontSize: "16px" }}>
              <CheckIcon />
              <span>Cognitive Offloading</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "#e4e4e7", fontSize: "16px" }}>
              <CheckIcon />
              <span>CBT Thought Reframing</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "#e4e4e7", fontSize: "16px" }}>
              <CheckIcon />
              <span>Guided Box Breathing</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", color: "#e4e4e7", fontSize: "16px" }}>
              <CheckIcon />
              <span>24/7 Crisis Triage</span>
            </div>
          </div>

          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#5eead4",
              letterSpacing: "-0.01em",
            }}
          >
            heyrewire.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

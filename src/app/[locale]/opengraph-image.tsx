import { ImageResponse } from "next/og";
import { routing, Locale } from "@/i18n/routing";

export const alt = "Ahmed Hanye — Full-Stack Software Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function getOgContentStrings(isArabic: boolean) {
  return {
    windowTitle: isArabic
      ? "Ahmed Hanye [Arabic Edition // Interactive 3D Workspace]"
      : "Ahmed Hanye [Interactive 3D Workspace]",
    categoryBadge: isArabic
      ? "RETRO OS EDITION // FULL-STACK SOFTWARE ENGINEER"
      : "SYSTEM PROFILE // FULL-STACK SOFTWARE ENGINEER",
  };
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = (resolvedParams?.locale || "en") as Locale;
  const isArabic = locale === "ar";

  const { windowTitle, categoryBadge } = getOgContentStrings(isArabic);
  const name = "Ahmed Hanye";
  const role = "Full-Stack Software Engineer";
  const tagline =
    "Resilient local-first architectures, sub-millisecond reactivity & scalable API systems across TypeScript and Python.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#008080",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, #009696 0%, #004d4d 100%)",
          padding: 32,
        }}
      >
        {/* Retro 3D Window Frame */}
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#c0c0c0",
            border: "5px solid #ffffff",
            borderRightColor: "#202020",
            borderBottomColor: "#202020",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.6)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title Bar */}
          <div
            style={{
              height: 58,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
              color: "#ffffff",
              paddingLeft: 20,
              paddingRight: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.5px",
              }}
            >
              <span>💻</span>
              <span>{windowTitle}</span>
            </div>

            {/* Window Controls (Styled Retro Buttons) */}
            <div
              style={{
                display: "flex",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 30,
                  backgroundColor: "#c0c0c0",
                  border: "2px solid #ffffff",
                  borderRightColor: "#000000",
                  borderBottomColor: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 900,
                  color: "#000000",
                }}
              >
                _
              </div>
              <div
                style={{
                  width: 32,
                  height: 30,
                  backgroundColor: "#c0c0c0",
                  border: "2px solid #ffffff",
                  borderRightColor: "#000000",
                  borderBottomColor: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 7,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "2px solid #000000",
                  }}
                />
              </div>
              <div
                style={{
                  width: 32,
                  height: 30,
                  backgroundColor: "#c0c0c0",
                  border: "2px solid #ffffff",
                  borderRightColor: "#000000",
                  borderBottomColor: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 900,
                  color: "#000000",
                }}
              >
                x
              </div>
            </div>
          </div>

          {/* Window Body (High-Focus 4-Line Billboard Viewport) */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "48px 56px",
              backgroundColor: "#ffffff",
              margin: 12,
              border: "4px solid #808080",
              borderRightColor: "#ffffff",
              borderBottomColor: "#ffffff",
              gap: 14,
            }}
          >
            {/* Line 1: Overline Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 22,
                color: "#000080",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "2.5px",
              }}
            >
              <span style={{ fontSize: 24 }}>⚡</span>
              <span>{categoryBadge}</span>
            </div>

            {/* Line 2: Giant Hero Name */}
            <div
              style={{
                fontSize: 84,
                fontWeight: 900,
                color: "#0a0f1d",
                lineHeight: 1.05,
                letterSpacing: "-2.5px",
                marginTop: 2,
              }}
            >
              {name}
            </div>

            {/* Line 3: Scaled Role Title */}
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#000080",
                letterSpacing: "-0.5px",
              }}
            >
              {role}
            </div>

            {/* Line 4: Clear 1-Line Value Pitch */}
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "#374151",
                lineHeight: 1.4,
                marginTop: 4,
                maxWidth: 1040,
              }}
            >
              {tagline}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

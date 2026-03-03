import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ─── Constants ───────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 192;
const BG_COLOR = "#050505"; // matches the near-black dot-animation background
const FRAME_BASE = "/heroSectionAnimation/"; // served from public/

// Build array of image paths
const framePaths = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `${FRAME_BASE}frame_${String(i + 1).padStart(3, "0")}.webp`,
);

// ─── Text overlay config ─────────────────────────────────────────────────────
const TEXT_SECTIONS = [
  {
    id: "section-0",
    scrollStart: 0,
    scrollPeak: 0.08,
    scrollEnd: 0.22,
    align: "center",
    content: "headline",
  },
  {
    id: "section-1",
    scrollStart: 0.35,
    scrollPeak: 0.45,
    scrollEnd: 0.6,
    align: "left",
    content: "judgement",
  },
  {
    id: "section-2",
    scrollStart: 0.72,
    scrollPeak: 1.0,
    scrollEnd: 1.0,
    align: "center",
    content: "cta",
  },
];

// ─── Easing helper ──────────────────────────────────────────────────────────
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function getOpacity(progress, start, peak, end) {
  if (progress < start || progress > end) return 0;
  if (progress <= peak) {
    const t = (progress - start) / (peak - start);
    return easeInOut(Math.max(0, Math.min(1, t)));
  }
  if (peak === end) return 1;
  const t = (progress - peak) / (end - peak);
  return easeInOut(Math.max(0, Math.min(1, 1 - t)));
}

// ─── Loading Spinner ─────────────────────────────────────────────────────────
function LoadingSpinner({ progress }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: BG_COLOR,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      {/* Animated ring */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.08)",
          borderTop: "2px solid rgba(255,255,255,0.9)",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <div
        style={{
          marginTop: 24,
          color: "rgba(255,255,255,0.55)",
          fontSize: 13,
          letterSpacing: "0.15em",
          fontFamily: "inherit",
          textTransform: "uppercase",
        }}
      >
        Loading&nbsp;·&nbsp;{Math.round(progress * 100)}%
      </div>
      {/* Inline keyframes */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Text Overlay Components ──────────────────────────────────────────────────
function HeadlineText({ opacity }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 1.5rem",
        opacity,
        transition: "opacity 0.05s linear",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(3.5rem, 8vw, 6rem)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            textShadow:
              "0 0 40px rgba(255,255,255,0.18), 0 2px 8px rgba(0,0,0,0.8)",
            margin: 0,
          }}
        >
          Unleash your thoughts.
        </h1>
      </div>
    </div>
  );
}

function JudgementText({ opacity }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        pointerEvents: "none",
        padding: "0 clamp(1.5rem, 8vw, 7rem)",
        opacity,
        transition: "opacity 0.05s linear",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "clamp(3rem, 7.5vw, 5rem)",
            fontWeight: 700,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            textShadow:
              "0 0 50px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.9)",
            margin: 0,
          }}
        >
          No judgement.
        </h2>
      </div>
    </div>
  );
}

function CTAText({ opacity, navigate }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: opacity > 0.05 ? "auto" : "none",
        gap: "2rem",
        padding: "0 1.5rem",
        opacity,
        transition: "opacity 0.05s linear",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(4.5rem, 14vw, 10rem)",
          fontWeight: 800,
          color: "rgba(255,255,255,0.96)",
          letterSpacing: "0.08em",
          lineHeight: 1,
          textShadow:
            "0 0 60px rgba(255,255,255,0.25), 0 0 15px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.8)",
          margin: 0,
          textAlign: "center",
        }}
      >
        ZERELY
      </h2>
      <button
        onClick={() => navigate("/wall")}
        style={{
          /* High contrast solid dark button */
          background: "rgba(5,5,5,0.95)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.95)",
          fontWeight: 600,
          fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          padding: "1rem 2.5rem",
          borderRadius: "60px",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,1)";
          e.currentTarget.style.boxShadow =
            "0 12px 40px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.1)";
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(5,5,5,0.95)";
          e.currentTarget.style.boxShadow =
            "0 8px 32px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)";
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        }}
      >
        Enter the Wall
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HeroAnimation() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Framer Motion scroll tracking
  // Using "end end" precisely tracks to the bottom edge.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ─── Canvas drawing ────────────────────────────────────────────────────────
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    // Fill background first
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Object-cover scaling
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawW, drawH, drawX, drawY;
    if (imgAspect > canvasAspect) {
      drawH = height;
      drawW = height * imgAspect;
    } else {
      drawW = width;
      drawH = width / imgAspect;
    }
    drawX = (width - drawW) / 2;
    drawY = (height - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // ─── Resize handler ────────────────────────────────────────────────────────
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use devicePixelRatio for crispness, bounded to 2 to avoid extreme performance hit
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();

    // Only resize if dimensions actually changed
    if (
      canvas.width !== Math.floor(rect.width * dpr) ||
      canvas.height !== Math.floor(rect.height * dpr)
    ) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Ensure canvas CSS size matches the container, while raster size is scaled
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    }
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // ─── Preload all frames ────────────────────────────────────────────────────
  useEffect(() => {
    let loaded = 0;
    const total = TOTAL_FRAMES;
    const images = [];

    framePaths.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        setLoadProgress(loaded / total);
        if (loaded === total) {
          imagesRef.current = images;
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        // Skip broken frames gracefully
        loaded++;
        setLoadProgress(loaded / total);
        if (loaded === total) {
          imagesRef.current = images;
          setIsLoaded(true);
        }
      };
      img.src = src;
      images[i] = img;
    });
  }, []);

  // ─── Set up canvas size & ResizeObserver ──────────────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    syncCanvasSize();
    const ro = new ResizeObserver(syncCanvasSize);
    const canvas = canvasRef.current;
    if (canvas) ro.observe(canvas);

    return () => ro.disconnect();
  }, [isLoaded, syncCanvasSize]);

  // ─── Draw frame 0 on first load ───────────────────────────────────────────
  useEffect(() => {
    if (isLoaded) {
      drawFrame(0);
    }
  }, [isLoaded, drawFrame]);

  // ─── Scroll → frame rendering ─────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);

    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.round(latest * (TOTAL_FRAMES - 1))),
    );

    if (frameIndex === currentFrameRef.current) return;
    currentFrameRef.current = frameIndex;

    // RAF-throttled draw
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      drawFrame(frameIndex);
    });
  });

  // ─── Compute text opacities ───────────────────────────────────────────────
  const textOpacities = TEXT_SECTIONS.map((s) =>
    getOpacity(scrollProgress, s.scrollStart, s.scrollPeak, s.scrollEnd),
  );

  return (
    <>
      {/* Loading overlay */}
      {!isLoaded && <LoadingSpinner progress={loadProgress} />}

      {/* Scrollytelling container — faster (shorter) on mobile */}
      <div
        ref={containerRef}
        style={{
          height: isMobile ? "200vh" : "400vh",
          position: "relative",
          background: BG_COLOR,
        }}
      >
        {/* Sticky viewport accounts for 4rem (64px) Navbar. 
            Using dvh ensures it doesn't overscroll on mobile browsers with dynamic address bars */}
        <div
          style={{
            position: "sticky",
            top: "4rem",
            width: "100%",
            height: "calc(100dvh - 4rem)",
            overflow: "hidden",
            background: BG_COLOR,
          }}
        >
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />

          {/* Text layers */}
          <HeadlineText opacity={textOpacities[0]} />
          <JudgementText opacity={textOpacities[1]} />
          <CTAText opacity={textOpacities[2]} navigate={navigate} />

          {/* Scroll indicator — fades out after first scroll */}
          <div
            style={{
              position: "absolute",
              bottom: "2.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
              opacity: Math.max(0, 1 - scrollProgress * 12),
              pointerEvents: "none",
              transition: "opacity 0.1s linear",
            }}
          >
            <div
              style={{
                width: 1,
                height: 52,
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.55), transparent)",
                animation: "scrollPulse 1.8s ease-in-out infinite",
              }}
            />
            <style>{`
              @keyframes scrollPulse {
                0%, 100% { opacity: 0.35; transform: scaleY(1); }
                50% { opacity: 0.85; transform: scaleY(1.12); }
              }
            `}</style>
          </div>
        </div>
      </div>
    </>
  );
}

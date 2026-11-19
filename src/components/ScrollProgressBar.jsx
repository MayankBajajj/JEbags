import { useEffect, useRef } from "react";

const VIEW_WIDTH = 400;
const VIEW_HEIGHT = 14;
const WAVES = 6;

function buildWavePath() {
  const mid = VIEW_HEIGHT / 2;
  const amplitude = VIEW_HEIGHT * 0.3;
  const period = VIEW_WIDTH / WAVES;
  let d = `M0,${mid}`;
  for (let i = 0; i < WAVES; i++) {
    const x0 = i * period;
    const xMid = x0 + period / 2;
    const xEnd = x0 + period;
    const yPeak = i % 2 === 0 ? mid - amplitude : mid + amplitude;
    const q = period * 0.25;
    d += ` C ${(x0 + q).toFixed(2)},${mid.toFixed(2)} ${(x0 + q).toFixed(2)},${yPeak.toFixed(2)} ${xMid.toFixed(2)},${yPeak.toFixed(2)}`;
    d += ` C ${(xMid + q).toFixed(2)},${yPeak.toFixed(2)} ${(xMid + q).toFixed(2)},${mid.toFixed(2)} ${xEnd.toFixed(2)},${mid.toFixed(2)}`;
  }
  return d;
}

const WAVE_PATH = buildWavePath();

export default function ScrollProgressBar() {
  const fillRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    // clip-path + transform only — never width/left, which force a browser layout
    // recalculation on every single scroll frame. Under scroll load (video decode,
    // every Reveal component's IntersectionObserver firing) that layout work is the
    // first thing the browser drops, which is what made this bar vanish while
    // scrolling fast and "catch up" once scrolling slowed or stopped.
    const update = () => {
      ticking = false;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      if (fillRef.current) fillRef.current.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      if (dotRef.current) {
        dotRef.current.style.transform = `translateY(-50%) translateX(calc(${pct}vw - 4px))`;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed top-[3px] left-0 right-0 z-[9999] h-2 bg-ink-950 overflow-hidden pointer-events-none transform-gpu">
      {/* faint track */}
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <path d={WAVE_PATH} fill="none" stroke="#faf5ec" strokeOpacity="0.18" strokeWidth="2.2" />
      </svg>

      {/* gold progress — revealed via clip-path, never width, so it's composite-only */}
      <div
        ref={fillRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(0 100% 0 0)" }}
      >
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <path d={WAVE_PATH} fill="none" stroke="#d9af5c" strokeWidth="2.6" />
        </svg>
      </div>

      {/* glowing lead dot — positioned via transform, never left */}
      <div
        ref={dotRef}
        className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_8px_3px_rgba(217,175,92,0.7)]"
        style={{ transform: "translateY(-50%) translateX(-4px)" }}
      />
    </div>
  );
}

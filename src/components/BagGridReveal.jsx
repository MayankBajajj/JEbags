import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Icon from "./Icon";

const bagImage = "/images/hero-bag-3d.png";

const GRID = 6;
const START = 2; // sync with the global LoadingScreen's ~1.95s exit
const TILE_START = START + 0.2;
const TILE_END = START + 1.1;
const MAX_WAVE = (GRID - 1) * 2; // (5-row)+(col) max value
const STEP = (TILE_END - TILE_START) / MAX_WAVE;
const ASSEMBLE_DONE = TILE_END + 0.35;
const BLUEPRINT_START = START;

const SPRING_EASE = [0.22, 1, 0.36, 1];

const CELL = 100 / GRID;

// baseline tilt so the bag reads as a 3D object even before the cursor moves
const BASE_ROTATE_X = 6;
const BASE_ROTATE_Y = -9;
const TILT_RANGE = 13;

function Tile({ row, col }) {
  const wave = (GRID - 1 - row) + col;
  const delay = TILE_START + wave * STEP;

  // every tile carries the SAME full-size image, clipped to its own cell —
  // avoids seams that per-tile background-position slicing produces at
  // sub-pixel grid-track boundaries. A small overlap hides clip-path edge
  // anti-aliasing, which otherwise shows as faint seams between tiles.
  const OVERLAP = 0.45;
  const top = Math.max(0, row * CELL - OVERLAP);
  const bottom = Math.max(0, (GRID - 1 - row) * CELL - OVERLAP);
  const left = Math.max(0, col * CELL - OVERLAP);
  const right = Math.max(0, (GRID - 1 - col) * CELL - OVERLAP);

  return (
    <motion.div
      className="absolute inset-0 border"
      style={{
        backgroundImage: `url(${bagImage})`,
        backgroundSize: "100% 100%",
        clipPath: `inset(${top}% ${right}% ${bottom}% ${left}%)`,
        transformOrigin: `${col * CELL + CELL / 2}% ${row * CELL + CELL / 2}%`,
      }}
      initial={{ opacity: 0, z: -40, rotateX: 8, rotateY: -8, scale: 0.94, borderColor: "rgba(212,175,55,0.65)" }}
      animate={{ opacity: 1, z: 0, rotateX: 0, rotateY: 0, scale: 1, borderColor: "rgba(212,175,55,0)" }}
      transition={{ duration: 0.45, delay, ease: SPRING_EASE }}
    />
  );
}

export default function BagGridReveal() {
  const location = useLocation();
  const [replayKey, setReplayKey] = useState(0);
  const [assembled, setAssembled] = useState(false);
  const containerRef = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(
    useTransform(mx, [-1, 1], [BASE_ROTATE_Y - TILT_RANGE, BASE_ROTATE_Y + TILT_RANGE]),
    { stiffness: 70, damping: 16 }
  );
  const rotateX = useSpring(
    useTransform(my, [-1, 1], [BASE_ROTATE_X + TILT_RANGE, BASE_ROTATE_X - TILT_RANGE]),
    { stiffness: 70, damping: 16 }
  );

  // directional shadow that swings opposite the tilt, selling the depth
  const shadowX = useTransform(rotateY, [BASE_ROTATE_Y - TILT_RANGE, BASE_ROTATE_Y + TILT_RANGE], [-22, 22]);
  const shadowY = useTransform(rotateX, [BASE_ROTATE_X - TILT_RANGE, BASE_ROTATE_X + TILT_RANGE], [26, 8]);
  const dropShadow = useTransform([shadowX, shadowY], ([x, y]) =>
    `drop-shadow(${x}px ${y}px 22px rgba(10,21,38,0.38)) drop-shadow(0px 4px 10px rgba(10,21,38,0.18))`
  );

  useEffect(() => {
    if (location.pathname === "/") {
      setAssembled(false);
      setReplayKey((k) => k + 1);
    }
  }, [location.pathname]);

  useEffect(() => {
    setAssembled(false);
    mx.set(0);
    my.set(0);
    const t = setTimeout(() => setAssembled(true), ASSEMBLE_DONE * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayKey]);

  useEffect(() => {
    if (!assembled) return;
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const handleLeave = () => {
      mx.set(0);
      my.set(0);
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [assembled, mx, my]);

  const tiles = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      tiles.push({ row, col });
    }
  }

  return (
    <div
      key={replayKey}
      ref={containerRef}
      className="relative group/bag max-w-[min(520px,48vh)] mx-auto aspect-square"
      style={{ perspective: 1000 }}
    >
      <Link
        to="/how-we-work"
        className="absolute left-1/2 -translate-x-1/2 -top-4 sm:-top-6 z-30 inline-flex items-center gap-2 bg-ink-950 text-cream-50 text-xs font-bold uppercase tracking-wide px-5 py-2.5 rounded-full shadow-lg shadow-ink-900/25 opacity-0 translate-y-2 pointer-events-none transition-all duration-300 group-hover/bag:opacity-100 group-hover/bag:translate-y-0 group-hover/bag:pointer-events-auto hover:bg-gold-500 hover:text-ink-950"
      >
        See How We Work
        <Icon name="arrow-right" size={14} />
      </Link>
      {/* ambient studio glow behind the bag for depth */}
      <motion.div
        className="absolute -inset-10 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,154,63,0.2) 0%, rgba(10,21,38,0.06) 45%, transparent 72%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: assembled ? 1 : 0 }}
        transition={{ duration: 0.9, ease: SPRING_EASE }}
      />

      {/* blueprint drafting grid, fades once tiles start locking in */}
      <motion.div
        className="absolute inset-0 rounded-[2rem] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(200,154,63,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,154,63,0.28) 1px, transparent 1px)",
          backgroundSize: `calc(100%/${GRID}) 100%, 100% calc(100%/${GRID})`,
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.35, delay: BLUEPRINT_START, ease: "easeOut" }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          rotateX: assembled ? rotateX : BASE_ROTATE_X,
          rotateY: assembled ? rotateY : BASE_ROTATE_Y,
          filter: assembled ? dropShadow : "none",
        }}
        animate={assembled ? { y: [0, -9, 0] } : { y: 0 }}
        transition={assembled ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {tiles.map(({ row, col }) => (
            <Tile key={`${row}-${col}`} row={row} col={col} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

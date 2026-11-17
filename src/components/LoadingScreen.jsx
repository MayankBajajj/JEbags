import { motion } from "framer-motion";

const WORD = "JÉ BAGS";
const letterClasses =
  "font-display font-semibold uppercase text-3xl sm:text-5xl tracking-[0.18em]";

function AnimatedLetter({ ch, index }) {
  if (ch === " ") {
    return <span className="inline-block w-2.5 sm:w-3.5" />;
  }

  return (
    <span className="relative inline-block">
      {/* ghost outline — always faintly visible */}
      <span
        aria-hidden
        className={letterClasses}
        style={{ color: "transparent", WebkitTextStroke: "1px rgba(250,245,236,0.25)" }}
      >
        {ch}
      </span>
      {/* bright overlay — sweeps across the word on a staggered loop */}
      <motion.span
        className={`${letterClasses} absolute inset-0 text-gold-400`}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.6,
          times: [0, 0.2, 0.45, 0.7],
          repeat: Infinity,
          repeatDelay: 0.3,
          delay: index * 0.09,
          ease: "easeInOut",
        }}
      >
        {ch}
      </motion.span>
    </span>
  );
}

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-ink-950 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-gold-400/20 border-t-gold-400 mb-7 sm:mb-9"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="flex items-baseline gap-3 sm:gap-4">
        <div className="flex">
          {WORD.split("").map((ch, i) => (
            <AnimatedLetter key={i} ch={ch} index={i} />
          ))}
        </div>
        <span className="h-4 sm:h-5 w-px bg-cream-100/20" />
        <motion.p
          className="text-xs sm:text-sm tracking-[0.3em] uppercase text-cream-100/50 whitespace-nowrap"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
        >
          Corporate Gifting
        </motion.p>
      </div>
    </motion.div>
  );
}

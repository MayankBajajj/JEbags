import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import Button from "../components/Button";
import { howWeWorkSteps } from "../data/content";

import designSamplingVideo from "../assets/videos/process/design-sampling.mp4";
import materialSourcingVideo from "../assets/videos/process/material-sourcing.mp4";
import patternCuttingVideo from "../assets/videos/process/pattern-cutting.mp4";
import fabricCuttingVideo from "../assets/videos/process/fabric-cutting.mp4";
import printingEmbroideryVideo from "../assets/videos/process/printing-embroidery.mp4";
import stitchingAssemblyVideo from "../assets/videos/process/stitching-assembly.mp4";
import qualityControlFinishingVideo from "../assets/videos/process/quality-control-finishing.mp4";
import finalInspectionVideo from "../assets/videos/process/final-inspection.mp4";
import packingDispatchVideo from "../assets/videos/process/packing-dispatch.mp4";

const ribbonClip = "polygon(22% 0%, 100% 0%, 78% 100%, 0% 100%)";
const EASE = [0.22, 1, 0.36, 1];

// Short muted clips cut straight from our own factory floor video — one per stage.
const videoMap = {
  "design-sampling": designSamplingVideo,
  "material-sourcing": materialSourcingVideo,
  "pattern-cutting": patternCuttingVideo,
  "fabric-cutting": fabricCuttingVideo,
  "printing-embroidery": printingEmbroideryVideo,
  "stitching-assembly": stitchingAssemblyVideo,
  "quality-control-finishing": qualityControlFinishingVideo,
  "final-inspection": finalInspectionVideo,
  "packing-dispatch": packingDispatchVideo,
};

function StepCard({ step, index, active }) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef(null);
  const cardRef = useRef(null);

  // Only decode/play the clips actually near the viewport — with 9 looping
  // videos on this page, letting all of them decode at once is what was
  // causing browsers to occasionally bleed a frame from one clip into
  // another (a real decoder-contention issue, not a content bug).
  useEffect(() => {
    const videoEl = videoRef.current;
    const cardEl = cardRef.current;
    if (!videoEl || !cardEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
        }
      },
      { rootMargin: "200px 0px 200px 0px", threshold: 0 }
    );
    observer.observe(cardEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      id={step.id}
      ref={cardRef}
      className={`scroll-mt-32 group rounded-2xl overflow-hidden bg-white border transition-all duration-300 ${
        active ? "border-gold-500/60 shadow-xl shadow-ink-900/10 -translate-y-1" : "border-ink-900/8 shadow-sm"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-950">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={videoMap[step.id]}
          muted
          loop
          playsInline
          preload="none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />

        <div
          className={`absolute top-3 left-3 w-10 h-14 flex items-center justify-center transition-all duration-300 ${
            active ? "bg-gold-400 scale-110 shadow-lg shadow-gold-500/40" : "bg-gold-500"
          }`}
          style={{ clipPath: ribbonClip }}
        >
          <span className="font-display font-bold text-ink-950 text-base">{index + 1}</span>
        </div>

        <h3 className="absolute bottom-3 left-4 right-4 font-display font-semibold text-lg sm:text-xl text-cream-50 leading-tight">
          {step.title}
        </h3>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-sm sm:text-[15px] text-ink-700 leading-relaxed">{step.description}</p>

        {step.detail && (
          <>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="pt-3 text-sm text-ink-700/70 leading-relaxed">{step.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              type="button"
              onClick={() => setOpen((v) => !v)}
              variant="outline"
              size="sm"
              icon="chevron-down"
              iconClassName={open ? "rotate-180" : ""}
              className="mt-4"
            >
              {open ? "Read Less" : "Read More"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function HowWeWork() {
  const [activeId, setActiveId] = useState(howWeWorkSteps[0]?.id);

  useEffect(() => {
    const elements = howWeWorkSteps.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Our Process"
        title="From Concept"
        highlight="to Delivery"
        description="Every order moves through the same disciplined, nine-stage process — so quality stays consistent whether you're ordering 50 units or 50,000."
      />

      <section className="bg-beige-100 py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(184,135,92,0.16),_transparent_50%)]" />

        <div className="hidden lg:flex items-center gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-10">
          <span className="text-[11px] tracking-[0.3em] font-semibold uppercase text-gold-600/60 [writing-mode:vertical-rl] rotate-180">
            Our Process
          </span>
          <span className="w-px h-28 bg-ink-900/15" />
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          <Reveal className="flex items-end justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
                Straight From Our Floor
              </span>
              <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink-950 leading-tight">
                A Nine-Stage Quality Process
              </h2>
            </div>
            <div className="hidden sm:flex w-20 h-20 rounded-full bg-gold-500 flex-col items-center justify-center text-center shadow-lg shadow-ink-900/20 rotate-3 shrink-0">
              <Icon name="shield-check" size={18} className="text-ink-950 mb-1" />
              <span className="text-[8px] font-bold uppercase tracking-wide text-ink-950 leading-tight px-1.5">
                Every Stage
              </span>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-7">
            {howWeWorkSteps.map((step, i) => (
              <Reveal key={step.id} delay={i * 0.04}>
                <StepCard step={step} index={i} active={step.id === activeId} />
              </Reveal>
            ))}
          </div>

          {/* closing capstone */}
          <Reveal delay={howWeWorkSteps.length * 0.04}>
            <div className="mt-8 sm:mt-10 rounded-2xl bg-ink-950 p-6 sm:p-7 flex items-center gap-5 sm:gap-6">
              <div
                className="relative shrink-0 w-11 h-14 sm:w-12 sm:h-16 bg-gold-500 flex items-center justify-center"
                style={{ clipPath: ribbonClip }}
              >
                <Icon name="check" size={20} className="text-ink-950" />
              </div>
              <p className="text-sm sm:text-base font-semibold text-cream-50">
                Every order ships only after clearing every one of these checkpoints.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-28 bg-cream-50">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <h3 className="font-display font-semibold text-2xl sm:text-3xl text-ink-950">
            Have a project in mind? Let's talk specifics.
          </h3>
          <Button to="/contact" variant="primary" className="whitespace-nowrap">
            Start a Conversation
          </Button>
        </div>
      </section>
    </>
  );
}

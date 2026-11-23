import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import Icon from "../components/Icon";
import Button from "../components/Button";
import { capabilities, whyUs, company, clients } from "../data/content";
import ClientStrip from "../components/ClientStrip";
import factoryPhoto from "../assets/photos/factory-photo.png";
import heroVideo from "../assets/videos/hero-video.mp4";

function CapabilityCard({ cap, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative overflow-hidden flex flex-col gap-5 rounded-2xl border border-ink-900/10 bg-white p-7 h-full hover:border-gold-500/50 hover:shadow-lg hover:shadow-ink-900/5 hover:-translate-y-0.5 transition-all duration-300">
      <span className="pointer-events-none select-none absolute right-4 top-2 font-display font-bold text-6xl text-ink-900/[0.04] leading-none">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative flex gap-5">
        <div className="relative w-12 h-12 rounded-xl bg-beige-200/70 flex items-center justify-center shrink-0">
          <Icon name={cap.icon} size={22} className="text-gold-600" />
        </div>
        <div className="relative">
          <h3 className="font-display font-semibold text-lg text-ink-950 mb-2">{cap.title}</h3>
          <p className="text-sm text-ink-700 leading-relaxed">{cap.description}</p>
        </div>
      </div>

      {cap.detail && (
        <div className="relative pl-[68px]">
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="pb-3 text-sm text-ink-700/80 leading-relaxed">{cap.detail}</p>
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
          >
            {open ? "Read Less" : "Read More"}
          </Button>
        </div>
      )}
    </div>
  );
}

function WhyUsCard({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-cream-50 p-8 h-full">
      <Icon
        name={item.icon}
        size={72}
        strokeWidth={1.3}
        className="pointer-events-none select-none absolute -right-3 -top-3 text-ink-900/[0.045]"
      />
      <Icon name={item.icon} size={24} className="relative text-gold-600 mb-5" />
      <h3 className="relative font-display font-semibold text-base text-ink-950 mb-2">{item.title}</h3>
      <p className="relative text-xs text-ink-700/80 leading-relaxed">{item.description}</p>

      {item.detail && (
        <div className="relative mt-4">
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="pb-3 text-xs text-ink-700/70 leading-relaxed">{item.detail}</p>
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
          >
            {open ? "Read Less" : "Read More"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function About() {
  return (
    <>
      <section className="bg-beige-100 pt-28 pb-14 sm:pt-48 sm:pb-24 relative overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover scale-110 sm:scale-100 opacity-[0.45] will-change-transform"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-beige-100/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,135,92,0.16),_transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <Reveal>
            <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
              About JE Bags
            </span>
            <h1 className="font-display font-semibold text-4xl sm:text-6xl text-ink-950 leading-[1.05] max-w-3xl">
              Built to Carry <span className="text-gold-600">the World.</span>
            </h1>
            <p className="mt-6 text-ink-700 text-base sm:text-lg max-w-2xl leading-relaxed">
              {company.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Founder's Journey */}
      <section className="bg-cream-50 py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
              The Founder's Journey
            </span>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink-950 leading-[1.1] mb-2">
              Rohit Abii
            </h2>
            <p className="text-sm font-medium tracking-wide text-ink-700/70 uppercase mb-8">
              Founder — JE Bags &amp; Corporate Gifting
            </p>

            <p className="text-lg sm:text-xl font-display text-ink-900 leading-relaxed mb-8 border-l-2 border-gold-500 pl-5">
              Every business begins with a vision, but building one requires experience, passion,
              and the courage to evolve.
            </p>

            <div className="space-y-5 text-ink-700 text-base leading-relaxed">
              <p>
                My entrepreneurial journey began over 8–10 years ago in the textile and fabric
                industry, specialising in the import of fabrics, particularly materials used in
                bag manufacturing. Over the years, this experience helped me develop a deep
                understanding of fabric quality, sourcing, material specifications, market
                requirements, and customer expectations.
              </p>
              <p>
                With a strong foundation in the fabric industry, I saw an opportunity to take the
                next step — moving beyond fabric sourcing into the manufacturing of finished
                products.
              </p>
              <p>
                This vision led to the establishment of JE Bags &amp; Corporate Gifting, where I
                expanded my business into bag manufacturing alongside corporate gifting solutions.
              </p>
              <p>
                What started as a corporate gifting business, offering a wide range of products to
                companies across different industries, gradually evolved into a
                manufacturing-driven enterprise. Today, we have been actively involved in bag
                manufacturing for the past 2–3 years, developing products that combine
                functionality, durability, quality, and brand identity.
              </p>
              <p>
                From backpacks, laptop bags, travel bags and duffle bags to customised corporate
                merchandise and bulk gifting solutions, our focus has always been on understanding
                our clients' requirements and delivering products that meet their expectations.
              </p>
              <p>
                Over time, we have had the opportunity to work with reputed organisations and
                brands, strengthening our capabilities in product development, customisation,
                bulk manufacturing, and corporate supply.
              </p>
            </div>

            <h3 className="font-display font-semibold text-2xl text-ink-950 mt-12 mb-5">
              My Vision
            </h3>
            <div className="space-y-5 text-ink-700 text-base leading-relaxed">
              <p>
                I believe that a successful business is not just about selling products; it is
                about building trust, creating value, and developing long-term partnerships.
              </p>
              <p>
                My vision is to establish JE Bags &amp; Corporate Gifting as a trusted name in the
                corporate gifting and bag manufacturing industry, with a strong emphasis on
                manufacturing excellence, innovation, quality, and customer satisfaction.
              </p>
              <p>
                From importing fabrics to manufacturing finished products, the journey has been
                about continuously evolving, creating opportunities, and building something
                bigger.
              </p>
            </div>

            <p className="mt-10 font-display font-semibold text-xl text-gold-600 tracking-wide">
              Strong. Rising. Protected.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Full description */}
      <section className="bg-cream-50 py-20 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <Reveal>
            <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
              Who We Are
            </span>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink-950 leading-[1.1] mb-6">
              A Manufacturing Partner, <span className="text-gold-600">Not Just a Vendor.</span>
            </h2>
            <div className="space-y-5 text-ink-700 text-base leading-relaxed">
              <p>
                We offer comprehensive OEM and ODM solutions, enabling brands to manufacture
                products to their own specifications or develop new products with our product
                development capabilities.
              </p>
              <p>
                From bulk production and private-label manufacturing to custom development and
                corporate gifting, we work closely with clients to deliver on their design,
                quality, branding, and business objectives.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-4 max-w-md">
              {[
                { icon: "globe", label: "Domestic & International Reach" },
                { icon: "handshake", label: "Long-Term Partnerships" },
                { icon: "layers", label: "Scalable Production" },
                { icon: "award", label: "Quality-Focused Manufacturing" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <Icon name={item.icon} size={17} className="text-gold-600 shrink-0" />
                  <span className="text-sm font-medium text-ink-800">{item.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
              <img src={factoryPhoto} alt="Inside the JE Bags production facility" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
            </div>

            {/* floating badge */}
            <div className="absolute -bottom-6 -left-4 sm:-left-8 flex items-center gap-4 rounded-2xl bg-white border border-ink-900/10 shadow-xl shadow-ink-900/15 p-5 max-w-[230px]">
              <div className="w-11 h-11 rounded-full bg-beige-200/70 flex items-center justify-center shrink-0">
                <Icon name="handshake" size={20} className="text-gold-600" />
              </div>
              <p className="text-sm font-semibold text-ink-950 leading-snug">
                {clients.length}+ Brand Partners Served
              </p>
            </div>

            {/* decorative medallion */}
            <div className="hidden sm:flex absolute -top-5 -right-5 w-20 h-20 rounded-full bg-gold-500 flex-col items-center justify-center text-center shadow-lg shadow-ink-900/20 rotate-3">
              <Icon name="globe" size={18} className="text-ink-950 mb-1" />
              <span className="text-[9px] font-bold uppercase tracking-wide text-ink-950 leading-tight px-2">
                Pan-India &amp; Global
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="bg-beige-100 py-20 sm:py-24 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-6">
          <Reveal className="relative overflow-hidden rounded-2xl bg-cream-50 border border-gold-500/25 p-10">
            <Icon
              name="award"
              size={96}
              strokeWidth={1.2}
              className="pointer-events-none select-none absolute -right-4 -top-4 text-gold-500/[0.08]"
            />
            <Icon name="award" size={26} className="relative text-gold-600 mb-6" />
            <h3 className="relative font-display font-semibold text-2xl text-ink-950 mb-4">
              Our Mission
            </h3>
            <p className="relative text-ink-700 leading-relaxed">
              To deliver dependable, innovative, and value-driven bag manufacturing solutions
              that help businesses build successful products and brands.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="relative overflow-hidden rounded-2xl bg-cream-50 border border-gold-500/25 p-10">
            <Icon
              name="globe"
              size={96}
              strokeWidth={1.2}
              className="pointer-events-none select-none absolute -right-4 -top-4 text-gold-500/[0.08]"
            />
            <Icon name="globe" size={26} className="relative text-gold-600 mb-6" />
            <h3 className="relative font-display font-semibold text-2xl text-ink-950 mb-4">
              Our Vision
            </h3>
            <p className="relative text-ink-700 leading-relaxed">
              To establish JE BAGS as a trusted global manufacturing partner, recognized for
              product quality, customization, innovation, and long-term business relationships.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Capabilities detail */}
      <section id="capabilities" className="bg-cream-50 py-20 sm:py-24 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeading
            eyebrow="Capabilities"
            title={
              <>
                Full-Spectrum <span className="text-gold-600">Manufacturing Solutions</span>
              </>
            }
          />
          <div className="mt-14 grid sm:grid-cols-2 gap-5">
            {capabilities.map((cap, i) => (
              <Reveal key={cap.title} delay={i * 0.06}>
                <CapabilityCard cap={cap} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClientStrip items={clients} />

      {/* Why us */}
      <section id="why-us" className="bg-beige-100 py-20 sm:py-24 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeading
            eyebrow="Our Focus"
            title={
              <>
                What Sets Us <span className="text-gold-600">Apart</span>
              </>
            }
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink-900/10 rounded-2xl overflow-hidden">
            {whyUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <WhyUsCard item={item} />
              </Reveal>
            ))}
          </div>

          <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <h3 className="font-display font-semibold text-2xl sm:text-3xl text-ink-950">
              Ready to build a long-term manufacturing partnership?
            </h3>
            <Button to="/contact" variant="primary" className="whitespace-nowrap">
              Get in Touch
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

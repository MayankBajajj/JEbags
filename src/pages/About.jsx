import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import Icon from "../components/Icon";
import { capabilities, whyUs, company } from "../data/content";

export default function About() {
  return (
    <>
      <section className="bg-beige-100 pt-40 pb-20 sm:pt-48 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,135,92,0.16),_transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <Reveal>
            <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
              About JE Bags
            </span>
            <h1 className="font-display font-semibold text-4xl sm:text-6xl text-ink-950 leading-[1.05] max-w-3xl">
              Built to Carry the World.
            </h1>
            <p className="mt-6 text-ink-700 text-base sm:text-lg max-w-2xl leading-relaxed">
              {company.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Full description */}
      <section className="bg-cream-50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <Reveal className="space-y-5 text-ink-700 text-base sm:text-lg leading-relaxed">
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
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: "globe", label: "Domestic & International Reach" },
                { icon: "handshake", label: "Long-Term Partnerships" },
                { icon: "layers", label: "Scalable Production" },
                { icon: "award", label: "Quality-Focused Manufacturing" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-beige-100 border border-ink-900/10 p-6 flex flex-col gap-4 hover:border-gold-500/50 hover:bg-beige-100/70 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-cream-50 border border-gold-500/20 flex items-center justify-center">
                    <Icon name={item.icon} size={20} className="text-gold-600" />
                  </div>
                  <p className="text-ink-900 text-sm font-medium leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-beige-100 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid md:grid-cols-2 gap-6">
          <Reveal className="rounded-2xl bg-cream-50 border border-gold-500/25 p-10">
            <Icon name="award" size={26} className="text-gold-600 mb-6" />
            <h3 className="font-display font-semibold text-2xl text-ink-950 mb-4">
              Our Mission
            </h3>
            <p className="text-ink-700 leading-relaxed">
              To deliver dependable, innovative, and value-driven bag manufacturing solutions
              that help businesses build successful products and brands.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl bg-cream-50 border border-gold-500/25 p-10">
            <Icon name="globe" size={26} className="text-gold-600 mb-6" />
            <h3 className="font-display font-semibold text-2xl text-ink-950 mb-4">
              Our Vision
            </h3>
            <p className="text-ink-700 leading-relaxed">
              To establish JE BAGS as a trusted global manufacturing partner, recognized for
              product quality, customization, innovation, and long-term business relationships.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Capabilities detail */}
      <section className="bg-cream-50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeading
            eyebrow="Capabilities"
            title="Full-Spectrum Manufacturing Solutions"
          />
          <div className="mt-14 grid sm:grid-cols-2 gap-5">
            {capabilities.map((cap, i) => (
              <Reveal key={cap.title} delay={i * 0.06}>
                <div className="flex gap-5 rounded-2xl border border-ink-900/10 bg-white p-7 h-full hover:border-gold-500/50 hover:shadow-lg hover:shadow-ink-900/5 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-beige-200/70 flex items-center justify-center shrink-0">
                    <Icon name={cap.icon} size={22} className="text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-ink-950 mb-2">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-ink-700 leading-relaxed">{cap.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-beige-100 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeading eyebrow="Our Focus" title="What Sets Us Apart" />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink-900/10 rounded-2xl overflow-hidden">
            {whyUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05} className="bg-cream-50 p-8">
                <Icon name={item.icon} size={24} className="text-gold-600 mb-5" />
                <h3 className="font-display font-semibold text-base text-ink-950 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-ink-700/80 leading-relaxed">{item.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-28 bg-ink-950">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <h3 className="font-display font-semibold text-2xl sm:text-3xl text-cream-50">
            Ready to build a long-term manufacturing partnership?
          </h3>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-ink-950 hover:bg-gold-400 transition-colors whitespace-nowrap"
          >
            Get in Touch
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

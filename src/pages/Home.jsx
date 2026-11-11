import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import TrustStrip from "../components/TrustStrip";
import CategoryShowcase from "../components/CategoryShowcase";
import SplitBanner from "../components/SplitBanner";
import GlobeArt from "../components/GlobeArt";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";
import ClientStrip from "../components/ClientStrip";
import { whyUs, company, industries, exportCapabilities, clients } from "../data/content";
import { api } from "../lib/api";

import factoryPhoto from "../assets/photos/factory-photo.png";
import oemPhoto from "../assets/photos/banner-oem-photo.png";
import retailPhoto from "../assets/photos/banner-gifting-photo.png";
import zipperPhoto from "../assets/photos/zipper-texture.png";
import giftingPhoto from "../assets/photos/gifting-flatlay.png";

export default function Home() {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    api
      .get("/products?featured=true&limit=8")
      .then((d) => setBestSellers(d.items.length ? d.items : null))
      .catch(() => setBestSellers(null));
    // Fall back to the latest products if nothing is marked featured yet.
  }, []);

  useEffect(() => {
    if (bestSellers === null) {
      api
        .get("/products?limit=8")
        .then((d) => setBestSellers(d.items))
        .catch(() => {});
    }
  }, [bestSellers]);

  return (
    <>
      <Hero />
      <TrustStrip />

      {/* Product categories */}
      <section className="py-20 sm:py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-end mb-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors whitespace-nowrap"
            >
              View All Products
              <Icon name="arrow-right" size={15} />
            </Link>
          </div>
          <CategoryShowcase count={6} />
        </div>
      </section>

      {/* OEM/ODM + Retail split banners */}
      <section className="pb-20 sm:pb-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 gap-6">
          <SplitBanner
            tone="dark"
            eyebrow="OEM / ODM"
            title="Your Design. Our Manufacturing."
            description="We bring your ideas to life with custom designs, material selection, branding, and bulk production."
            ctaLabel="Start Your OEM Project"
            photo={oemPhoto}
          />
          <SplitBanner
            tone="light"
            delay={0.08}
            eyebrow="Retail / Own Brand"
            title="Premium Bags for Everyday Life."
            description="Durable, functional bags for individuals and retail customers — ready to brand as your own."
            ctaLabel="Shop Our Range"
            ctaTo="/products"
            photo={retailPhoto}
          />
        </div>
      </section>

      {/* Trusted by */}
      <ClientStrip items={clients} />

      {/* Industries served */}
      <section className="py-14 bg-beige-100 border-y border-ink-900/8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-center text-xs tracking-[0.2em] uppercase text-ink-700/60 font-medium mb-7">
            Built for Brands Across Industries
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {industries.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <Icon name={item.icon} size={18} className="text-gold-600" strokeWidth={1.6} />
                <span className="text-sm font-medium text-ink-800">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing capability */}
      <section className="py-20 sm:py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SplitBanner
            tone="dark"
            eyebrow="Our Manufacturing"
            title="Built on Capability. Driven by Quality."
            description="Our Gurugram facility is equipped to handle custom bag manufacturing for corporate, retail, and global brands — with a focus on quality, capacity, and reliability."
            photo={factoryPhoto}
            icons={[
              { icon: "shield-check", label: "Quality Control at Every Stage" },
              { icon: "pen-tool", label: "Custom Branding & Logo Application" },
              { icon: "sparkles", label: "Flexible MOQ" },
              { icon: "truck", label: "On-time Delivery" },
            ]}
          />
        </div>
      </section>

      {/* Export banner */}
      <section className="py-20 sm:py-24 bg-ink-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-400 uppercase mb-4">
              Global Reach
            </span>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-cream-50 leading-tight mb-5">
              Exporting Indian Manufacturing to the World.
            </h2>
            <p className="text-cream-100/65 leading-relaxed mb-8 max-w-md">
              We supply custom bags to international brands, importers, distributors, and
              retailers — with consistent quality, competitive pricing, and reliable delivery.
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-9 max-w-md">
              {exportCapabilities.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <Icon name={item.icon} size={17} className="text-gold-400 shrink-0" />
                  <span className="text-sm text-cream-100/80">{item.label}</span>
                </div>
              ))}
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-ink-950 hover:bg-gold-400 transition-colors w-fit"
            >
              Enquire for Export
              <Icon name="arrow-right" size={16} />
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="hidden lg:flex items-center justify-center">
            <GlobeArt className="w-full max-w-md text-cream-100/70" />
          </Reveal>
        </div>
      </section>

      {/* Best sellers */}
      {bestSellers && bestSellers.length > 0 && (
        <section className="py-20 sm:py-24 bg-cream-50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center justify-end mb-8">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-950 border-b-2 border-gold-500 pb-1 hover:text-gold-600 transition-colors whitespace-nowrap"
              >
                View All
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {bestSellers.map((product, i) => (
                <Reveal key={product._id} delay={i * 0.05}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why us + Corporate gifting split banners */}
      <section className="pb-20 sm:pb-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 gap-6">
          <SplitBanner
            tone="dark"
            eyebrow="Why Choose JE Bags"
            title="Your Reliable Manufacturing Partner."
            photo={zipperPhoto}
            icons={whyUs.slice(0, 4).map((w) => ({ icon: w.icon, label: w.title }))}
          />
          <SplitBanner
            tone="light"
            delay={0.08}
            eyebrow="Corporate Gifting"
            title="Corporate Gifting Solutions."
            description="Unique, customised gifting solutions for employees, events, and brand promotions."
            ctaLabel="Explore Corporate Gifting"
            ctaTo="/products"
            photo={giftingPhoto}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-gold-500">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-7 text-center sm:text-left">
          <Reveal>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink-950 leading-snug">
              Let's Build Something Great Together.
            </h2>
            <p className="mt-2 text-ink-950/70 text-sm sm:text-base">
              Whether it's a bulk order, custom design, or export enquiry — our team is ready to assist.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors"
            >
              Request a Quote
              <Icon name="arrow-right" size={16} />
            </Link>
            <a
              href={`tel:${company.phoneRaw}`}
              className="inline-flex items-center gap-2 rounded-full border border-ink-950/30 px-7 py-3.5 text-sm font-semibold text-ink-950 hover:bg-ink-950/5 transition-colors"
            >
              Contact Our Team
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

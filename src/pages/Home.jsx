import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Hero from "../components/Hero";
import TrustStrip from "../components/TrustStrip";
import CategoryShowcase from "../components/CategoryShowcase";
import SplitBanner from "../components/SplitBanner";
import GlobeArt from "../components/GlobeArt";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import ClientStrip from "../components/ClientStrip";
import Button from "../components/Button";
import { whyUs, company, industries, exportCapabilities, clients } from "../data/content";

import factoryPhoto from "../assets/photos/factory-photo.png";
import oemPhoto from "../assets/photos/banner-oem-photo.png";
import retailPhoto from "../assets/photos/banner-gifting-photo.png";
import zipperPhoto from "../assets/photos/zipper-texture.png";
import giftingPhoto from "../assets/photos/gifting-flatlay.png";

export default function Home() {
  // Banner photos default to the static marketing shots above, but swap in
  // a real uploaded product photo per slot as soon as one's available —
  // these banners shouldn't be the only place on the site still showing
  // stock imagery once the catalog has products in it.
  const [bannerPhotos, setBannerPhotos] = useState({
    oem: oemPhoto,
    retail: retailPhoto,
    whyUs: zipperPhoto,
    gifting: giftingPhoto,
  });

  useEffect(() => {
    let cancelled = false;
    const giftingCategory = encodeURIComponent("Corporate Gifting & Events");

    async function load() {
      // Featured products (admin-curated, via the "Feature this product"
      // checkbox) take priority over just "newest" so a stray test entry
      // in the catalog can never end up on the homepage unintended.
      const [featuredRes, generalRes, giftingFeaturedRes] = await Promise.all([
        api.get("/products?featured=true&limit=3").catch(() => null),
        api.get("/products?limit=3").catch(() => null),
        api.get(`/products?featured=true&category=${giftingCategory}&limit=1`).catch(() => null),
      ]);
      if (cancelled) return;

      const featured = featuredRes?.items || [];
      const general = generalRes?.items || [];
      const usedIds = new Set();
      const pick = () => {
        const chosen = featured.find((p) => !usedIds.has(p._id)) || general.find((p) => !usedIds.has(p._id));
        if (chosen) usedIds.add(chosen._id);
        return chosen;
      };
      const slot1 = pick();
      const slot2 = pick();
      const slot3 = pick();

      let giftingItem = giftingFeaturedRes?.items?.[0];
      if (!giftingItem) {
        const giftingRes = await api.get(`/products?category=${giftingCategory}&limit=1`).catch(() => null);
        if (cancelled) return;
        giftingItem = giftingRes?.items?.[0];
      }

      setBannerPhotos((prev) => ({
        oem: slot1?.images?.[0]?.url || prev.oem,
        retail: slot2?.images?.[0]?.url || prev.retail,
        whyUs: slot3?.images?.[0]?.url || prev.whyUs,
        gifting: giftingItem?.images?.[0]?.url || prev.gifting,
      }));
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-dvh sm:min-h-0 sm:block">
        <Hero />
        <TrustStrip />
      </div>

      {/* Product categories */}
      <section className="py-20 sm:py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between mb-8">
            <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase">
              Our Product Categories
            </span>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors whitespace-nowrap"
            >
              View All Products
              <Icon name="arrow-right" size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
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
            photo={bannerPhotos.oem}
          />
          <SplitBanner
            tone="light"
            delay={0.08}
            eyebrow="Retail / Own Brand"
            title="Premium Bags for Everyday Life."
            description="Durable, functional bags for individuals and retail customers — ready to brand as your own."
            ctaLabel="Shop Our Range"
            ctaTo="/products"
            photo={bannerPhotos.retail}
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
            <Button to="/contact" variant="primary" className="w-fit">
              Enquire for Export
            </Button>
          </Reveal>
          <Reveal delay={0.1} className="hidden lg:flex items-center justify-center">
            <GlobeArt className="w-full max-w-md text-cream-100/70" />
          </Reveal>
        </div>
      </section>

      {/* Why us + Corporate gifting split banners */}
      <section className="pb-20 sm:pb-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 gap-6">
          <SplitBanner
            tone="dark"
            eyebrow="Why Choose JE Bags"
            title="Your Reliable Manufacturing Partner."
            photo={bannerPhotos.whyUs}
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
            photo={bannerPhotos.gifting}
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-beige-100">
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
            <Button to="/contact" variant="dark">
              Request a Quote
            </Button>
            <Button href={`tel:${company.phoneRaw}`} variant="outline" icon={null}>
              Contact Our Team
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}

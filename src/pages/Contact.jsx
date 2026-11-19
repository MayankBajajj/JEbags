import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import Button from "../components/Button";
import ClientStrip from "../components/ClientStrip";
import { company, clients } from "../data/content";
import { api, ApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const reasons = [
  {
    icon: "settings-2",
    title: "Bulk & OEM Orders",
    description: "Send your specs and quantities — we'll scope production and lead time.",
    to: "/products",
  },
  {
    icon: "gift",
    title: "Corporate Gifting",
    description: "Custom-branded bags for onboarding kits, events, and client gifting.",
    to: `/products?category=${encodeURIComponent("Corporate Gifting & Events")}`,
  },
  {
    icon: "globe",
    title: "Export Enquiries",
    description: "Importers, distributors, and international retailers — let's talk supply.",
    to: "/about#capabilities",
  },
];

const inputClasses =
  "w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export default function Contact() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: "",
    message: "",
  });
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please attach an image file.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("Photo must be under 5MB.");
      return;
    }
    setError("");
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/contact" } } });
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (photo) data.append("photo", photo);

      await api.post("/enquiries", data, { isForm: true });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-beige-100 pt-28 pb-14 sm:pt-48 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(184,135,92,0.16),_transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <Reveal>
            <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
              Get in Touch
            </span>
            <h1 className="font-display font-semibold text-4xl sm:text-6xl text-ink-950 leading-[1.05] max-w-2xl">
              Let's talk about <span className="text-gold-600">your next order.</span>
            </h1>
            <p className="mt-6 text-ink-700 text-base sm:text-lg max-w-xl leading-relaxed">
              Whether it's a bulk order, a custom OEM project, or corporate gifting at scale —
              our team is ready to help.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Reasons to reach out */}
      <section className="bg-cream-50 pt-16 sm:pt-20 pb-4">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid sm:grid-cols-3 gap-5">
          {reasons.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <Link
                to={item.to}
                className="group relative overflow-hidden flex flex-col rounded-2xl border border-ink-900/10 bg-white p-7 h-full hover:border-gold-500/50 hover:shadow-lg hover:shadow-ink-900/5 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Icon
                  name={item.icon}
                  size={84}
                  strokeWidth={1.2}
                  className="pointer-events-none select-none absolute -right-3 -top-3 text-ink-900/[0.045]"
                />
                <div className="relative w-12 h-12 rounded-xl bg-beige-200/70 flex items-center justify-center mb-5">
                  <Icon name={item.icon} size={22} className="text-gold-600" />
                </div>
                <h3 className="relative font-display font-semibold text-lg text-ink-950 mb-1.5">
                  {item.title}
                </h3>
                <p className="relative text-sm text-ink-700 leading-relaxed mb-4">{item.description}</p>
                <span className="relative mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 group-hover:text-gold-700">
                  Learn more
                  <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream-50 pt-16 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12">
          {/* Contact info */}
          <Reveal className="space-y-5">
            {[
              { icon: "phone", label: "Call Us", value: company.phone, href: `tel:${company.phoneRaw}` },
              { icon: "mail", label: "Email Us", value: company.email, href: `mailto:${company.email}` },
              { icon: "map-pin", label: "Visit Us", value: company.address, href: null },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href ?? undefined}
                className={`relative overflow-hidden flex items-start gap-4 rounded-2xl border border-ink-900/10 bg-beige-100 p-7 ${
                  item.href
                    ? "hover:border-gold-500/50 hover:bg-cream-100 hover:-translate-y-0.5 hover:shadow-md hover:shadow-ink-900/5 transition-all duration-300"
                    : ""
                }`}
              >
                <Icon
                  name={item.icon}
                  size={80}
                  strokeWidth={1.2}
                  className="pointer-events-none select-none absolute -right-3 -top-3 text-ink-900/[0.05]"
                />
                <div className="relative w-12 h-12 rounded-xl bg-cream-50 border border-gold-500/20 flex items-center justify-center shrink-0">
                  <Icon name={item.icon} size={20} className="text-gold-600" />
                </div>
                <div className="relative">
                  <p className="text-xs tracking-[0.2em] text-gold-600 uppercase font-semibold mb-1.5">
                    {item.label}
                  </p>
                  <p className="text-ink-900 font-medium break-words">{item.value}</p>
                </div>
              </a>
            ))}

            <div className="rounded-2xl border border-ink-900/10 bg-white p-7">
              <p className="text-xs tracking-[0.2em] text-gold-600 uppercase font-semibold mb-3">
                Business Hours
              </p>
              <p className="text-sm text-ink-700 leading-relaxed">
                Monday – Saturday, 10:00 AM – 7:00 PM IST
              </p>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-ink-900/10 bg-white p-8 sm:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-beige-200/70 flex items-center justify-center mb-6">
                    <Icon name="check" size={28} className="text-gold-600" />
                  </div>
                  <h3 className="font-display font-semibold text-2xl text-ink-950 mb-3">
                    Message Received
                  </h3>
                  <p className="text-ink-700 max-w-sm">
                    Thank you for reaching out, {form.name.split(" ")[0] || "there"}. Our team
                    will get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", company: "", message: "" });
                      setPhoto(null);
                    }}
                    className="mt-8 text-sm font-semibold text-gold-600 border-b-2 border-gold-500 pb-1"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold tracking-wide text-ink-900 mb-2">
                        Full Name
                      </label>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wide text-ink-900 mb-2">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold tracking-wide text-ink-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        pattern="[6-9][0-9]{9}"
                        title="10-digit Indian mobile number"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wide text-ink-900 mb-2">
                        Company Name
                      </label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Your organization"
                        className={inputClasses}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wide text-ink-900 mb-2">
                      Requirement
                    </label>
                    <textarea
                      required
                      rows={5}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about the product, quantity, and timeline..."
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                  <label className="flex items-center gap-2.5 rounded-xl border border-dashed border-ink-900/20 px-4 py-3 cursor-pointer hover:border-gold-500/50 transition-colors">
                    <Icon name="paperclip" size={16} className="text-ink-700/60 shrink-0" />
                    <span className="text-sm text-ink-700/70 truncate">
                      {photo ? photo.name : "Attach a reference photo (optional)"}
                    </span>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    {photo && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPhoto(null);
                        }}
                        className="ml-auto text-ink-700/40 hover:text-red-500 transition-colors shrink-0"
                        aria-label="Remove photo"
                      >
                        <Icon name="x" size={15} />
                      </button>
                    )}
                  </label>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      {error}
                    </p>
                  )}
                  {!user && (
                    <p className="text-sm text-ink-700 bg-beige-100 border border-ink-900/10 rounded-xl px-4 py-3">
                      You'll be asked to log in before this is sent.
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={submitting}
                    variant="dark"
                    icon={submitting ? null : "arrow-right"}
                    className="w-full"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Location */}
      <section className="bg-cream-50 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
              Find Us
            </span>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink-950 mb-6">
              {company.address}
            </h2>
            <div className="rounded-2xl overflow-hidden border border-ink-900/10 h-72 sm:h-96">
              <iframe
                title="JE Bags location on Google Maps"
                src={`https://www.google.com/maps?q=${encodeURIComponent(company.address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <ClientStrip items={clients} />
    </>
  );
}

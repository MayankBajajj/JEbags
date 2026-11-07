import { useState } from "react";
import Reveal from "../components/Reveal";
import Icon from "../components/Icon";
import { company } from "../data/content";
import { api, ApiError } from "../lib/api";

const inputClasses =
  "w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/enquiries", form);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-beige-100 pt-40 pb-20 sm:pt-48 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(184,135,92,0.16),_transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <Reveal>
            <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
              Get in Touch
            </span>
            <h1 className="font-display font-semibold text-4xl sm:text-6xl text-ink-950 leading-[1.05] max-w-2xl">
              Let's talk about your next order.
            </h1>
            <p className="mt-6 text-ink-700 text-base sm:text-lg max-w-xl leading-relaxed">
              Whether it's a bulk order, a custom OEM project, or corporate gifting at scale —
              our team is ready to help.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-50 py-20 sm:py-24">
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
                className={`flex items-start gap-4 rounded-2xl border border-ink-900/10 bg-beige-100 p-7 ${
                  item.href ? "hover:border-gold-500/50 hover:bg-cream-100 transition-colors" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-cream-50 border border-gold-500/20 flex items-center justify-center shrink-0">
                  <Icon name={item.icon} size={20} className="text-gold-600" />
                </div>
                <div>
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
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-4 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                    <Icon name="arrow-right" size={16} />
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

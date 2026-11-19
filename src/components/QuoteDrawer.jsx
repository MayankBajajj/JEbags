import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuote } from "../context/QuoteContext";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";
import Icon from "./Icon";
import Button from "./Button";
import PhoneInput from "./PhoneInput";
import { inputClasses } from "../lib/formStyles";

const QTY_PRESETS = [100, 500, 1000];

function QuoteLineItem({ item }) {
  const { removeItem, updateQuantity } = useQuote();

  return (
    <div className="flex gap-3 py-4 border-b border-cream-50/10">
      {item.image ? (
        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-cream-50/10 shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-cream-50/10 flex items-center justify-center shrink-0">
          <Icon name="settings-2" size={22} className="text-cream-100/40" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-cream-50 leading-snug">{item.name}</p>
          <button
            onClick={() => removeItem(item.productId)}
            className="shrink-0 text-cream-100/40 hover:text-red-400 transition-colors"
            aria-label="Remove"
          >
            <Icon name="x" size={16} />
          </button>
        </div>
        <p className="text-xs text-cream-100/40 mt-0.5">MOQ: {item.moq} units</p>
        <div className="mt-2 flex items-center gap-1.5">
          {QTY_PRESETS.map((q) => (
            <button
              key={q}
              onClick={() => updateQuantity(item.productId, q)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                item.quantity === q
                  ? "bg-gold-500 border-gold-500 text-ink-950"
                  : "border-cream-50/20 text-cream-100/60 hover:border-gold-500/50"
              }`}
            >
              {q}
            </button>
          ))}
          <input
            type="number"
            min={item.moq}
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId, Number(e.target.value) || item.moq)}
            className="w-20 rounded-full bg-transparent border border-cream-50/20 text-cream-50 text-xs px-2.5 py-1 focus:outline-none focus:border-gold-500/60"
          />
        </div>
      </div>
    </div>
  );
}

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export default function QuoteDrawer() {
  const { items, open, closeDrawer, clearQuote, totalQuantity } = useQuote();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", company: "" });
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

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
      closeDrawer();
      navigate("/login", { state: { from: { pathname: window.location.pathname } } });
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const lines = items.map((i) => `- ${i.name} — ${i.quantity} units (MOQ ${i.moq})`).join("\n");
      const message = `Bulk quote request for ${items.length} product(s):\n${lines}${notes ? `\n\nNotes: ${notes}` : ""}`;
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.append("type", "bulk");
      data.append("estimatedQuantity", totalQuantity);
      data.append("message", message);
      if (photo) data.append("photo", photo);

      await api.post("/enquiries", data, { isForm: true });
      setSubmitted(true);
      clearQuote();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-ink-950/60 z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-ink-950 z-[61] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-50/10">
              <h2 className="font-display font-semibold text-xl text-cream-50">
                Quote Request {items.length > 0 && `(${items.length})`}
              </h2>
              <button onClick={closeDrawer} className="text-cream-100/60 hover:text-cream-50 transition-colors" aria-label="Close">
                <Icon name="x" size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center h-full py-10">
                  <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center mb-5">
                    <Icon name="check" size={26} className="text-gold-400" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-cream-50 mb-2">Quote Request Sent</h3>
                  <p className="text-sm text-cream-100/60 max-w-xs">
                    Our team will review your requirement and get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      closeDrawer();
                    }}
                    className="mt-6 text-sm font-semibold text-gold-400 border-b border-gold-500 pb-0.5"
                  >
                    Close
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-full py-10">
                  <Icon name="clipboard-check" size={36} className="text-cream-100/20 mb-4" />
                  <p className="text-sm text-cream-100/50 max-w-xs">
                    No items in your quote yet. Browse products and tap "Request Sample" to add one.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    {items.map((item) => (
                      <QuoteLineItem key={item.productId} item={item} />
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="py-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={inputClasses}
                      />
                      <input
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className={inputClasses}
                      />
                    </div>
                    <PhoneInput value={form.phone} onChange={handleChange} />
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Company (optional)"
                      className={inputClasses}
                    />
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Branding, timeline, or other notes (optional)"
                      className={`${inputClasses} resize-none`}
                    />

                    <label className="flex items-center gap-2.5 rounded-full border border-dashed border-cream-50/25 px-4 py-2.5 cursor-pointer hover:border-gold-500/50 transition-colors">
                      <Icon name="paperclip" size={16} className="text-cream-100/60 shrink-0" />
                      <span className="text-sm text-cream-100/70 truncate">
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
                          className="ml-auto text-cream-100/40 hover:text-red-400 transition-colors shrink-0"
                          aria-label="Remove photo"
                        >
                          <Icon name="x" size={15} />
                        </button>
                      )}
                    </label>

                    {error && (
                      <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">{error}</p>
                    )}
                    {!user && (
                      <p className="text-sm text-cream-100/60 bg-cream-50/5 border border-cream-50/10 rounded-lg px-3 py-2">
                        You'll be asked to log in before this is sent.
                      </p>
                    )}
                    <Button type="submit" disabled={submitting} variant="primary" icon={submitting ? null : "arrow-right"} className="w-full">
                      {submitting ? "Sending..." : "Submit Quote Request"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

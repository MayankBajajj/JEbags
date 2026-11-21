import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api, ApiError } from "../lib/api";
import Icon from "../components/Icon";
import Button from "../components/Button";
import PhoneInput from "../components/PhoneInput";
import PincodeInput from "../components/PincodeInput";
import { inputClasses } from "../lib/formStyles";

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutBanner({ eyebrow, title }) {
  return (
    <section className="bg-beige-100 pt-24 pb-10 sm:pt-36 sm:pb-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,135,92,0.16),_transparent_55%)]" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
          {eyebrow}
        </span>
        <h1 className="font-display font-semibold text-4xl sm:text-5xl text-ink-950 leading-tight">{title}</h1>
      </div>
    </section>
  );
}

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 'form' | 'awaiting-payment' | 'confirming' | 'confirmed' | 'payment-failed'
  const [step, setStep] = useState("form");
  const [order, setOrder] = useState(null);
  const [razorpayConfig, setRazorpayConfig] = useState(null);
  const [checking, setChecking] = useState(false);

  // Safety net for the rare case the webhook hasn't landed yet when our own
  // /verify call runs (normally it's the other way round and verify's own
  // response already says paid) — poll a few times instead of leaving the
  // customer stuck on a static spinner forever.
  useEffect(() => {
    if (step !== "confirming" || !order?._id) return undefined;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 8;
    let timeoutId;

    const poll = async () => {
      attempts += 1;
      try {
        const { order: checked } = await api.get(`/orders/${order._id}/reconcile`);
        if (cancelled) return;
        if (checked.paymentStatus === "paid") {
          setOrder(checked);
          setStep("confirmed");
          return;
        }
        if (checked.paymentStatus === "failed") {
          setOrder(checked);
          setStep("payment-failed");
          return;
        }
      } catch {
        // Transient network/API hiccup — just try again on the next tick.
      }
      if (!cancelled && attempts < maxAttempts) {
        timeoutId = setTimeout(poll, 3000);
      }
    };

    timeoutId = setTimeout(poll, 2000);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [step, order?._id]);

  if (items.length === 0 && step === "form") {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  const openRazorpay = async (createdOrder, config) => {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setError("Couldn't load the payment gateway. Check your connection and try again.");
      setStep("payment-failed");
      return;
    }

    const rzp = new window.Razorpay({
      key: config.razorpayKeyId,
      order_id: config.razorpayOrderId,
      amount: Math.round(config.amount * 100),
      currency: config.currency,
      name: "JE BAGS",
      description: `Order #${createdOrder._id.slice(-8).toUpperCase()}`,
      prefill: { contact: address.phone },
      theme: { color: "#0a1526" },
      handler: async (response) => {
        setStep("confirming");
        try {
          const { order: verified, paid } = await api.post(`/orders/${createdOrder._id}/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          setOrder(verified);
          // Razorpay's own signature checked out; even if `paid` isn't true
          // yet (payment still settling on their end), this was NOT a
          // failure — the webhook will confirm it momentarily, so we show
          // the reassuring "confirming" state rather than an error.
          setStep(paid ? "confirmed" : "confirming");
        } catch {
          // The browser-side verify call failed (dropped connection, etc.)
          // — Razorpay already has the money. Never show this as a failure;
          // the webhook is independently confirming it right now regardless
          // of whether this request succeeded.
          setStep("confirming");
        }
      },
    });

    rzp.on("payment.failed", () => {
      setStep("payment-failed");
      setError("Your payment didn't go through. No amount has been charged for a failed attempt.");
    });

    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(address.phone)) {
      setError("Enter a valid 10-digit mobile number (cannot start with 0-5)");
      return;
    }
    if (!/^[1-9]\d{5}$/.test(address.pincode)) {
      setError("Enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    try {
      const data = await api.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: address,
        notes: notes || undefined,
      });
      clearCart();
      setOrder(data.order);
      setRazorpayConfig({
        razorpayOrderId: data.razorpayOrderId,
        razorpayKeyId: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
      });
      setStep("awaiting-payment");
      openRazorpay(data.order, {
        razorpayOrderId: data.razorpayOrderId,
        razorpayKeyId: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    setError("");
    try {
      const { order: checked } = await api.get(`/orders/${order._id}/reconcile`);
      setOrder(checked);
      if (checked.paymentStatus === "paid") setStep("confirmed");
      else if (checked.paymentStatus === "failed") setStep("payment-failed");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't check payment status, try again.");
    } finally {
      setChecking(false);
    }
  };

  if (step === "confirmed" && order) {
    return (
      <>
        <CheckoutBanner eyebrow="Order Confirmed" title="Payment Received" />
        <section className="bg-cream-50 py-14 sm:py-16 px-5">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-beige-200/70 flex items-center justify-center mx-auto mb-6">
              <Icon name="check" size={28} className="text-gold-600" />
            </div>
            <p className="text-ink-700 mb-2">
              Order <span className="font-mono text-ink-950">#{order._id.slice(-8).toUpperCase()}</span> for{" "}
              <span className="font-semibold">₹{order.totalAmount.toLocaleString("en-IN")}</span> is confirmed.
            </p>
            <p className="text-sm text-ink-700/70 mb-8">
              A confirmation email is on its way. We'll reach out with delivery updates.
            </p>
            <Button to="/products" variant="dark">
              Continue Shopping
            </Button>
          </div>
        </section>
      </>
    );
  }

  if ((step === "confirming" || step === "payment-failed") && order) {
    return (
      <>
        <CheckoutBanner
          eyebrow={step === "confirming" ? "Confirming Payment" : "Payment Issue"}
          title={step === "confirming" ? "Almost there..." : "Payment Not Completed"}
        />
        <section className="bg-cream-50 py-14 sm:py-16 px-5">
          <div className="max-w-lg mx-auto text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                step === "confirming" ? "bg-beige-200/70" : "bg-red-50"
              }`}
            >
              {step === "confirming" ? (
                <div className="w-7 h-7 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin" />
              ) : (
                <Icon name="x" size={28} className="text-red-500" />
              )}
            </div>

            <p className="text-ink-700 mb-2">
              Order <span className="font-mono text-ink-950">#{order._id.slice(-8).toUpperCase()}</span> for{" "}
              <span className="font-semibold">₹{order.totalAmount.toLocaleString("en-IN")}</span>
            </p>
            <p className="text-sm text-ink-700/70 mb-8">
              {step === "confirming"
                ? "If you completed the payment, this confirms automatically within a few seconds — no need to pay again. If your bank shows a deduction but this doesn't update, use Check Payment Status below."
                : error || "You can retry the payment, or check status if you're unsure whether it actually went through."}
            </p>

            {error && step === "confirming" && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">{error}</p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {step === "payment-failed" && razorpayConfig && (
                <Button type="button" onClick={() => openRazorpay(order, razorpayConfig)} variant="dark">
                  Retry Payment
                </Button>
              )}
              <Button type="button" onClick={handleCheckStatus} disabled={checking} variant="outline">
                {checking ? "Checking..." : "Check Payment Status"}
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <CheckoutBanner eyebrow="Secure Checkout" title="Checkout" />
      <section className="bg-cream-50 py-14 sm:py-16 px-5">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
        <div>
          <h2 className="font-display font-semibold text-2xl text-ink-950 mb-6">Shipping Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl border border-ink-900/10 p-7">
            {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-2">Contact Phone</label>
              <PhoneInput value={address.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-2">Address Line 1</label>
              <input required name="line1" value={address.line1} onChange={handleChange} className={inputClasses} placeholder="Street, building" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-2">Address Line 2 (optional)</label>
              <input name="line2" value={address.line2} onChange={handleChange} className={inputClasses} placeholder="Landmark, floor" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-900 mb-2">City</label>
                <input required name="city" value={address.city} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-900 mb-2">State</label>
                <input required name="state" value={address.state} onChange={handleChange} className={inputClasses} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-2">Pincode</label>
              <PincodeInput value={address.pincode} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-900 mb-2">Order Notes (optional)</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputClasses} resize-none`} placeholder="Branding instructions, delivery preferences..." />
            </div>
            <Button
              type="submit"
              disabled={loading}
              variant="dark"
              icon={loading ? null : "arrow-right"}
              className="w-full"
            >
              {loading ? "Preparing Payment..." : `Pay ₹${totalAmount.toLocaleString("en-IN")}`}
            </Button>
          </form>
        </div>

        <div className="lg:sticky lg:top-28">
          <h2 className="font-display font-semibold text-2xl text-ink-950 mb-6">Order Summary</h2>
          <div className="bg-white rounded-2xl border border-ink-900/10 p-6">
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-ink-700">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-ink-950">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-ink-900/10 pt-4 flex justify-between font-display font-semibold text-ink-950">
              <span>Total</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}

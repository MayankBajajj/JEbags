import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";
import Icon from "../components/Icon";
import PhoneInput from "../components/PhoneInput";
import PincodeInput from "../components/PincodeInput";
import { inputClasses } from "../lib/formStyles";

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
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
  const [order, setOrder] = useState(null);

  if (items.length === 0 && !order) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

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
      const { order } = await api.post("/orders", {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: address,
        notes: notes || undefined,
      });
      clearCart();
      setOrder(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    return (
      <section className="bg-cream-50 pt-32 pb-24 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-beige-200/70 flex items-center justify-center mx-auto mb-6">
            <Icon name="check" size={28} className="text-gold-600" />
          </div>
          <h1 className="font-display font-semibold text-3xl text-ink-950 mb-3">Order Placed</h1>
          <p className="text-ink-700 mb-2">
            Order <span className="font-mono text-ink-950">#{order._id.slice(-8).toUpperCase()}</span> for{" "}
            <span className="font-semibold">₹{order.totalAmount.toLocaleString("en-IN")}</span> has been received.
          </p>
          <p className="text-sm text-ink-700/70 mb-8">
            Payment is currently cash-on-delivery by default — online payment is coming soon. Our team will reach out to confirm.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors"
          >
            Continue Shopping
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream-50 pt-32 pb-24 px-5">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
        <div>
          <h1 className="font-display font-semibold text-3xl text-ink-950 mb-6">Checkout</h1>
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
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors disabled:opacity-60"
            >
              {loading ? "Placing Order..." : "Place Order"}
              {!loading && <Icon name="arrow-right" size={16} />}
            </button>
          </form>
        </div>

        <div className="lg:sticky lg:top-28 bg-white rounded-2xl border border-ink-900/10 p-6">
          <h2 className="font-display font-semibold text-lg text-ink-950 mb-4">Order Summary</h2>
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
    </section>
  );
}

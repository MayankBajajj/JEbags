import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Icon from "../components/Icon";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <section className="bg-cream-50 pt-32 pb-24 px-5">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="font-display font-semibold text-3xl text-ink-950 mb-3">Your Cart is Empty</h1>
          <p className="text-ink-700 mb-8">Browse our range and add a few products to get started.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors"
          >
            Explore Products
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream-50 pt-32 pb-24 px-5">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display font-semibold text-3xl text-ink-950 mb-8">Your Cart</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 bg-white rounded-2xl border border-ink-900/10 p-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-beige-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-ink-950 truncate">{item.name}</p>
                <p className="text-sm text-ink-700/70">₹{item.price.toLocaleString("en-IN")} each</p>
                {item.moq > 1 && <p className="text-xs text-gold-600 mt-0.5">MOQ: {item.moq} units</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-ink-900/15 flex items-center justify-center text-ink-900 hover:border-gold-500"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium text-ink-950">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-ink-900/15 flex items-center justify-center text-ink-900 hover:border-gold-500"
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-medium text-ink-950 shrink-0">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => removeItem(item.productId)}
                className="shrink-0 text-ink-700/50 hover:text-red-600 transition-colors"
                aria-label="Remove"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-ink-900/10 p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-700">Subtotal</p>
            <p className="font-display font-semibold text-2xl text-ink-950">₹{totalAmount.toLocaleString("en-IN")}</p>
          </div>
          <Link
            to="/checkout"
            className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-ink-800 transition-colors"
          >
            Proceed to Checkout
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

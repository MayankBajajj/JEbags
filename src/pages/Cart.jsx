import { useCart } from "../context/CartContext";
import Icon from "../components/Icon";
import Button from "../components/Button";

function CartBanner() {
  return (
    <section className="bg-beige-100 pt-24 pb-10 sm:pt-36 sm:pb-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,135,92,0.16),_transparent_55%)]" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <span className="inline-block text-xs tracking-[0.25em] font-semibold text-gold-600 uppercase mb-3">
          Your Order
        </span>
        <h1 className="font-display font-semibold text-4xl sm:text-5xl text-ink-950 leading-tight">Your Cart</h1>
      </div>
    </section>
  );
}

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <>
        <CartBanner />
        <section className="bg-cream-50 py-16 sm:py-20 px-5">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-ink-700 mb-8">Browse our range and add a few products to get started.</p>
            <Button to="/products" variant="dark">
              Explore Products
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <CartBanner />
      <section className="bg-cream-50 py-14 sm:py-16 px-5">
      <div className="max-w-3xl mx-auto">

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
                  className="w-8 h-8 rounded-full border border-ink-900/15 flex items-center justify-center text-ink-900 hover:border-gold-500 hover:scale-110 transition-all duration-200"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium text-ink-950">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, Math.min(item.stock, item.quantity + 1))}
                  disabled={item.quantity >= item.stock}
                  className="w-8 h-8 rounded-full border border-ink-900/15 flex items-center justify-center text-ink-900 hover:border-gold-500 hover:scale-110 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-ink-900/15 disabled:hover:scale-100"
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-medium text-ink-950 shrink-0">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => removeItem(item.productId)}
                className="shrink-0 text-ink-700/50 hover:text-red-600 hover:scale-110 transition-all duration-200"
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
          <Button to="/checkout" variant="dark">
            Proceed to Checkout
          </Button>
        </div>
      </div>
      </section>
    </>
  );
}

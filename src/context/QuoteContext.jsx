import { createContext, useContext, useEffect, useState } from "react";

const QuoteContext = createContext(null);
const STORAGE_KEY = "jebags_quote";

function readQuote() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }) {
  const [items, setItems] = useState(readQuote);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore (private browsing / storage full)
    }
  }, [items]);

  const addItem = (product, quantity) => {
    const startQty = quantity ?? Math.max(product.moq || 1, 100);
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, quantity: i.quantity + startQty } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.images?.[0]?.url,
          moq: product.moq || 1,
          quantity: startQty,
        },
      ];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const item = items.find((i) => i.productId === productId);
    const min = item?.moq || 1;
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(quantity, min) } : i))
    );
  };

  const clearQuote = () => setItems([]);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <QuoteContext.Provider
      value={{
        items,
        open,
        addItem,
        removeItem,
        updateQuantity,
        clearQuote,
        openDrawer,
        closeDrawer,
        totalItems,
        totalQuantity,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}

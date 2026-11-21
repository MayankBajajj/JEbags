import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import Icon from "./Icon";
import Button from "./Button";
import { navLinks } from "../data/content";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useQuote } from "../context/QuoteContext";

function DesktopNavItem({ link }) {
  const [open, setOpen] = useState(false);

  if (!link.dropdown) {
    return (
      <NavLink
        to={link.to}
        className={({ isActive }) =>
          `group relative py-1 text-sm tracking-wide font-medium transition-colors ${
            isActive ? "text-gold-600" : "text-ink-800/80 hover:text-gold-600"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {link.label}
            <span
              className={`absolute left-0 -bottom-0.5 h-[1.5px] bg-gold-500 transition-all duration-300 ease-out ${
                isActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </>
        )}
      </NavLink>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <NavLink
        to={link.to}
        className={({ isActive }) =>
          `group relative flex items-center gap-1 py-1 text-sm tracking-wide font-medium transition-colors ${
            isActive ? "text-gold-600" : "text-ink-800/80 hover:text-gold-600"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {link.label}
            <Icon
              name="chevron-down"
              size={14}
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
            <span
              className={`absolute left-0 -bottom-0.5 h-[1.5px] bg-gold-500 transition-all duration-300 ease-out ${
                isActive || open ? "w-[calc(100%-18px)]" : "w-0 group-hover:w-[calc(100%-18px)]"
              }`}
            />
          </>
        )}
      </NavLink>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-72 z-50"
          >
            <div className="rounded-2xl border border-ink-900/10 bg-white shadow-xl shadow-ink-900/15 py-2 max-h-[70vh] overflow-y-auto">
              {link.dropdown.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025, duration: 0.18 }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block px-5 py-2.5 text-sm font-medium text-ink-800 hover:bg-gold-500 hover:text-ink-950 hover:pl-6 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavItem({ link, onNavigate }) {
  const [expanded, setExpanded] = useState(false);

  if (!link.dropdown) {
    return (
      <NavLink
        to={link.to}
        onClick={onNavigate}
        className={({ isActive }) =>
          `py-4 text-lg font-medium border-b border-ink-900/10 ${
            isActive ? "text-gold-600" : "text-ink-900/85"
          }`
        }
      >
        {link.label}
      </NavLink>
    );
  }

  return (
    <div className="border-b border-ink-900/10">
      <div className="flex items-center justify-between py-4">
        <NavLink
          to={link.to}
          onClick={onNavigate}
          className={({ isActive }) => `text-lg font-medium ${isActive ? "text-gold-600" : "text-ink-900/85"}`}
        >
          {link.label}
        </NavLink>
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-label={`Toggle ${link.label} submenu`}
          className="p-2 -mr-2 text-ink-700"
        >
          <Icon name="chevron-down" size={18} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
      {expanded && (
        <div className="pb-3 pl-4 flex flex-col gap-1">
          {link.dropdown.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={onNavigate}
              className="py-2.5 text-sm text-ink-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: quoteTotalItems, openDrawer: openQuoteDrawer } = useQuote();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="fixed top-[11px] inset-x-0 z-50 will-change-transform">
        <div className="hidden sm:block bg-ink-950 text-cream-100 text-xs tracking-[0.1em] text-center py-2 px-4 whitespace-nowrap overflow-hidden text-ellipsis">
          Pan-India Delivery &amp; Export &middot; Bulk, OEM &amp; Corporate Gifting Orders Welcome
        </div>

        <header
          className={`bg-cream-50 transition-shadow duration-300 ${
            scrolled ? "shadow-sm border-b border-ink-900/10" : "border-b border-transparent"
          }`}
        >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-20">
          <NavLink to="/" onClick={() => setOpen(false)}>
            <Logo variant="light" size="md" />
          </NavLink>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <DesktopNavItem key={link.label} link={link} />
            ))}

            <button
              onClick={openQuoteDrawer}
              aria-label="View quote request"
              className="relative text-ink-800/80 hover:text-gold-600 hover:scale-110 transition-all duration-200 inline-block"
            >
              <Icon name="clipboard-check" size={20} />
              {quoteTotalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gold-500 text-ink-950 text-[10px] font-bold flex items-center justify-center">
                  {quoteTotalItems}
                </span>
              )}
            </button>

            <NavLink to="/cart" className="relative text-ink-800/80 hover:text-gold-600 hover:scale-110 transition-all duration-200 inline-block">
              <Icon name="package" size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gold-500 text-ink-950 text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </NavLink>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-ink-800">Hi, {user.name?.split(" ")[0]}</span>
                <NavLink to="/orders" className="text-sm font-medium text-ink-700 hover:text-gold-600 transition-colors">
                  My Orders
                </NavLink>
                <button onClick={handleLogout} className="text-sm font-medium text-ink-700 hover:text-gold-600 transition-colors">
                  Log out
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="text-sm font-medium text-ink-800/80 hover:text-gold-600 transition-colors">
                Log In
              </NavLink>
            )}

            <Button to="/contact" variant="dark" size="sm">
              Request a Quote
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-4">
            <button onClick={openQuoteDrawer} aria-label="View quote request" className="relative text-ink-900">
              <Icon name="clipboard-check" size={22} />
              {quoteTotalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold-500 text-ink-950 text-[10px] font-bold flex items-center justify-center">
                  {quoteTotalItems}
                </span>
              )}
            </button>

            <NavLink to="/cart" className="relative text-ink-900">
              <Icon name="package" size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold-500 text-ink-950 text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </NavLink>
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-ink-900 p-1 relative z-50"
              aria-label="Toggle menu"
            >
              <Icon name={open ? "x" : "menu"} size={26} />
            </button>
          </div>
        </nav>
        </header>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-cream-50 pt-32 px-5 flex flex-col gap-2 overflow-y-auto">
          {navLinks.map((link) => (
            <MobileNavItem key={link.label} link={link} onNavigate={() => setOpen(false)} />
          ))}

          {user ? (
            <div className="py-4 border-b border-ink-900/10 flex items-center justify-between">
              <span className="text-lg font-medium text-ink-900/85">Hi, {user.name?.split(" ")[0]}</span>
              <div className="flex items-center gap-4">
                <NavLink to="/orders" onClick={() => setOpen(false)} className="text-sm font-semibold text-ink-700">
                  My Orders
                </NavLink>
                <button onClick={handleLogout} className="text-sm font-semibold text-gold-600">
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className="py-4 text-lg font-medium border-b border-ink-900/10 text-ink-900/85"
            >
              Log In / Sign Up
            </NavLink>
          )}

          <Button to="/contact" onClick={() => setOpen(false)} variant="dark" className="mt-6 w-full">
            Request a Quote
          </Button>
        </div>
      )}
    </>
  );
}

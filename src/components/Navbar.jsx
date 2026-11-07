import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";
import { navLinks } from "../data/content";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
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
      <div className="fixed top-0 inset-x-0 z-50">
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
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide font-medium transition-colors ${
                    isActive ? "text-gold-600" : "text-ink-800/80 hover:text-gold-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink to="/cart" className="relative text-ink-800/80 hover:text-gold-600 transition-colors">
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
                <button onClick={handleLogout} className="text-sm font-medium text-ink-700 hover:text-gold-600 transition-colors">
                  Log out
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="text-sm font-medium text-ink-800/80 hover:text-gold-600 transition-colors">
                Log In
              </NavLink>
            )}

            <NavLink
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-medium text-cream-50 hover:bg-ink-800 transition-colors"
            >
              Request a Quote
              <Icon name="arrow-right" size={15} />
            </NavLink>
          </div>

          <div className="flex md:hidden items-center gap-4">
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
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `py-4 text-lg font-medium border-b border-ink-900/10 ${
                  isActive ? "text-gold-600" : "text-ink-900/85"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <div className="py-4 border-b border-ink-900/10 flex items-center justify-between">
              <span className="text-lg font-medium text-ink-900/85">Hi, {user.name?.split(" ")[0]}</span>
              <button onClick={handleLogout} className="text-sm font-semibold text-gold-600">
                Log out
              </button>
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

          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ink-950 px-5 py-3.5 text-sm font-semibold text-cream-50"
          >
            Request a Quote
          </NavLink>
        </div>
      )}
    </>
  );
}

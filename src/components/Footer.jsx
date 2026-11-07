import { Link } from "react-router-dom";
import Logo from "./Logo";
import Icon from "./Icon";
import { company, navLinks } from "../data/content";

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-cream-100 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-12 pb-12 border-b border-ink-700">
          <div>
            <Logo variant="dark" size="md" />
            <p className="mt-5 text-sm leading-relaxed text-cream-100/60 max-w-sm">
              {company.description}
            </p>
            <p className="mt-4 text-xs tracking-[0.2em] text-gold-400 font-medium">
              {company.motto}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide text-gold-400 mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-cream-100/70 hover:text-gold-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide text-gold-400 mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-cream-100/70">
              <li className="flex items-start gap-2.5">
                <Icon name="phone" size={16} className="mt-0.5 text-gold-400 shrink-0" />
                <a href={`tel:${company.phoneRaw}`} className="hover:text-gold-300 transition-colors">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="mail" size={16} className="mt-0.5 text-gold-400 shrink-0" />
                <a href={`mailto:${company.email}`} className="hover:text-gold-300 transition-colors break-all">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="map-pin" size={16} className="mt-0.5 text-gold-400 shrink-0" />
                <span>{company.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-100/40">
          <p>© {new Date().getFullYear()} JE BAGS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <p>Global Bag Manufacturing · OEM & ODM · Private Label · Corporate Gifting</p>
            <Link to="/admin/login" className="text-cream-100/30 hover:text-gold-400 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

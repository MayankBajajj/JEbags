import { Mail, MessageCircle } from "lucide-react";
import { company } from "../data/content";

function InstagramGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const socials = [
  {
    name: "whatsapp",
    label: "Chat on WhatsApp",
    href: `https://wa.me/${company.phoneRaw.replace(/[^\d]/g, "")}`,
    icon: <MessageCircle size={18} strokeWidth={1.75} />,
  },
  {
    name: "instagram",
    label: "Follow on Instagram",
    href: "https://www.instagram.com/je_bagsandcorporategifting?obrf=Y3QzYTZ4NTNvNnI0",
    icon: <InstagramGlyph />,
  },
  {
    name: "email",
    label: "Email Us",
    href: `mailto:${company.email}`,
    icon: <Mail size={18} strokeWidth={1.75} />,
  },
];

export default function SocialRail() {
  return (
    <div className="hidden lg:flex flex-col items-center gap-5 fixed right-4 top-1/2 -translate-y-1/2 z-40">
      <span className="w-px h-16 bg-ink-900/15" />
      {socials.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="group w-10 h-10 rounded-full bg-cream-50 border border-ink-900/10 flex items-center justify-center text-ink-700 hover:bg-ink-950 hover:border-ink-950 hover:text-gold-400 hover:scale-110 hover:shadow-lg hover:shadow-ink-900/15 transition-all duration-300"
        >
          {s.icon}
        </a>
      ))}
      <span className="w-px h-16 bg-ink-900/15" />
    </div>
  );
}

import { company } from "../data/content";

function WhatsAppGlyph({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
      />
      <path
        fill="#fff"
        d="M12.014 2.5a9.49 9.49 0 00-8.12 14.37L2.5 21.5l4.76-1.368A9.49 9.49 0 1012.014 2.5zm0 1.76a7.72 7.72 0 016.577 11.78l-.242.385.784 2.864-2.94-.767-.372.22a7.714 7.714 0 01-3.807 1.004h-.004a7.73 7.73 0 01-6.69-11.605A7.676 7.676 0 0112.014 4.26z"
      />
    </svg>
  );
}

function InstagramGlyph({ size = 40 }) {
  const gradientId = "ig-gradient";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <radialGradient id={gradientId} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="20%" stopColor="#FCAF45" />
          <stop offset="40%" stopColor="#F77737" />
          <stop offset="60%" stopColor="#F56040" />
          <stop offset="75%" stopColor="#FD1D1D" />
          <stop offset="90%" stopColor="#E1306C" />
          <stop offset="100%" stopColor="#833AB4" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill={`url(#${gradientId})`} />
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.2" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="15.3" cy="8.7" r="0.85" fill="#fff" />
    </svg>
  );
}

function MailGlyph({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#EA4335" />
      <rect x="5.5" y="7.5" width="13" height="9" rx="1.6" fill="none" stroke="#fff" strokeWidth="1.4" />
      <path d="M6 8.3l6 4.8 6-4.8" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const socials = [
  {
    name: "whatsapp",
    label: "Chat on WhatsApp",
    href: `https://wa.me/${company.phoneRaw.replace(/[^\d]/g, "")}`,
    icon: <WhatsAppGlyph />,
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
    icon: <MailGlyph />,
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
          className="w-10 h-10 rounded-full overflow-hidden shadow-sm hover:scale-110 hover:shadow-lg hover:shadow-ink-900/20 transition-all duration-300"
        >
          {s.icon}
        </a>
      ))}
      <span className="w-px h-16 bg-ink-900/15" />
    </div>
  );
}

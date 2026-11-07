const common = {
  fill: "none",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Backpack() {
  return (
    <g>
      <path d="M44 34c0-7 5.5-12.5 12-12.5S68 27 68 34v8H44z" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <rect x="30" y="38" width="56" height="60" rx="18" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <rect x="40" y="62" width="36" height="26" rx="9" stroke="currentColor" {...common} />
      <path d="M38 40c-6 16-6 42 0 58M78 40c6 16 6 42 0 58" stroke="currentColor" {...common} />
      <path d="M50 50h16" stroke="#c89a3f" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Briefcase() {
  return (
    <g>
      <rect x="22" y="44" width="72" height="48" rx="8" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M46 44v-8a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v8" stroke="currentColor" {...common} />
      <path d="M22 66h72" stroke="#c89a3f" strokeWidth="3" />
      <rect x="53" y="62" width="10" height="8" rx="2" stroke="currentColor" {...common} />
    </g>
  );
}

function Luggage() {
  return (
    <g>
      <rect x="32" y="30" width="52" height="68" rx="10" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M50 30v-6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6" stroke="currentColor" {...common} />
      <path d="M32 50h52M32 78h52" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M48 50v28M68 50v28" stroke="#c89a3f" strokeWidth="3" />
      <circle cx="44" cy="100" r="3.5" fill="currentColor" />
      <circle cx="72" cy="100" r="3.5" fill="currentColor" />
    </g>
  );
}

function Duffel() {
  return (
    <g>
      <rect x="16" y="46" width="88" height="42" rx="21" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M40 46c0-8 5-14 20-14s20 6 20 14" stroke="currentColor" {...common} />
      <path d="M16 67h88" stroke="#c89a3f" strokeWidth="3" strokeDasharray="1 9" />
      <path d="M38 46v8M82 46v8" stroke="currentColor" strokeWidth="3" />
    </g>
  );
}

function Insulated() {
  return (
    <g>
      <rect x="24" y="32" width="72" height="64" rx="14" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M40 32v-6a6 6 0 0 1 6-6h28a6 6 0 0 1 6 6v6" stroke="currentColor" {...common} />
      <path d="M24 58h72M24 70h72" stroke="currentColor" strokeWidth="2" strokeDasharray="1 7" opacity="0.5" />
      <rect x="50" y="78" width="20" height="10" rx="3" stroke="#c89a3f" strokeWidth="3" />
    </g>
  );
}

function Messenger() {
  return (
    <g>
      <path d="M20 26c18 10 60 10 78 0" stroke="currentColor" {...common} />
      <rect x="26" y="50" width="68" height="44" rx="10" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M26 56c10 8 58 8 68 0v14c-10 10-58 10-68 0z" stroke="currentColor" {...common} />
      <rect x="54" y="62" width="12" height="9" rx="2" stroke="#c89a3f" strokeWidth="3" />
    </g>
  );
}

function Tote() {
  return (
    <g>
      <path d="M34 44h52l6 54H28z" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M42 44v-8c0-9 7-16 18-16s18 7 18 16v8" stroke="currentColor" {...common} />
      <path d="M34 60h52" stroke="#c89a3f" strokeWidth="3" />
    </g>
  );
}

function Shopper() {
  return (
    <g>
      <path d="M30 42h60l5 56H25z" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M44 42c0-12 5-22 16-22s16 10 16 22" stroke="currentColor" {...common} />
      <path d="M30 56h60" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M40 70h40" stroke="#c89a3f" strokeWidth="3" strokeDasharray="1 8" />
    </g>
  );
}

function Gift() {
  return (
    <g>
      <rect x="26" y="40" width="68" height="56" rx="8" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M60 40v56M26 66h68" stroke="#c89a3f" strokeWidth="4" />
      <path d="M46 40c0-10 8-16 14-10 6-6 14 0 14 10" stroke="currentColor" {...common} />
    </g>
  );
}

function Pouch() {
  return (
    <g>
      <rect x="30" y="42" width="60" height="44" rx="16" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M40 42c4-10 36-10 40 0" stroke="currentColor" {...common} />
      <path d="M30 56h60" stroke="#c89a3f" strokeWidth="3" strokeDasharray="1 7" />
      <circle cx="78" cy="42" r="4" stroke="currentColor" strokeWidth="2.5" />
    </g>
  );
}

function Tool() {
  return (
    <g>
      <rect x="16" y="50" width="88" height="40" rx="12" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M38 50c0-8 5-14 22-14s22 6 22 14" stroke="currentColor" {...common} />
      <rect x="26" y="60" width="16" height="18" rx="4" stroke="#c89a3f" strokeWidth="3" />
      <rect x="78" y="60" width="16" height="18" rx="4" stroke="currentColor" strokeWidth="2.5" />
    </g>
  );
}

function Garment() {
  return (
    <g>
      <path d="M38 30h44v66H38z" className="fill-current opacity-[0.07]" stroke="currentColor" {...common} />
      <path d="M50 30c0-8 4.5-14 10-14s10 6 10 14" stroke="currentColor" {...common} />
      <circle cx="60" cy="18" r="4" stroke="#c89a3f" strokeWidth="3" />
      <path d="M38 50h44" stroke="currentColor" strokeWidth="2" strokeDasharray="1 7" opacity="0.4" />
    </g>
  );
}

const map = {
  backpack: Backpack,
  briefcase: Briefcase,
  luggage: Luggage,
  duffel: Duffel,
  insulated: Insulated,
  messenger: Messenger,
  tote: Tote,
  shopper: Shopper,
  gift: Gift,
  pouch: Pouch,
  tool: Tool,
  garment: Garment,
};

export default function ProductArt({ type, className = "" }) {
  const Shape = map[type] || Tote;
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <Shape />
    </svg>
  );
}

export default function AuthCard({ eyebrow, title, subtitle, children }) {
  return (
    <section className="min-h-screen bg-beige-100 flex items-center justify-center px-5 py-28">
      <div className="w-full max-w-md bg-cream-50 rounded-2xl border border-ink-900/10 p-8 sm:p-10 shadow-sm">
        {eyebrow && (
          <span className="block text-xs tracking-[0.25em] font-semibold uppercase text-gold-600 mb-3">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display font-semibold text-2xl sm:text-3xl text-ink-950 leading-tight">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-ink-700">{subtitle}</p>}
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}

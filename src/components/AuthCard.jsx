export default function AuthCard({ eyebrow, title, subtitle, children }) {
  return (
    <>
      <section className="bg-beige-100 pt-24 pb-10 sm:pt-36 sm:pb-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,135,92,0.16),_transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative text-center">
          {eyebrow && (
            <span className="inline-block text-xs tracking-[0.25em] font-semibold uppercase text-gold-600 mb-3">
              {eyebrow}
            </span>
          )}
          <h1 className="font-display font-semibold text-3xl sm:text-5xl text-ink-950 leading-tight">
            {title}
          </h1>
          {subtitle && <p className="mt-3 text-ink-700 text-sm sm:text-base max-w-md mx-auto">{subtitle}</p>}
        </div>
      </section>
      <section className="min-h-[50vh] bg-cream-50 flex items-start justify-center px-5 py-14 sm:py-16">
        <div className="w-full max-w-md bg-white rounded-2xl border border-ink-900/10 p-8 sm:p-10 shadow-sm">
          {children}
        </div>
      </section>
    </>
  );
}

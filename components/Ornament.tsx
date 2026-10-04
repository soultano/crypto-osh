// Decorative motifs inspired by Uzbek suzani embroidery and Registan
// majolica tiles. Purely presentational, hidden from assistive tech.

export function Rosette({ className, size = 160 }: { className?: string; size?: number }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className={className} width={size} height={size} viewBox="-100 -100 200 200" aria-hidden="true">
      <circle r="96" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".5" />
      <circle r="88" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" opacity=".6" />
      {petals.map((a) => (
        <path
          key={a}
          transform={`rotate(${a})`}
          d="M0-82 C18-60 18-38 0-26 C-18-38 -18-60 0-82Z"
          fill="currentColor"
          opacity=".85"
        />
      ))}
      {petals.map((a) => (
        <circle key={`d${a}`} transform={`rotate(${a + 15})`} cx="0" cy="-58" r="4" fill="var(--saffron)" />
      ))}
      <circle r="24" fill="var(--pomegranate)" />
      <circle r="14" fill="none" stroke="var(--cream)" strokeWidth="2" />
      <circle r="5" fill="var(--saffron)" />
    </svg>
  );
}

export function IkatBand({ className }: { className?: string }) {
  return <div className={`ikat ${className ?? ""}`} aria-hidden="true" />;
}

export function Divider() {
  return (
    <svg className="divider" viewBox="0 0 240 24" aria-hidden="true">
      <path d="M0 12H96" stroke="currentColor" strokeWidth="1" />
      <path d="M144 12H240" stroke="currentColor" strokeWidth="1" />
      <path d="M120 0L132 12L120 24L108 12Z" fill="var(--saffron)" />
      <path d="M120 6L126 12L120 18L114 12Z" fill="var(--pomegranate)" />
      <circle cx="100" cy="12" r="2.5" fill="currentColor" />
      <circle cx="140" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

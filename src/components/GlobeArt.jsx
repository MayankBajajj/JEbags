export default function GlobeArt({ className = "" }) {
  const nodes = [
    { x: 90, y: 80 },
    { x: 180, y: 60 },
    { x: 150, y: 150 },
    { x: 230, y: 130 },
    { x: 100, y: 180 },
    { x: 200, y: 200 },
  ];

  return (
    <svg viewBox="0 0 300 260" className={className} fill="none">
      <circle cx="150" cy="130" r="105" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <ellipse cx="150" cy="130" rx="105" ry="40" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <ellipse cx="150" cy="130" rx="60" ry="105" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <ellipse cx="150" cy="130" rx="105" ry="75" stroke="currentColor" strokeWidth="1" opacity="0.18" />
      <line x1="45" y1="130" x2="255" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.25" />

      {nodes.map((n, i) => {
        const next = nodes[(i + 1) % nodes.length];
        return (
          <path
            key={`l${i}`}
            d={`M${n.x},${n.y} Q${(n.x + next.x) / 2},${Math.min(n.y, next.y) - 30} ${next.x},${next.y}`}
            stroke="#d9af5c"
            strokeWidth="1"
            opacity="0.5"
            fill="none"
          />
        );
      })}

      {nodes.map((n, i) => (
        <g key={`n${i}`}>
          <circle cx={n.x} cy={n.y} r="9" fill="#d9af5c" opacity="0.12" />
          <circle cx={n.x} cy={n.y} r="3.5" fill="#d9af5c" />
        </g>
      ))}
    </svg>
  );
}

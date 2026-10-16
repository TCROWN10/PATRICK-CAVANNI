// Rounded so server and client stringify identical style values during hydration.
function seeded(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
}

export function Sparkles({ count = 18 }: { count?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {Array.from({ length: count }, (_, i) => {
        const size = Math.round(2 + seeded(i + 1) * 5);
        return (
          <span
            key={i}
            className="sparkle"
            style={{
              left: `${Math.round(seeded(i + 100) * 100)}%`,
              width: size,
              height: size,
              animationDuration: `${Math.round(9 + seeded(i + 200) * 12)}s`,
              animationDelay: `-${Math.round(seeded(i + 300) * 20)}s`,
            }}
          />
        );
      })}
    </div>
  );
}

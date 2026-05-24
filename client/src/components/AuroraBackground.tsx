/**
 * DESIGN PHILOSOPHY: Holographic Glass — animated aurora blobs in background.
 */
export default function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div
        className="aurora-blob aurora-1"
        style={{
          top: "-10%",
          left: "-5%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(circle, oklch(0.62 0.25 295 / 0.55), transparent 60%)",
        }}
      />
      <div
        className="aurora-blob aurora-2"
        style={{
          top: "10%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle, oklch(0.78 0.18 200 / 0.45), transparent 60%)",
        }}
      />
      <div
        className="aurora-blob aurora-3"
        style={{
          bottom: "-15%",
          left: "30%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle, oklch(0.72 0.22 340 / 0.4), transparent 60%)",
        }}
      />
      {/* subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.98 0.005 250) 1px, transparent 1px), linear-gradient(90deg, oklch(0.98 0.005 250) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}

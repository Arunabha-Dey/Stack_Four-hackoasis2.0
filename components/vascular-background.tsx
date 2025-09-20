"use client"

export function VascularBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Arterial network - blood red */}
          <path
            d="M0 400 Q300 200 600 400 T1200 400"
            stroke="oklch(0.65 0.25 15)"
            strokeWidth="3"
            className="pulse-glow"
          />
          <path
            d="M0 300 Q200 100 400 300 Q600 500 800 300 Q1000 100 1200 300"
            stroke="oklch(0.65 0.25 15)"
            strokeWidth="2"
            className="pulse-glow"
          />

          {/* Venous network - neon blue */}
          <path
            d="M0 500 Q400 700 800 500 Q1000 300 1200 500"
            stroke="oklch(0.7 0.3 240)"
            strokeWidth="2"
            className="pulse-glow"
          />
          <path
            d="M200 0 Q400 200 600 0 Q800 200 1000 0"
            stroke="oklch(0.7 0.3 240)"
            strokeWidth="1.5"
            className="pulse-glow"
          />

          {/* Capillary network - subtle connections */}
          <path
            d="M100 200 L300 400 L500 200 L700 400 L900 200 L1100 400"
            stroke="oklch(0.75 0.3 220)"
            strokeWidth="1"
            opacity="0.6"
            className="pulse-glow"
          />
        </svg>
      </div>

      <div className="absolute inset-0 vascular-flow opacity-10" />

      <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary pulse-glow" />
      <div className="absolute top-3/4 right-1/4 w-3 h-3 rounded-full bg-accent pulse-glow" />
      <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-chart-3 pulse-glow" />
    </div>
  )
}

export default VascularBackground

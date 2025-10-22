"use client"

import { useEffect, useState } from "react"

export function ChemicalLoader({ onComplete, duration = 3000 }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          onComplete?.()
          return 100
        }
        return prev + 1
      })
    }, duration / 100)

    return () => clearInterval(interval)
  }, [duration, onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 px-4">
        {/* Beaker Animation */}
        <div className="relative h-40 w-32">
          {/* Beaker Container */}
          <div className="absolute bottom-0 left-1/2 h-32 w-24 -translate-x-1/2 rounded-b-2xl border-4 border-primary bg-card">
            {/* Liquid Fill */}
            <div
              className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-primary/20 transition-all duration-300 ease-out"
              style={{ height: `${progress}%` }}
            >
              {/* Bubbles */}
              <div className="absolute bottom-2 left-3 h-2 w-2 rounded-full bg-primary/40 animate-molecule-float" />
              <div
                className="absolute bottom-4 right-3 h-3 w-3 rounded-full bg-primary/30 animate-molecule-float"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute bottom-6 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary/50 animate-molecule-float"
                style={{ animationDelay: "1s" }}
              />
            </div>

            {/* Measurement Lines */}
            <div className="absolute left-0 top-1/4 h-px w-2 bg-primary/40" />
            <div className="absolute left-0 top-1/2 h-px w-3 bg-primary/40" />
            <div className="absolute left-0 top-3/4 h-px w-2 bg-primary/40" />
          </div>

          {/* Beaker Top */}
          <div className="absolute left-1/2 top-0 h-8 w-28 -translate-x-1/2 rounded-t-lg border-4 border-b-0 border-primary bg-card" />

          {/* Molecular Particles */}
          <div className="absolute -right-8 top-8 h-3 w-3 rounded-full bg-secondary animate-pulse" />
          <div
            className="absolute -left-8 top-12 h-2 w-2 rounded-full bg-accent animate-pulse"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="absolute -right-6 top-20 h-2 w-2 rounded-full bg-secondary animate-pulse"
            style={{ animationDelay: "0.6s" }}
          />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-2xl font-semibold text-foreground md:text-3xl">Processando</h2>
          <p className="text-sm text-muted-foreground md:text-base">Analisando compostos químicos...</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-primary">{progress}%</span>
          </div>
        </div>

        {/* Chemical Formula Animation */}
        <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
          <span className="animate-pulse">H₂O</span>
          <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>
            •
          </span>
          <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>
            NaCl
          </span>
          <span className="animate-pulse" style={{ animationDelay: "0.6s" }}>
            •
          </span>
          <span className="animate-pulse" style={{ animationDelay: "0.8s" }}>
            CO₂
          </span>
        </div>
      </div>
    </div>
  )
}

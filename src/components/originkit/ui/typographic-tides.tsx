/* eslint-disable */
// Originkit — props baked into the default export.
"use client"

import * as React from "react"
import { useEffect, useRef } from "react"

const MAX_DPR = 2
const REF_WIDTH = 1200

type RGBA = [number, number, number, number]

function parseColor(input: string | undefined, fallback: RGBA): RGBA {
  if (!input) return fallback
  let s = String(input).trim()
  if (s.slice(0, 4).toLowerCase() === "var(") {
    const comma = s.indexOf(",")
    const close = s.lastIndexOf(")")
    if (comma < 0 || close < comma) return fallback
    s = s.slice(comma + 1, close).trim()
  }
  if (s[0] === "#") {
    let h = s.slice(1)
    if (h.length === 3 || h.length === 4) {
      let x = ""
      for (const c of h) x += c + c
      h = x
    }
    if (h.length === 6) h += "ff"
    if (h.length !== 8 || /[^0-9a-f]/i.test(h)) return fallback
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
      parseInt(h.slice(6, 8), 16) / 255,
    ]
  }
  const m = s.match(/^(rgba?|hsla?)\(([^)]*)\)$/i)
  if (!m) return fallback
  const parts = m[2].split(/[\s,/]+/).filter((p) => p.length > 0)
  if (parts.length < 3) return fallback
  const num = (t: string, scale: number) => {
    const v = parseFloat(t)
    if (!Number.isFinite(v)) return 0
    return t.indexOf("%") >= 0 ? (v / 100) * scale : v
  }
  const alpha = parts.length > 3 ? Math.max(0, Math.min(1, num(parts[3], 1))) : 1
  if (m[1].toLowerCase().slice(0, 3) === "rgb") {
    return [
      Math.max(0, Math.min(1, num(parts[0], 255) / 255)),
      Math.max(0, Math.min(1, num(parts[1], 255) / 255)),
      Math.max(0, Math.min(1, num(parts[2], 255) / 255)),
      alpha,
    ]
  }
  return fallback
}

export interface TypographicTidesProps {
  text?: string | string[]
  subtext?: string
  background?: string
  textColor?: string
  accent?: string
  secondaryColor?: string
  amplitude?: number // wave height (px)
  frequency?: number // wave density
  speed?: number // tide oscillation rate
  layers?: number // number of depth echo layers (1-5)
  damping?: number // mouse response smoothing
  showContourLines?: boolean // bathymetric / tide grid lines
  font?: React.CSSProperties
  style?: React.CSSProperties
  className?: string
  interactive?: boolean
  onWaveClick?: (tidePhase: number) => void
}

function __OriginkitBase_TypographicTides(props: TypographicTidesProps) {
  const {
    text = "TYPOGRAPHIC TIDES",
    subtext,
    background = "#09090b",
    textColor = "#FFFFFF",
    accent = "#C084FC",
    secondaryColor = "#38BDF8",
    amplitude = 38,
    frequency = 0.015,
    speed = 1.8,
    layers = 4,
    damping = 0.08,
    showContourLines = true,
    font = {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 800,
      fontSize: "76px",
      lineHeight: "1.1em",
      letterSpacing: "-0.02em",
    },
    style,
    className = "",
    interactive = true,
    onWaveClick,
  } = props

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Live prop ref so inline arrays/objects never tear down or flicker the canvas
  const liveRef = useRef({
    lines: Array.isArray(text) ? text : [text],
    subtext,
    background,
    textColor,
    accent,
    secondaryColor,
    amplitude,
    frequency,
    speed,
    layers,
    damping,
    showContourLines,
    font,
    onWaveClick,
  })
  liveRef.current = {
    lines: Array.isArray(text) ? text : [text],
    subtext,
    background,
    textColor,
    accent,
    secondaryColor,
    amplitude,
    frequency,
    speed,
    layers,
    damping,
    showContourLines,
    font,
    onWaveClick,
  }

  // Live mutable animation state
  const state = useRef({
    time: 0,
    pointerX: -9999,
    pointerY: -9999,
    targetPointerX: -9999,
    targetPointerY: -9999,
    isHovering: false,
    clickRippleRadius: 0,
    clickRippleAlpha: 0,
    clickRippleOrigin: { x: 0, y: 0 },
    width: 0,
    height: 0,
    dpr: 1,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animationFrameId = 0
    let lastTimestamp = performance.now()
    let isVisible = true
    let cachedFontKey = ""
    let charWidthCache = new Map<string, number>()

    const handleResize = () => {
      const w = Math.max(1, Math.floor(container.clientWidth))
      const h = Math.max(1, Math.floor(container.clientHeight))
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

      const targetW = Math.floor(w * dpr)
      const targetH = Math.floor(h * dpr)
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW
        canvas.height = targetH
      }

      state.current.width = w
      state.current.height = h
      state.current.dpr = dpr
    }

    handleResize()
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      state.current.targetPointerX = e.clientX - rect.left
      state.current.targetPointerY = e.clientY - rect.top
      state.current.isHovering = true
    }

    const handlePointerLeave = () => {
      state.current.isHovering = false
      state.current.targetPointerX = -9999
      state.current.targetPointerY = -9999
    }

    const handlePointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      state.current.clickRippleOrigin = { x, y }
      state.current.clickRippleRadius = 0
      state.current.clickRippleAlpha = 1.0
      if (liveRef.current.onWaveClick) {
        liveRef.current.onWaveClick(state.current.time)
      }
    }

    if (interactive) {
      container.addEventListener("pointermove", handlePointerMove)
      container.addEventListener("pointerleave", handlePointerLeave)
      container.addEventListener("pointerdown", handlePointerDown)
    }

    const getCharWidth = (ch: string) => {
      let w = charWidthCache.get(ch)
      if (w === undefined) {
        w = ctx.measureText(ch).width
        charWidthCache.set(ch, w)
      }
      return w
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Main Kinetic Tidal Render Loop
    const render = (timestamp: number) => {
      if (!isVisible || document.hidden) {
        animationFrameId = 0
        return
      }

      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.05)
      lastTimestamp = timestamp

      const L = liveRef.current
      if (!prefersReducedMotion) {
        state.current.time += dt * L.speed
      }

      const s = state.current
      if (s.isHovering) {
        s.pointerX += (s.targetPointerX - s.pointerX) * L.damping
        s.pointerY += (s.targetPointerY - s.pointerY) * L.damping
      } else {
        s.pointerX += (s.width * 0.5 + Math.sin(s.time * 0.8) * s.width * 0.25 - s.pointerX) * 0.03
        s.pointerY += (s.height * 0.5 + Math.cos(s.time * 0.6) * s.height * 0.2 - s.pointerY) * 0.03
      }

      if (s.clickRippleAlpha > 0.01) {
        s.clickRippleRadius += dt * 320
        s.clickRippleAlpha = Math.max(0, s.clickRippleAlpha - dt * 1.2)
      }

      const { width: w, height: h, dpr } = s
      if (w <= 0 || h <= 0) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      ctx.save()
      ctx.scale(dpr, dpr)

      ctx.fillStyle = L.background
      ctx.fillRect(0, 0, w, h)

      const accentRGBA = parseColor(L.accent, [0.75, 0.52, 0.98, 1])
      const secondaryRGBA = parseColor(L.secondaryColor, [0.22, 0.74, 0.97, 1])
      const textRGBA = parseColor(L.textColor, [1, 1, 1, 1])

      // Bathymetric Contour Tide Lines
      if (L.showContourLines) {
        ctx.save()
        const contourCount = 8
        const ar = Math.round(accentRGBA[0] * 255)
        const ag = Math.round(accentRGBA[1] * 255)
        const ab = Math.round(accentRGBA[2] * 255)

        for (let c = 0; c < contourCount; c++) {
          const frac = (c + 1) / (contourCount + 1)
          const baseY = h * frac
          const phaseOffset = c * 0.75 + s.time * 0.6

          ctx.beginPath()
          for (let x = 0; x <= w; x += 14) {
            const wave1 = Math.sin(x * L.frequency * 0.8 + phaseOffset) * (L.amplitude * 0.45)
            const wave2 = Math.cos(x * L.frequency * 1.6 - phaseOffset * 0.5) * (L.amplitude * 0.2)

            const dx = x - s.pointerX
            const dy = baseY - s.pointerY
            const dist = Math.hypot(dx, dy)
            const swell = Math.exp(-dist * 0.008) * (L.amplitude * 0.8) * Math.sin(dist * 0.04 - s.time * 2.5)

            const y = baseY + wave1 + wave2 + swell
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }

          const lineAlpha = (0.06 + (c / contourCount) * 0.12).toFixed(3)
          ctx.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, ${lineAlpha})`
          ctx.lineWidth = c % 2 === 0 ? 1 : 0.75
          ctx.setLineDash(c % 3 === 0 ? [3, 6] : [])
          ctx.stroke()
        }
        ctx.restore()
      }

      // Font calculations
      const rawFontSize = L.font?.fontSize
      const parsedSize = Math.max(14, parseFloat(String(rawFontSize ?? 64)) || 64)
      const scaleFactor = Math.min(1.2, Math.max(0.45, w / REF_WIDTH))
      const fontSizePx = Math.round(parsedSize * scaleFactor)
      const lineHeightPx = fontSizePx * 1.15
      const fontFamily = (L.font?.fontFamily as string) || "'Syne', 'Inter', sans-serif"
      const fontWeight = L.font?.fontWeight || 800
      const fontKey = `${fontWeight} ${fontSizePx}px ${fontFamily}`

      if (fontKey !== cachedFontKey) {
        cachedFontKey = fontKey
        charWidthCache = new Map<string, number>()
      }

      ctx.font = fontKey
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const totalBlockHeight = L.lines.length * lineHeightPx
      const startY = (h - totalBlockHeight) / 2 + lineHeightPx / 2

      // Precompute line char widths once per font metric
      const layerCount = Math.max(1, Math.min(5, L.layers))
      const lineMetrics = L.lines.map((lineText) => {
        const chars = lineText.split("")
        let totalWidth = 0
        const widths = chars.map((ch) => {
          const cw = getCharWidth(ch)
          totalWidth += cw
          return cw
        })
        return { chars, widths, totalWidth }
      })

      for (let l = 0; l < layerCount; l++) {
        const isForeLayer = l === layerCount - 1
        const layerFrac = l / Math.max(1, layerCount - 1)
        const layerPhase = s.time + l * 0.45
        const layerAmp = L.amplitude * (0.35 + layerFrac * 0.65)

        if (isForeLayer) {
          ctx.fillStyle = `rgba(${Math.round(textRGBA[0] * 255)}, ${Math.round(textRGBA[1] * 255)}, ${Math.round(textRGBA[2] * 255)}, 0.96)`
        } else {
          const blendR = Math.round(accentRGBA[0] * (1 - layerFrac) * 255 + secondaryRGBA[0] * layerFrac * 255)
          const blendG = Math.round(accentRGBA[1] * (1 - layerFrac) * 255 + secondaryRGBA[1] * layerFrac * 255)
          const blendB = Math.round(accentRGBA[2] * (1 - layerFrac) * 255 + secondaryRGBA[2] * layerFrac * 255)
          const alpha = (0.15 + layerFrac * 0.4).toFixed(3)
          ctx.fillStyle = `rgba(${blendR}, ${blendG}, ${blendB}, ${alpha})`
        }

        lineMetrics.forEach(({ chars, widths, totalWidth }, lineIdx) => {
          const lineCenterY = startY + lineIdx * lineHeightPx
          let currentX = (w - totalWidth) / 2

          for (let i = 0; i < chars.length; i++) {
            const ch = chars[i]
            const charWidth = widths[i]
            const charCenterX = currentX + charWidth / 2

            const waveX = charCenterX * L.frequency
            const displacement =
              Math.sin(waveX + layerPhase) * layerAmp +
              Math.cos(waveX * 0.6 - layerPhase * 0.8) * (layerAmp * 0.4)

            const dx = charCenterX - s.pointerX
            const dy = lineCenterY - s.pointerY
            const dist = Math.hypot(dx, dy)
            const pointerSwell =
              Math.exp(-dist * 0.007) * (L.amplitude * 1.1) * Math.sin(dist * 0.05 - s.time * 3)

            let clickSwell = 0
            if (s.clickRippleAlpha > 0) {
              const rdx = charCenterX - s.clickRippleOrigin.x
              const rdy = lineCenterY - s.clickRippleOrigin.y
              const rDist = Math.hypot(rdx, rdy)
              const rippleDiff = Math.abs(rDist - s.clickRippleRadius)
              if (rippleDiff < 45) {
                clickSwell = Math.cos((rippleDiff / 45) * (Math.PI / 2)) * s.clickRippleAlpha * (L.amplitude * 1.2)
              }
            }

            const charY = lineCenterY + displacement + pointerSwell + clickSwell

            const nextWaveX = (charCenterX + 4) * L.frequency
            const nextDisp =
              Math.sin(nextWaveX + layerPhase) * layerAmp +
              Math.cos(nextWaveX * 0.6 - layerPhase * 0.8) * (layerAmp * 0.4)
            const angle = Math.atan2(nextDisp - displacement, 4) * 0.25

            ctx.save()
            ctx.translate(charCenterX, charY)
            ctx.rotate(angle)
            ctx.fillText(ch, 0, 0)
            ctx.restore()

            currentX += charWidth
          }
        })
      }

      if (L.subtext) {
        ctx.save()
        ctx.font = `500 ${Math.max(11, Math.round(fontSizePx * 0.2))}px 'JetBrains Mono', monospace`
        ctx.fillStyle = `rgba(161, 161, 170, 0.75)`
        ctx.textAlign = "center"
        ctx.letterSpacing = "0.15em"
        const subtextY = startY + L.lines.length * lineHeightPx + 16
        ctx.fillText(L.subtext.toUpperCase(), w / 2, subtextY)
        ctx.restore()
      }

      if (s.clickRippleAlpha > 0.01) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(s.clickRippleOrigin.x, s.clickRippleOrigin.y, s.clickRippleRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${Math.round(accentRGBA[0] * 255)}, ${Math.round(accentRGBA[1] * 255)}, ${Math.round(accentRGBA[2] * 255)}, ${(s.clickRippleAlpha * 0.7).toFixed(2)})`
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.restore()
      }

      ctx.restore()
      animationFrameId = requestAnimationFrame(render)
    }

    const startLoop = () => {
      if (!animationFrameId && isVisible && !document.hidden) {
        lastTimestamp = performance.now()
        animationFrameId = requestAnimationFrame(render)
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true
        if (isVisible) {
          startLoop()
        } else if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = 0
        }
      },
      { threshold: 0.01 }
    )
    io.observe(container)

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = 0
        }
      } else {
        startLoop()
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    const onFontsReady = () => {
      cachedFontKey = ""
    }
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(onFontsReady, () => {})
    }

    startLoop()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      io.disconnect()
      resizeObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibilityChange)
      if (interactive) {
        container.removeEventListener("pointermove", handlePointerMove)
        container.removeEventListener("pointerleave", handlePointerLeave)
        container.removeEventListener("pointerdown", handlePointerDown)
      }
    }
  }, [interactive])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{
        background,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full pointer-events-none"
      />
    </div>
  )
}

const __originkitPresetProps = {
  text: "TYPOGRAPHIC TIDES",
  subtext: "KINETIC TIDAL DISPLACEMENT · SINE WAVE RECURSION",
  amplitude: 36,
  frequency: 0.016,
  speed: 1.6,
  layers: 4,
  showContourLines: true,
}

export default function TypographicTides(props: TypographicTidesProps) {
  return <__OriginkitBase_TypographicTides {...__originkitPresetProps} {...props} />
}

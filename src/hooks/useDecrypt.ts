import { useEffect, useState } from 'react'

// Glyph pool for the scramble — hex digits and symbols read as "cipher".
const GLYPHS = '0123456789ABCDEF<>-_/\\[]{}=+*#%&$@?'

function scrambleChar() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// useDecrypt animates `text` resolving left-to-right from random glyphs to the
// real characters — the app's signature "decryption" effect.
//
// Only a `revealed` counter lives in state, advanced asynchronously by an
// interval; the frame string is derived during render (unresolved characters
// re-scramble on each render, which keeps them flickering). Honors
// prefers-reduced-motion by starting fully revealed. `text` is assumed stable.
export function useDecrypt(
  text: string,
  { speed = 32, delay = 0 }: { speed?: number; delay?: number } = {},
) {
  const [revealed, setRevealed] = useState(() =>
    prefersReducedMotion() ? text.length : 0,
  )

  useEffect(() => {
    if (prefersReducedMotion()) return

    let count = 0
    let interval: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      interval = setInterval(() => {
        count += 1
        setRevealed(count)
        if (count >= text.length) clearInterval(interval)
      }, speed)
    }, delay)

    return () => {
      clearTimeout(start)
      if (interval) clearInterval(interval)
    }
  }, [text, speed, delay])

  return text
    .split('')
    .map((ch, i) => (ch === ' ' || i < revealed ? ch : scrambleChar()))
    .join('')
}

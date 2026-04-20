'use client'

import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

type AnimationConfig = {
  targets: gsap.TweenTarget
  animation: (targets: gsap.TweenTarget) => gsap.core.Tween | gsap.core.Timeline
  deps?: unknown[]
}

export function useGsapAnimation<T extends HTMLElement = HTMLDivElement>(
  config: AnimationConfig
) {
  const ref = useRef<T>(null)
  const tweenRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null)

  useEffect(() => {
    // Kill previous animation
    if (tweenRef.current) {
      tweenRef.current.kill()
    }

    tweenRef.current = config.animation(config.targets)

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill()
        tweenRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, config.deps ?? [])

  return ref
}

/**
 * Simpler hook: just provide a ref and a GSAP animation function.
 * Handles cleanup automatically.
 */
export function useGsapEffect<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  const animate = useCallback(
    (fn: (el: T, ctx: gsap.Context) => void) => {
      if (!ref.current) return

      // Kill previous context
      if (ctxRef.current) {
        ctxRef.current.revert()
      }

      const ctx = gsap.context(() => {
        fn(ref.current!, ctx)
      }, ref.current)

      ctxRef.current = ctx
    },
    []
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ctxRef.current) {
        ctxRef.current.revert()
        ctxRef.current = null
      }
    }
  }, [])

  return { ref, animate }
}

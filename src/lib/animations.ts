'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Fade In Up ──────────────────────────────────────────────
export function fadeInUp(
  target: gsap.TweenTarget,
  options: {
    delay?: number
    duration?: number
    y?: number
    ease?: string
  } = {}
) {
  const { delay = 0, duration = 0.6, y = 30, ease = 'power3.out' } = options
  return gsap.fromTo(
    target,
    { y, opacity: 0 },
    { y: 0, opacity: 1, duration, delay, ease }
  )
}

// ─── Stagger Children ────────────────────────────────────────
export function staggerChildren(
  targets: gsap.TweenTarget,
  options: {
    stagger?: number
    y?: number
    duration?: number
    delay?: number
    ease?: string
  } = {}
) {
  const { stagger = 0.1, y = 30, duration = 0.5, delay = 0, ease = 'power3.out' } = options
  return gsap.fromTo(
    targets,
    { y, opacity: 0 },
    { y: 0, opacity: 1, duration, delay, stagger, ease }
  )
}

// ─── Modal Enter ─────────────────────────────────────────────
export function modalEnter(target: gsap.TweenTarget, onComplete?: () => void) {
  return gsap.fromTo(
    target,
    { scale: 0.95, y: 20, opacity: 0 },
    { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.5)', onComplete }
  )
}

// ─── Modal Exit ──────────────────────────────────────────────
export function modalExit(target: gsap.TweenTarget, onComplete?: () => void) {
  return gsap.to(target, {
    scale: 0.95,
    y: 20,
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete,
  })
}

// ─── Toast Slide In ──────────────────────────────────────────
export function toastSlideIn(target: gsap.TweenTarget) {
  return gsap.fromTo(
    target,
    { x: 120, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }
  )
}

// ─── Toast Slide Out ─────────────────────────────────────────
export function toastSlideOut(target: gsap.TweenTarget, onComplete?: () => void) {
  return gsap.to(target, {
    x: 120,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete,
  })
}

// ─── Hero Parallax ───────────────────────────────────────────
export function heroParallax(target: gsap.TweenTarget, intensity = 30) {
  return gsap.to(target, {
    y: intensity,
    ease: 'none',
    scrollTrigger: {
      trigger: target as Element,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })
}

// ─── Scroll Reveal ───────────────────────────────────────────
export function scrollReveal(
  targets: gsap.TweenTarget,
  options: {
    start?: string
    stagger?: number
    y?: number
    duration?: number
  } = {}
) {
  const { start = 'top 85%', stagger = 0.1, y = 40, duration = 0.6 } = options
  return gsap.fromTo(
    targets,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: targets as Element,
        start,
        toggleActions: 'play none none none',
      },
    }
  )
}

// ─── Backdrop Enter ──────────────────────────────────────────
export function backdropEnter(target: gsap.TweenTarget) {
  return gsap.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 0.25 })
}

// ─── Backdrop Exit ───────────────────────────────────────────
export function backdropExit(target: gsap.TweenTarget, onComplete?: () => void) {
  return gsap.to(target, { opacity: 0, duration: 0.2, onComplete })
}

export { gsap, ScrollTrigger }

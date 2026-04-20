'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with Three.js
const SparkleBackground = dynamic(
  () => import('./SparkleBackground'),
  { ssr: false }
)

export default function PageBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* CSS gradient base layer */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FFFAF8 0%, #F8F2F0 30%, #F0E6E2 70%, #FBF3F6 100%)',
        }}
      />

      {/* R3F sparkle overlay */}
      <Suspense fallback={null}>
        <SparkleBackground />
      </Suspense>
    </div>
  )
}

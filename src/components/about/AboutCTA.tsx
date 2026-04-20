'use client'

import SectionShell from '@/components/global/SectionShell'
import Button from '@/components/ui/Button'

export default function AboutCTA() {
  return (
    <SectionShell background="gradient" spacing="lg">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
          Ready to Create Something Sweet?
        </h2>
        <p className="text-muted text-lg mb-8 leading-relaxed">
          Let&apos;s discuss your event and make it unforgettable.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button href="/inquire" variant="primary" size="lg">
            Get a Quote
          </Button>
          <Button href="/contact" variant="secondary" size="lg">
            Contact Us
          </Button>
        </div>
      </div>
    </SectionShell>
  )
}

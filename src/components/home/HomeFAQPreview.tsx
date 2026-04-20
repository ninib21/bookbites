'use client'

import SectionShell from '@/components/global/SectionShell'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { homeFAQs } from '@/data/faqs'

export default function HomeFAQPreview() {
  return (
    <SectionShell
      eyebrow="Common Questions"
      title="Everything you want to know before booking"
      description="A quick look at some of the most common questions clients ask before reserving their treats or event setup."
      align="center"
      background="light"
      spacing="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {homeFAQs.map((faq) => (
            <Card key={faq.question} padding="lg" hover>
              <h3 className="font-display text-lg font-bold text-charcoal mb-3 leading-snug">
                {faq.question}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{faq.answer}</p>
            </Card>
          ))}
        </div>

        <div className="flex justify-center flex-wrap gap-3.5">
          <Button href="/faq" variant="secondary" size="lg">
            View Full FAQ
          </Button>
          <Button href="/inquire" variant="primary" size="lg">
            Ask About Your Event
          </Button>
        </div>
      </div>
    </SectionShell>
  )
}

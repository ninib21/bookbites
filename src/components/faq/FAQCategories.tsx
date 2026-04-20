'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from '@/lib/animations'
import Button from '@/components/ui/Button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { faqCategories, faqCTA } from '@/data/faqs'

export default function FAQCategories() {
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.faq-section') ?? [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  const toggleFAQ = (faqKey: string) => {
    setOpenIndex(openIndex === faqKey ? null : faqKey)
  }

  return (
    <div ref={sectionRef} className="space-y-12">
      {faqCategories.map((section) => (
        <div key={section.category} className="faq-section">
          <h2 className="font-display text-2xl font-bold text-charcoal mb-6">{section.category}</h2>
          <div className="flex flex-col gap-3">
            {section.faqs.map((faq) => {
              const faqKey = `${section.category}-${faq.question}`
              const isOpen = openIndex === faqKey

              return (
                <div
                  key={faqKey}
                  className={cn_faq(
                    'bg-white rounded-2xl border transition-all duration-200',
                    isOpen ? 'border-primary-200 shadow-soft' : 'border-[#E8D5D5]/50 hover:border-primary-100'
                  )}
                >
                  <button
                    className="w-full flex justify-between items-center bg-none border-none text-base font-semibold text-charcoal cursor-pointer p-6 text-left gap-4"
                    onClick={() => toggleFAQ(faqKey)}
                  >
                    <span>{faq.question}</span>
                    <div className={cn_faq(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200',
                      isOpen ? 'bg-primary-100 text-primary-300' : 'bg-cream text-muted'
                    )}>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 -mt-2 text-muted leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="text-center p-12 bg-gradient-to-br from-primary-50 via-cream to-primary-100/50 rounded-2xl border border-primary-100/50">
        <h3 className="font-display text-2xl font-bold text-charcoal mb-3">{faqCTA.title}</h3>
        <p className="text-muted text-lg mb-6">{faqCTA.description}</p>
        <Button href={faqCTA.buttonHref} variant="primary" size="lg">
          {faqCTA.buttonText}
        </Button>
      </div>
    </div>
  )
}

function cn_faq(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

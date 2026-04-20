import ServicesGrid from '@/components/services/ServicesGrid'
import ProcessSteps from '@/components/services/ProcessSteps'
import PageHero from '@/components/global/PageHero'
import CTASection from '@/components/global/CTASection'

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        title="Our Services"
        subtitle="Custom sweets and dessert setups for every celebration"
      />
      <ServicesGrid />
      <ProcessSteps />
      <CTASection />
    </div>
  )
}

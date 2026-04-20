import PageHero from '@/components/global/PageHero'
import SectionShell from '@/components/global/SectionShell'
import FAQCategories from '@/components/faq/FAQCategories'

export default function FAQPage() {
  return (
    <div>
      <PageHero
        title="FAQ"
        subtitle="Find answers to common questions about our services"
      />
      <SectionShell background="white" spacing="lg">
        <FAQCategories />
      </SectionShell>
    </div>
  )
}

import PageHero from '@/components/global/PageHero'
import SectionShell from '@/components/global/SectionShell'
import PackageGrid from '@/components/packages/PackageGrid'
import Button from '@/components/ui/Button'
import { customPackageInfo } from '@/data/packages'

export default function PackagesPage() {
  return (
    <div>
      <PageHero
        title="Packages"
        subtitle="Choose the perfect sweet package for your celebration"
      />
      <SectionShell background="white" spacing="lg">
        <PackageGrid />
      </SectionShell>
      <SectionShell background="light" spacing="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-4">
            {customPackageInfo.title}
          </h2>
          <p className="text-muted text-lg mb-8">{customPackageInfo.description}</p>
          <Button href="/inquire" variant="primary" size="lg">
            {customPackageInfo.cta}
          </Button>
        </div>
      </SectionShell>
    </div>
  )
}

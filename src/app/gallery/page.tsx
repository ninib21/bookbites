import PageHero from '@/components/global/PageHero'
import SectionShell from '@/components/global/SectionShell'
import GalleryGrid from '@/components/gallery/GalleryGrid'

export default function GalleryPage() {
  return (
    <div>
      <PageHero
        title="Gallery"
        subtitle="Browse our sweet creations and get inspired for your event"
      />
      <SectionShell background="white" spacing="lg">
        <GalleryGrid />
      </SectionShell>
    </div>
  )
}

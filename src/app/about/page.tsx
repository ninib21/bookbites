import AboutStory from '@/components/about/AboutStory'
import BrandValues from '@/components/about/BrandValues'
import AboutCTA from '@/components/about/AboutCTA'
import PageHero from '@/components/global/PageHero'

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="About Us"
        subtitle="Our sweet journey and passion for creating unforgettable moments"
      />
      <AboutStory />
      <BrandValues />
      <AboutCTA />
    </div>
  )
}

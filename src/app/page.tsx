import {
  HeroSection,
  FeaturesSection,
  FeaturedResourcesSection,
  LatestArticlesSection,
  LatestVibesSection,
} from '@/components/features/home'

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <FeaturesSection />
      <FeaturedResourcesSection />
      <LatestArticlesSection />
      <LatestVibesSection />
    </div>
  )
}

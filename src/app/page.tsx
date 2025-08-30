import {
  HeroSection,
  FeaturesSection,
  FeaturedResourcesSection,
  LatestArticlesSection,
  LatestVibesSection,
} from '@/components/features/home'

export default function HomePage() {
  return (
    <div className="space-y-20">
      <HeroSection />
      <FeaturesSection />
      <FeaturedResourcesSection />
      <LatestArticlesSection />
      <LatestVibesSection />
    </div>
  )
}
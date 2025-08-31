import {
  HeroSection,
  FeaturesSection,
  FeaturedResourcesSection,
  LatestArticlesSection,
  LatestVibesSection,
} from '@/components/features/home'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <FeaturedResourcesSection />
      <LatestArticlesSection />
      <LatestVibesSection />
    </div>
  )
}
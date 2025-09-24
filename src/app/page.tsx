import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import NewArrivals from '@/components/home/NewArrivals'
import AboutSection from '@/components/home/AboutSection'
import Newsletter from '@/components/home/Newsletter'

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <NewArrivals />
      <AboutSection />
      <Newsletter />
    </>
  );
}

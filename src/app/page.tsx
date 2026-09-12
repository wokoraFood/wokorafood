import { Hero } from "@/components/home/Hero";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { AboutSection } from "@/components/home/AboutSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyWokora } from "@/components/home/WhyWokora";
import { ChefGallery } from "@/components/home/ChefGallery";
import { Testimonials } from "@/components/home/Testimonials";
import { LocationHours } from "@/components/home/LocationHours";
import { CtaBanner } from "@/components/home/CtaBanner";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  let featured: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isVeg: boolean;
  }[] = [];

  try {
    featured = await prisma.menuItem.findMany({
      where: { isFeatured: true, isAvailable: true },
      take: 10,
    });
  } catch {
    featured = [];
  }

  return (
    <>
      <Hero />
      <CategoryStrip />
      {featured.length > 0 && <FeaturedCarousel items={featured} />}
      <AboutSection />
      <HowItWorks />
      <WhyWokora />
      <ChefGallery />
      <Testimonials />
      <LocationHours />
      <CtaBanner />
    </>
  );
}


import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import {
  FeaturedServices,
  FeaturedServicesSkeleton,
} from "@/components/home/featured-services";
import {
  ServiceCategories,
  ServiceCategoriesSkeleton,
} from "@/components/home/service-categories";
import { ReviewsSection } from "@/components/home/reviews-section";

export default function Home() {
  return (
    <>
      <HeroSection />

      <Suspense fallback={<FeaturedServicesSkeleton />}>
        <FeaturedServices />
      </Suspense>
      <Suspense fallback={<ServiceCategoriesSkeleton />}>
        <ServiceCategories />
      </Suspense>

      <ReviewsSection />
    </>
  );
}

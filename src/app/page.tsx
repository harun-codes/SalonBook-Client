
import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import {
  FeaturedServices,
  FeaturedServicesSkeleton,
} from "@/components/home/featured-services";
import { ReviewsSection } from "@/components/home/reviews-section";

export default function Home() {
  return (
    <>
      <HeroSection />

      <Suspense fallback={<FeaturedServicesSkeleton />}>
        <FeaturedServices />
      </Suspense>

      <ReviewsSection />
    </>
  );
}

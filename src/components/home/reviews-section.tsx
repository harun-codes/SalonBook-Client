
"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sarah Ahmed",
    location: "Dhaka, Bangladesh",
    title: "The best salon booking experience",
    review:
      "Amazing experience! The booking process was simple and convenient. I found exactly the salon service I was looking for. Highly recommended!",
    rating: 5,
    avatar: "/images/reviews/sarah-ahmed.webp",
  },
  {
    id: 2,
    name: "Daniel Rahman",
    location: "Chattogram, Bangladesh",
    title: "Easy to use and explore",
    review:
      "SalonBook makes finding beauty services so easy. The interface is clean, the booking process is smooth, and everything is easy to understand.",
    rating: 5,
    avatar: "/images/reviews/daniel-rahman.webp",
  },
  {
    id: 3,
    name: "Emily Wilson",
    location: "Sylhet, Bangladesh",
    title: "Great for finding professionals",
    review:
      "I love how easy it is to explore different salon services. Finding the right treatment and booking an appointment has never been this convenient.",
    rating: 5,
    avatar: "/images/reviews/emily-wilson.webp",
  },
  {
    id: 4,
    name: "Alex Morgan",
    location: "Khulna, Bangladesh",
    title: "My go-to for self-care",
    review:
      "SalonBook has made my self-care routine much easier. I can explore services, check prices, and manage my appointments in one place.",
    rating: 5,
    avatar: "/images/reviews/alex-morgan.webp",
  },
  {
    id: 5,
    name: "Olivia Martin",
    location: "Rajshahi, Bangladesh",
    title: "A wonderful experience",
    review:
      "A beautiful and easy-to-use platform. I really appreciate how simple it is to discover salon services and find the right treatment.",
    rating: 5,
    avatar: "/images/reviews/olivia-martin.webp",
  },
];

export function ReviewsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      left:
        direction === "right"
          ? carouselRef.current.clientWidth * 0.8
          : -carouselRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const navigationButton =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors duration-300 hover:border-primary hover:bg-secondary hover:text-primary sm:h-12 sm:w-12";

  return (
    <section className="overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 sm:flex-row sm:items-center">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase sm:text-sm">
              Customer Testimonials
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              What Our Customers Say
            </h2>
          </div>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              aria-label="Previous reviews"
              className={navigationButton}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              aria-label="Next reviews"
              className={navigationButton}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((review) => (
            <article
              key={review.id}
              className="flex min-h-[400px] shrink-0 basis-[88%] snap-start flex-col justify-between rounded-3xl border border-border bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-lg sm:min-h-[420px] sm:basis-[calc(50%-10px)] sm:p-8 lg:basis-[calc(33.333%-14px)]"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-5 w-5 fill-amber-400 text-amber-400 sm:h-6 sm:w-6"
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold leading-snug tracking-tight text-card-foreground sm:text-2xl">
                    {review.title}
                  </h3>

                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                    {review.review}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border shadow-sm sm:h-16 sm:w-16">
                  <Image
                    src={review.avatar}
                    alt={`${review.name} profile photo`}
                    width={64}
                    height={64}
                    sizes="(min-width: 640px) 64px, 56px"
                    quality={75}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-base font-semibold text-foreground sm:text-lg">
                    {review.name}
                  </h4>

                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {review.location}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
          <button
            type="button"
            onClick={() => scrollCarousel("left")}
            aria-label="Previous reviews"
            className={navigationButton}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => scrollCarousel("right")}
            aria-label="Next reviews"
            className={navigationButton}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

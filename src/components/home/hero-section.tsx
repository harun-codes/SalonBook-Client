
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[400px] items-center overflow-hidden bg-[#075E46] sm:min-h-[440px] lg:min-h-[500px]">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero/salon-hero.webp"
          alt=""
          fill
          preload
          sizes="100vw"
          quality={75}
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#052F24]/90 via-[#075E46]/75 to-[#075E46]/25 dark:from-[#041B14]/95 dark:via-[#052F24]/90 dark:to-[#041B14]/65" />

      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="max-w-2xl space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur-md sm:px-4 sm:text-sm">
            <Sparkles className="h-4 w-4 text-[#B9F5D3]" />
            Your Beauty, Our Passion
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl leading-[1.15] font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[64px]">
              Feel Beautiful.
              <span className="block text-[#B9F5D3]">
                Be Unforgettable.
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8 lg:text-lg">
              Discover exceptional salon experiences, explore professional
              beauty services, and book your perfect appointment with ease.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#E8FFF2] px-6 text-sm font-semibold text-[#075E46] hover:bg-white sm:h-12 sm:px-7"
            >
              Explore Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href="#service-categories"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/60 bg-white/10 px-6 text-sm text-white backdrop-blur-sm hover:bg-white/20 sm:h-12 sm:px-7"
            >
              Discover More
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3 pt-3">
            {[
              "Expert Professionals",
              "Premium Services",
              "Easy Booking",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs font-medium text-white/90 sm:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#B9F5D3]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

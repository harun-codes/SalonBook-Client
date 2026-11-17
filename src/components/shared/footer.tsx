import Link from "next/link";
import {
    Scissors,
    MapPin,
    Phone,
    Mail,
    Clock3,
    ArrowUpRight,
} from "lucide-react";

import {
    FaInstagram,
    FaFacebookF,
    FaLinkedinIn,
    FaXTwitter,
} from "react-icons/fa6";
import { CurrentYear } from "@/components/shared/current-year";


const footerLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
    { name: "Sign In", href: "/sign-in" },
    { name: "Create Account", href: "/sign-up" },
];

const socialLinks = [
    {
        name: "Instagram",
        href: "https://www.instagram.com/",
        icon: FaInstagram,
    },
    {
        name: "Facebook",
        href: "https://www.facebook.com/",
        icon: FaFacebookF,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/",
        icon: FaLinkedinIn,
    },
    {
        name: "X",
        href: "https://x.com/",
        icon: FaXTwitter,
    },
];


export function Footer() {
    return (
        <footer className="bg-[#075E46] text-white dark:bg-[#101B16] dark:text-[#E8FFF2]">
            <div className="mx-auto max-w-7xl px-5 pt-14 pb-7 sm:px-8 sm:pt-16 lg:px-10">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

                    <div className="space-y-5">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 dark:bg-[#203B2E]">
                                <Scissors className="h-6 w-6" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    <span className="text-xl font-bold tracking-tight text-foreground">
                                        Salon<span className="text-orange-500">Book</span>
                                    </span>
                                </h2>
                                <p className="text-[10px] font-medium tracking-[0.2em] text-white/65 dark:text-[#A1B5A9]">
                                    BEAUTY & WELLNESS
                                </p>
                            </div>
                        </Link>

                        <p className="max-w-xs text-sm leading-7 text-white/75 dark:text-[#A1B5A9]">
                            Your beauty, your style, your moment. Discover professional
                            salon services and enjoy a seamless appointment booking
                            experience with SalonBook.
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;

                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        title={social.name}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 dark:border-[#30443A] dark:bg-[#203029] dark:hover:bg-[#30443A]"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                );
                            })}
                        </div>

                    </div>

                    <div className="space-y-5">
                        <h3 className="text-base font-semibold tracking-wide">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white dark:text-[#A1B5A9] dark:hover:text-[#E8FFF2]"
                                    >
                                        <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-5">
                        <h3 className="text-base font-semibold tracking-wide">
                            Contact Information
                        </h3>

                        <div className="space-y-4 text-sm text-white/75 dark:text-[#A1B5A9]">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#B9F5D3]" />
                                <span>Your Salon Address, Dhaka, Bangladesh</span>
                            </div>

                            <a
                                href="tel:+8801700000000"
                                className="flex items-center gap-3 transition-colors hover:text-white dark:hover:text-[#E8FFF2]"
                            >
                                <Phone className="h-4 w-4 shrink-0 text-[#B9F5D3]" />
                                +880 1700-000000
                            </a>

                            <a
                                href="mailto:hello@salonbook.com"
                                className="flex items-center gap-3 transition-colors hover:text-white dark:hover:text-[#E8FFF2]"
                            >
                                <Mail className="h-4 w-4 shrink-0 text-[#B9F5D3]" />
                                hello@salonbook.com
                            </a>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <h3 className="text-base font-semibold tracking-wide">
                            Opening Hours
                        </h3>

                        <div className="flex items-start gap-3">
                            <Clock3 className="mt-1 h-4 w-4 shrink-0 text-[#B9F5D3]" />

                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-medium">Monday – Saturday</p>
                                    <p className="mt-1 text-white/70 dark:text-[#A1B5A9]">
                                        10:00 AM – 8:00 PM
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">Sunday</p>
                                    <p className="mt-1 text-white/70 dark:text-[#A1B5A9]">
                                        Closed
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/15 bg-white/10 p-4 dark:border-[#30443A] dark:bg-[#203029]">
                            <p className="text-sm font-semibold">
                                Need an Appointment?
                            </p>
                            <p className="mt-1 text-xs leading-5 text-white/70 dark:text-[#A1B5A9]">
                                Explore our salon services and find your perfect beauty
                                experience.
                            </p>

                            <Link
                                href="/services"
                                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#B9F5D3] transition-colors hover:text-white dark:text-[#A7E8C5] dark:hover:text-white"
                            >
                                Explore Services
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/20 pt-6 dark:border-[#30443A]">
                    <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                        <p className="text-xs text-white/70 dark:text-[#A1B5A9]">
                            © <CurrentYear /> SalonBook. All rights reserved.
                        </p>

                        <p className="text-xs text-white/70 dark:text-[#A1B5A9]">
                            Made with care for your beauty and wellness.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

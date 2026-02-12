"use client";

import { Navbar } from "@/components/landing-page/navbar";
import { Hero } from "@/components/landing-page/hero";
import { SocialProof } from "@/components/landing-page/social-proof";
import { Features } from "@/components/landing-page/features";
import { HowItWorks } from "@/components/landing-page/how-it-works";
import { InteractiveDemo } from "@/components/landing-page/interactive-demo";
import { Stats } from "@/components/landing-page/stats";
import { Testimonials } from "@/components/landing-page/testimonials";
import { Pricing } from "@/components/landing-page/pricing";
import { FAQ } from "@/components/landing-page/faq";
import { Contact } from "@/components/landing-page/contact";
import { FinalCTA } from "@/components/landing-page/final-cta";
import { Footer } from "@/components/landing-page/footer";
import { useEffect } from "react";

export default function LandingPage() {

    // Smooth scroll implementation for all anchor links
    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.hash && anchor.origin === window.location.origin) {
                const element = document.querySelector(decodeURIComponent(anchor.hash));
                if (element) {
                    e.preventDefault();
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-950 dark:selection:text-emerald-400">
            {/* Componentes de la Landing Page modularizados */}
            <Navbar />

            <main>
                <Hero />
                <SocialProof />
                <Features />
                <HowItWorks />
                <InteractiveDemo />
                <Stats />
                <Testimonials />
                <Pricing />
                <Contact />
                <FAQ />
                <FinalCTA />
            </main>

            <Footer />
        </div>
    );
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const HeroSection = () => {
    return (
        <section className="w-full px-4 pt-16">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Heading */}
                <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 max-w-4xl">
                    Plan Your Perfect <span className="text-blue-600">Baguio Trip</span>
                    <br />
                    in Seconds
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-600 text-center max-w-3xl mb-8">
                    We craft your perfect itinerary — personalized to your budget, interests, group size, and real-time
                    traffic conditions — so you can focus on the adventure, not the stress.
                </p>

                {/* CTA Button */}
                <Link
                    href="/waitlist"
                    className="bg-gradient-to-b from-blue-700 to-blue-500 text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors flex items-center shadow-md"
                >
                    Join the Waitlist
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                {/* Image */}
                <div className="mt-16 w-full max-w-6xl">
                    <div className="relative overflow-hidden" style={{ aspectRatio: '2400 / 859' }}>
                        <Image
                            src="/images/waitlistlandingpage.png"
                            alt="Tarana.ai app preview"
                            fill
                            priority
                            quality={100}
                            style={{ objectFit: 'cover', objectPosition: 'top' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection


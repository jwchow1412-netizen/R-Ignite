"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useTransform,
    MotionValue,
} from "framer-motion";

const sponsors = [
    { name: "CAS", logo: "/sponsors/cas.png" },
    { name: "ASM", logo: "/sponsors/asm.png" },
    { name: "MASA", logo: "/sponsors/mas.png" },
    { name: "Sunway Pyramid Ice", logo: "/sponsors/sunway_ice.png" },
];

// Configuration
const ITEM_WIDTH = 280; // Width of each sponsor card
const GAP = 10; // Gap between cards
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + GAP;
const BASE_VELOCITY = -0.5; // Base scroll speed
const MIN_SCALE = 0.6; // Min scale at edges (Slightly larger for visibility)
const MAX_SCALE = 1.1; // Max scale at center (Pop effect)

// Mathematically perfect modulo wrap
const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// Individual Sponsor Card Component
function SponsorCard({
    sponsor,
    baseX,
    index,
    totalItems,
    containerWidth,
}: {
    sponsor: (typeof sponsors)[0];
    baseX: MotionValue<number>;
    index: number;
    totalItems: number;
    containerWidth: number;
}) {
    const loopWidth = totalItems * TOTAL_ITEM_WIDTH;
    const offset = index * TOTAL_ITEM_WIDTH;

    // Calculate the raw X position based on global scroll + offset
    const xObject = useTransform(baseX, (v) => {
        return wrap(-TOTAL_ITEM_WIDTH, loopWidth - TOTAL_ITEM_WIDTH, v + offset);
    });

    // Calculate Ring/Scaling Effect using Cosine
    // We need to extract the normalized distance for multiple effects
    const normalizedDist = useTransform(xObject, (x) => {
        const itemCenter = x + ITEM_WIDTH / 2;
        const containerCenter = containerWidth / 2;
        const dist = itemCenter - containerCenter;
        const MAX_DIST = Math.max(containerWidth / 2, 600);
        let normalized = dist / MAX_DIST;
        if (normalized < -1) normalized = -1;
        if (normalized > 1) normalized = 1;
        return normalized;
    });

    const scale = useTransform(normalizedDist, (n) => {
        // Cosine ease
        const cosValue = Math.cos(n * (Math.PI / 2));
        return MIN_SCALE + (MAX_SCALE - MIN_SCALE) * cosValue;
    });

    // Visual Transforms
    const zIndex = useTransform(scale, [MIN_SCALE, MAX_SCALE], [0, 50]);
    const opacity = useTransform(scale, [MIN_SCALE, MAX_SCALE], [0.4, 1]);

    // Grayscale: 100% at edges (MIN_SCALE), 0% at center (MAX_SCALE)
    const grayscale = useTransform(scale, [MIN_SCALE, MAX_SCALE], ["100%", "0%"]);

    // Spotlight Glow Opacity: Only visible near center
    const glowOpacity = useTransform(scale, [MIN_SCALE, MIN_SCALE + 0.2, MAX_SCALE], [0, 0, 0.8]);

    return (
        <motion.div
            className="absolute top-0 flex items-center justify-center p-4 transition-colors"
            style={{
                width: ITEM_WIDTH,
                height: "100%",
                x: xObject,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
                filter: useTransform(grayscale, (v) => `grayscale(${v})`),
            }}
        >
            {/* Spotlight Glow Effect (Behind) */}
            <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{
                    width: "120%",
                    height: "120%",
                    opacity: glowOpacity,
                    background: "radial-gradient(circle, rgba(236,113,150,0.3) 0%, rgba(248,153,36,0.15) 50%, transparent 80%)",
                }}
            />

            {/* Logo Container */}
            <div className="relative h-28 w-full md:h-32">
                <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                    draggable={false}
                />
            </div>
        </motion.div>
    );
}

export default function SponsorScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const baseX = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);

    // Initialize container width
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // Auto-scroll loop
    useAnimationFrame((t, delta) => {
        if (!isDragging) {
            const moveBy = BASE_VELOCITY * (delta / 16);
            baseX.set(baseX.get() + moveBy);
        }
    });

    const DESIRED_WIDTH = containerWidth > 0 ? containerWidth * 4 : 6000;
    const itemsPerSet = sponsors.length * TOTAL_ITEM_WIDTH;
    const repeatCount = Math.max(3, Math.ceil(DESIRED_WIDTH / itemsPerSet));

    const virtualList = Array.from({ length: repeatCount }).flatMap(() => sponsors);

    return (
        <section className="w-full overflow-hidden bg-black/20 py-24 backdrop-blur-sm">
            <div className="mx-auto w-full max-w-[1920px] px-4">
                <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-white/40">
                    Our Partners & Sponsors
                </p>

                {/* Container */}
                <div
                    ref={containerRef}
                    className="relative h-40 w-full cursor-grab overflow-hidden active:cursor-grabbing"
                    onPointerDown={() => setIsDragging(true)}
                    onPointerUp={() => setIsDragging(false)}
                    onPointerLeave={() => setIsDragging(false)}
                >
                    {/* 
                Gesture Reader
             */}
                    <motion.div
                        className="absolute inset-0 z-50"
                        onPan={(e, info) => {
                            baseX.set(baseX.get() + info.delta.x);
                        }}
                    />

                    {/* Render Items */}
                    {containerWidth > 0 &&
                        virtualList.map((sponsor, index) => (
                            <SponsorCard
                                key={`${sponsor.name}-${index}`}
                                sponsor={sponsor}
                                baseX={baseX}
                                index={index}
                                totalItems={virtualList.length}
                                containerWidth={containerWidth}
                            />
                        ))}
                </div>
            </div>
        </section>
    );
}

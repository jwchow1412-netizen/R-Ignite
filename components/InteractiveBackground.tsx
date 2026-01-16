"use client"

import React, { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export const InteractiveBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    // Mouse position tracking
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth spring animation for camera/perspective movement
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
        stiffness: 150,
        damping: 30,
    })
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
        stiffness: 150,
        damping: 30,
    })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize mouse coordinates to -0.5 to 0.5
            mouseX.set(e.clientX / window.innerWidth - 0.5)
            mouseY.set(e.clientY / window.innerHeight - 0.5)
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [mouseX, mouseY])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 -z-10 overflow-hidden bg-[#0a0508] perspective-[1000px]"
            style={{ perspective: "1000px" }}
        >
            {/* 3D Grid Plane */}
            <motion.div
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                }}
                className="absolute inset-[-50%] w-[200%] h-[200%] origin-center"
            >
                <div
                    className="w-full h-full opacity-20"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, rgba(212, 100, 118, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(212, 100, 118, 0.3) 1px, transparent 1px)
            `,
                        backgroundSize: "60px 60px",
                        maskImage: "radial-gradient(circle at center, black, transparent 70%)"
                    }}
                />
            </motion.div>

            {/* Floating Spark Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <SparkParticle key={i} index={i} />
            ))}

            {/* Vignette & Color Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0508] via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
        </div>
    )
}

const SparkParticle = ({ index }: { index: number }) => {
    const randomX = Math.random() * 100
    const randomDelay = Math.random() * 5
    const randomDuration = 3 + Math.random() * 4
    const size = 2 + Math.random() * 4

    return (
        <motion.div
            className="absolute rounded-full bg-gradient-to-t from-[rgba(248,153,36,0.8)] to-[rgba(212,100,118,0.8)] blur-[1px]"
            style={{
                left: `${randomX}%`,
                width: size,
                height: size,
            }}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{
                y: "-10vh",
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
            }}
            transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: randomDelay,
                ease: "linear",
            }}
        />
    )
}

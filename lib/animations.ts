import { Variants } from "framer-motion";

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const slideUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const slideUpDelayed = (delay: number): Variants => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" } },
});

export const scaleUp: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const scaleOnHover: Variants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
};

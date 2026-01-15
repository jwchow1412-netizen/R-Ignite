import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-transform duration-150 ease-out active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-br from-[#9f1f43] to-[#d46476] text-white shadow-[0_18px_38px_rgba(212,100,118,0.28)] border border-white/10 hover:-translate-y-[1px] hover:shadow-[0_16px_42px_rgba(212,100,118,0.4)]",
                secondary: "bg-white/5 border border-white/10 text-[#f8f4f6] font-semibold hover:-translate-y-[1px] hover:border-white/20 hover:bg-white/10",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                linkedin: "bg-gradient-to-br from-[#0f6fde] to-[#3ba0ff] text-[#f8fbff] shadow-[0_16px_32px_rgba(59,160,255,0.25)] border border-white/10 hover:-translate-y-[1px] hover:shadow-[0_18px_36px_rgba(59,160,255,0.35)]",
                download: "bg-gradient-to-br from-[#f57c00] to-[#f89924] text-white shadow-[0_16px_32px_rgba(248,153,36,0.25)] border border-white/10 hover:-translate-y-[1px] hover:shadow-[0_18px_36px_rgba(248,153,36,0.35)]"
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-xl px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }

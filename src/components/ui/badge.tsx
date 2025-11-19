import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary-orange/30 bg-primary-orange/20 text-primary-orange hover:bg-primary-orange/30",
        secondary:
          "border-deep-purple/30 bg-deep-purple/20 text-deep-purple hover:bg-deep-purple/30",
        destructive:
          "border-destructive/30 bg-destructive/20 text-destructive hover:bg-destructive/30",
        outline: "text-foreground border-border/50 bg-white/60 backdrop-blur-sm",
        accent: "border-sky-blue/30 bg-sky-blue/20 text-sky-blue hover:bg-sky-blue/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-700 text-white hover:bg-gray-700/80",
        secondary:
          "border-transparent bg-gray-700 text-gray-100 hover:bg-gray-700/80",
        destructive:
          "border-transparent bg-red-500 text-gray-100 hover:bg-red-500/80",
        outline: "text-gray-100 border-gray-700",
        token: "border-transparent bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 gap-1",
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

import React from "react"
import { Slot } from "@radix-ui/react-slot"

const Button = React.forwardRef(({ className, size = "default", asChild = false, ...props }, ref) => {
  // Determine which component to render (either a button or Radix Slot)
  const Comp = asChild ? Slot : "button"

  // Button size styles
  const buttonSizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8 text-base",
    icon: "h-10 w-10",
  }

  // Button base styles with outline, ring, and shadow reset
  const buttonClassNames = `${buttonSizes[size]} rounded-md transition-all duration-300 ease-in-out
                            focus:outline-none focus:ring-0 focus:shadow-none 
                            active:outline-none active:ring-0 active:shadow-none 
                            disabled:pointer-events-none disabled:opacity-50`

  return (
    <Comp className={`${buttonClassNames} ${className}`} ref={ref} {...props} />
  )
})

Button.displayName = "Button"

export { Button }

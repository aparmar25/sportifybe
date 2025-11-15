import * as React from "react"
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "../lib/utils.js"

export const DropdownMenu = DropdownPrimitive.Root

export const DropdownMenuTrigger = DropdownPrimitive.Trigger

export const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 slide-in-from-top-2",
          className
        )}
        {...props}
      />
    </DropdownPrimitive.Portal>
  )
)
DropdownMenuContent.displayName = DropdownPrimitive.Content.displayName

export const DropdownMenuItem = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <DropdownPrimitive.Item
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
)
DropdownMenuItem.displayName = DropdownPrimitive.Item.displayName

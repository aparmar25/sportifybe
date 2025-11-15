import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger

export const SheetContent = React.forwardRef(({ children, className = "", side = "right", ...props }, ref) => {
  const sideStyles = {
    top: "inset-x-0 top-0 h-1/2 w-full",
    bottom: "inset-x-0 bottom-0 h-1/2 w-full",
    left: "inset-y-0 left-0 h-full w-3/4 max-w-sm",
    right: "inset-y-0 right-0 h-full w-3/4 max-w-sm",
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content
        ref={ref}
        className={`fixed z-50 gap-4 bg-black p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 ${
          side === "right" ? "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right" : 
          side === "left" ? "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left" : 
          side === "top" ? "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top" : 
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom"
        } ${sideStyles[side]} ${className}`}
        {...props}
      >
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-end">
            <Dialog.Close asChild>
              <button className="rounded-full opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                <X className="h-6 w-6 text-white" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </div>
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  )
})

SheetContent.displayName = "SheetContent"
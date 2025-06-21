import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import * as React from "react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

interface AccordionItemProps {
  children: React.ReactNode
  className?: string
}

interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  isOpen?: boolean
}

interface AccordionContentProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-b", className)}
      {...props}
    >
      {children}
    </div>
  )
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, onClick, isOpen, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
      <ChevronDown className={cn(
        "h-4 w-4 shrink-0 transition-transform duration-200",
        isOpen && "rotate-180"
      )} />
    </button>
  )
)
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, isOpen, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        isOpen ? "animate-accordion-down" : "animate-accordion-up",
        className
      )}
      style={{
        maxHeight: isOpen ? "1000px" : "0px",
        opacity: isOpen ? 1 : 0,
      }}
      {...props}
    >
      <div className="pb-4 pt-0">
        {children}
      </div>
    </div>
  )
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

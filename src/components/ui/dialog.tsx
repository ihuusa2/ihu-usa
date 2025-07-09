"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  onClick?: () => void
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

const DialogContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: false,
  setOpen: () => {},
})

function Dialog({ open = false, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(open)
  const isControlled = open !== undefined
  const currentOpen = isControlled ? open : internalOpen
  const setCurrentOpen = isControlled ? onOpenChange : setInternalOpen

  React.useEffect(() => {
    if (isControlled) {
      setInternalOpen(open)
    }
  }, [open, isControlled])

  return (
    <DialogContext.Provider value={{ open: currentOpen, setOpen: setCurrentOpen || (() => {}) }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ asChild = false, children, onClick }: DialogTriggerProps) {
  const { setOpen } = React.useContext(DialogContext)
  
  const handleClick = () => {
    setOpen(true)
    onClick?.()
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  )
}

function DialogContent({ children, className }: DialogContentProps) {
  const { open, setOpen } = React.useContext(DialogContext)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => setOpen(false)}
      />
      <div className={cn(
        "relative bg-background rounded-lg shadow-lg max-w-lg w-full mx-4 p-6",
        className
      )}>
        {children}
      </div>
    </div>
  )
}

function DialogHeader({ children, className }: DialogHeaderProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
      {children}
    </div>
  )
}

function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  )
}

function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}

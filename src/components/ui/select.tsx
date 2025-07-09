"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
}

interface SelectTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
  open?: boolean
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

interface SelectValueProps {
  placeholder?: string
  children?: React.ReactNode
  className?: string
}

const SelectContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
  value: string
  setValue: (value: string) => void
}>({
  open: false,
  setOpen: () => {},
  value: "",
  setValue: () => {},
})

function Select({ value = "", onValueChange, children, disabled }: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(value)
  const [open, setOpen] = React.useState(false)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const setCurrentValue = isControlled ? onValueChange : setInternalValue

  React.useEffect(() => {
    if (isControlled) {
      setInternalValue(value)
    }
  }, [value, isControlled])

  return (
    <SelectContext.Provider 
      value={{ 
        open, 
        setOpen: disabled ? () => {} : setOpen, 
        value: currentValue, 
        setValue: setCurrentValue || (() => {}) 
      }}
    >
      {children}
    </SelectContext.Provider>
  )
}

function SelectTrigger({ children, className, onClick, disabled }: SelectTriggerProps) {
  const { setOpen } = React.useContext(SelectContext)
  
  const handleClick = () => {
    if (!disabled) {
      setOpen(true)
      onClick?.()
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

function SelectContent({ children, className, open }: SelectContentProps) {
  const { open: contextOpen } = React.useContext(SelectContext)
  const isOpen = open !== undefined ? open : contextOpen

  if (!isOpen) return null

  return (
    <div className={cn(
      "absolute top-full z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md",
      className
    )}>
      {children}
    </div>
  )
}

function SelectItem({ value, children, className, onClick }: SelectItemProps) {
  const { setValue, setOpen } = React.useContext(SelectContext)
  
  const handleClick = () => {
    setValue(value)
    setOpen(false)
    onClick?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

function SelectValue({ placeholder, children, className }: SelectValueProps) {
  const { value } = React.useContext(SelectContext)
  
  return (
    <span className={cn("block truncate", className)}>
      {children || value || placeholder}
    </span>
  )
}

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
}

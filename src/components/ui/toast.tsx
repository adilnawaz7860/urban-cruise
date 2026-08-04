"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { toastManager } from "@/lib/toast"

const TYPE_ICON: Record<string, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const TYPE_STYLES: Record<string, string> = {
  success: "border-success/30 [&_svg]:text-success",
  error: "border-destructive/30 [&_svg]:text-destructive",
  info: "border-border [&_svg]:text-primary",
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-100 flex w-full max-w-sm flex-col gap-2 outline-none sm:bottom-6 sm:right-6">
        {toasts.map((toastItem) => {
          const Icon = TYPE_ICON[toastItem.type || ""] || Info
          return (
            <ToastPrimitive.Root
              key={toastItem.id}
              toast={toastItem}
              data-slot="toast"
              className={cn(
                "relative flex items-start gap-3 rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg ring-1 ring-foreground/10 transition-all data-starting-style:translate-y-4 data-starting-style:opacity-0 data-ending-style:opacity-0 data-[swipe-direction=right]:data-ending-style:translate-x-full",
                TYPE_STYLES[toastItem.type || ""] || "border-border"
              )}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <ToastPrimitive.Title className="text-sm font-semibold" />
                <ToastPrimitive.Description className="mt-0.5 text-sm text-muted-foreground" />
              </div>
              <ToastPrimitive.Close
                aria-label="Close"
                className="shrink-0 rounded-md p-0.5 text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          )
        })}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  )
}

export function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toastManager}>
      <ToastList />
    </ToastPrimitive.Provider>
  )
}

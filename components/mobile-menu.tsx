"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileSidebar } from "@/components/mobile-sidebar"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setOpen(false)
  }, [])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-3 z-50 lg:hidden bg-gray-900/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-800"
          aria-label="Menu principal"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[85%] max-w-[320px] p-0 bg-gray-950/98 backdrop-blur-md border-r border-gray-800"
        onInteractOutside={() => setOpen(false)}
      >
        <MobileSidebar onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

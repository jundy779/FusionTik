"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "Download", href: "#download" },
    { name: "History", href: "#history" },
    { name: "About", href: "#about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-primary">
            <Download size={24} />
          </div>
          <Link href="/" className="flex items-center gap-1">
            <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              SlowTik
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <ModeToggle />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="flex flex-col gap-4 px-2">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <Download className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg">SlowTik</span>
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-foreground/70 hover:text-foreground transition-colors py-2 text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

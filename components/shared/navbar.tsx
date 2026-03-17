"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Camera, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface NavbarProps {
  dict: {
    home: string
    services: string
    profile: string
    bookNow: string
  }
  lang: "en" | "id"
  logoUrl?: string | null
}

export function Navbar({ dict, lang, logoUrl }: NavbarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const navLinks = [
    { href: `/${lang}`, label: dict.home },
    { href: `/${lang}/services`, label: dict.services },
    { href: `/${lang}/booking`, label: dict.bookNow },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold text-lg">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
          ) : (
            <Camera className="h-6 w-6" />
          )}
          <span className="hidden sm:inline-block">Ashraf</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-l pl-4">
            <LanguageToggle lang={lang} />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle lang={lang} />
          {isMounted ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
                <SheetTitle className="flex items-center gap-2 mb-6">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-6 w-6 object-contain" />
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                  <span>Menu</span>
                </SheetTitle>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === link.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}


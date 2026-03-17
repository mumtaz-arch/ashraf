"use client"

import Link from "next/link"
import { usePathname, useRouter, useParams } from "next/navigation"
import { LayoutDashboard, CalendarDays, BookOpen, Package, LogOut, Camera, Menu, User, Image } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"

function NavItems({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname()
  const params = useParams()
  const lang = params.lang as string || "id"

  const adminLinks = [
    { href: `/${lang}/admin`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/${lang}/admin/bookings`, label: "Bookings", icon: BookOpen },
    { href: `/${lang}/admin/availability`, label: "Availability", icon: CalendarDays },
    { href: `/${lang}/admin/services`, label: "Services", icon: Package },
    { href: `/${lang}/admin/profile`, label: "Profile", icon: User },
    { href: `/${lang}/admin/portfolio`, label: "Portfolio", icon: Image },
  ]

  return (
    <nav className="flex flex-col gap-1">
      {adminLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === link.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export function AdminSidebar() {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string || "id"
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    router.push(`/${lang}/admin/login`)
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-3 py-4 font-semibold text-lg border-b mb-4">
        <Camera className="h-5 w-5" />
        <span>Admin Panel</span>
      </div>
      <div className="flex-1">
        <NavItems onClick={() => setMobileOpen(false)} />
      </div>
      <div className="border-t pt-4 pb-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r bg-card">
        <div className="w-full p-4">{sidebarContent}</div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 h-14">
        <Link href={`/${lang}/admin`} className="flex items-center gap-2 font-semibold">
          <Camera className="h-5 w-5" />
          Admin
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-4">
            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

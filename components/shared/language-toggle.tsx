"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LanguageToggle({ lang }: { lang: "en" | "id" }) {
  const pathname = usePathname()
  const router = useRouter()

  function handleToggle() {
    const nextLang = lang === "en" ? "id" : "en"
    // Subpath replacement: /en/services -> /id/services
    const segments = pathname.split("/")
    segments[1] = nextLang
    const nextPath = segments.join("/")
    router.push(nextPath)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleToggle} className="font-medium text-xs">
      {lang === "en" ? "ID" : "EN"}
    </Button>
  )
}

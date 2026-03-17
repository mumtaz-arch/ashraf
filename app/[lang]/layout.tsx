import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants"
import { getDictionary } from "@/lib/dictionaries"
import prisma from "@/lib/prisma"
import "@/app/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const profile = await prisma.photographerProfile.findFirst({
    select: { logoUrl: true },
  })
  
  return {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    icons: {
      icon: profile?.logoUrl || "/favicon.ico",
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params
  const dict = await getDictionary(lang as "en" | "id")
  
  // Fetch logo for Navbar
  const profile = await prisma.photographerProfile.findFirst({
    select: { logoUrl: true }
  })

  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="flex min-h-screen flex-col">
          <Navbar lang={lang as "en" | "id"} dict={dict.nav} logoUrl={profile?.logoUrl ?? null} />
          <main className="flex-1">{children}</main>
          <Footer dict={dict.footer} navDict={dict.nav} lang={lang as "en" | "id"} />
        </div>
      </body>
    </html>
  )
}

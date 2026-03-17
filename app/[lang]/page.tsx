import Link from "next/link"
import { ArrowRight, Camera, CheckCircle2, CalendarDays, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ServiceCard } from "@/components/services/service-card"
import { getActiveServices } from "@/lib/services/service"
import { getDictionary } from "@/lib/dictionaries"
import type { ServiceItem } from "@/types"
import prisma from "@/lib/prisma"
import Image from "next/image"
import type { Metadata } from "next"
import { PortfolioSection } from "@/components/home/portfolio-section"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "id" }>
}): Promise<Metadata> {
  const { lang } = await params
  
  const title = lang === "id" 
    ? "Ashraf Photography - Jasa Fotografer & Video Manggarai, NTT, Flores" 
    : "Ashraf Photography - Professional Photographer & Videographer in Flores, NTT"
    
  const localeKeywords = lang === "id"
    ? ["fotografer manggarai", "jasa video manggarai", "fotografer ruteng", "foto wedding ntt", "labuan bajo photography", "videografer flores"]
    : ["photographer flores", "wedding photography ntt", "videography labuan bajo", "ruteng photostudio"]

  return {
    title,
    description: lang === "id"
      ? "Abadikan momen berharga Anda bersama Ashraf. Jasa Fotografi & Videografi Profesional di Manggarai, Ruteng, Labuan Bajo, Flores, NTT. Melayani Wedding, Event, dan Potret."
      : "Capture your precious moments with Ashraf. Professional Photography & Videography in Manggarai, Ruteng, Labuan Bajo, Flores, NTT. Serving Weddings, Events, and Portraits.",
    keywords: ["ashraf photography", "foto appointment", ...localeKeywords],
    openGraph: {
      title,
      type: "website",
    }
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: "en" | "id" }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  // 1. Fetch Profile (with lazy fallback initialization)
  let profile = await prisma.photographerProfile.findFirst()
  if (!profile) {
    profile = await prisma.photographerProfile.create({
      data: {
        name: "Ashraf",
        title: "Fotografer Profesional",
        titleEn: "Professional Photographer",
        bio: "Halo! Saya Ashraf, fotografer profesional yang berdedikasi untuk mengabadikan momen spesial Anda.",
        bioEn: "Hello! I am Ashraf, a professional photographer dedicated to capturing your special moments.",
        imageUrl: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=400&h=400",
      },
    })
  }

  const activeTitle = lang === "id" ? profile.title : (profile.titleEn || profile.title)
  const activeBio = lang === "id" ? profile.bio : (profile.bioEn || profile.bio)

  // 2. Fetch Portfolio Items
  const portfolioItems = await prisma.portfolioItem.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  })
  const categories = ["All", ...Array.from(new Set(portfolioItems.map((item) => item.category ?? "General")))] as string[]

  const rawServices = await getActiveServices()
  const services: ServiceItem[] = rawServices.slice(0, 3).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    price: Number(s.price),
    durationMinutes: s.durationMinutes,
    isActive: s.isActive,
  }))

  const processSteps = [
    {
      icon: Camera,
      title: dict.landing.howItWorks.step1.title,
      description: dict.landing.howItWorks.step1.desc,
    },
    {
      icon: CalendarDays,
      title: dict.landing.howItWorks.step2.title,
      description: dict.landing.howItWorks.step2.desc,
    },
    {
      icon: CheckCircle2,
      title: dict.landing.howItWorks.step3.title,
      description: dict.landing.howItWorks.step3.desc,
    },
  ]

  const trustPoints = [
    { icon: Star, title: dict.landing.trustPoints.p1, description: "" },
    { icon: Clock, title: dict.landing.trustPoints.p2, description: "" },
    { icon: CheckCircle2, title: dict.landing.trustPoints.p3, description: "" },
  ]

  return (
    <div className="flex flex-col">
      {/* Photographer Profile Header (At the Very Top) - Enlarge visuals */}
      <section className="bg-muted/10 border-b">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center gap-8">
          {profile.imageUrl && (
            <div className="relative h-36 w-36 sm:h-48 sm:w-48 lg:h-56 lg:w-56 rounded-3xl overflow-hidden border-4 border-primary/10 shadow-xl shrink-0">
              <img
                src={profile.imageUrl}
                alt={profile.name}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="text-center sm:text-left space-y-4 flex-1">
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{profile.name}</h2>
              <p className="text-primary font-semibold text-lg">{activeTitle}</p>
            </div>
            <p className="text-muted-foreground text-base max-w-3xl leading-relaxed whitespace-pre-wrap">
              {activeBio}
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <PortfolioSection
        portfolioItems={portfolioItems}
        categories={categories}
        lang={lang}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {dict.landing.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {dict.landing.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href={`/${lang}/booking`}>
                {dict.landing.hero.ctaBook}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/${lang}/services`}>{dict.landing.hero.ctaBrowse}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {services.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">{dict.services.title}</h2>
              <p className="text-muted-foreground">
                {dict.services.subtitle}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} lang={lang} />
              ))}
            </div>
            {rawServices.length > 3 && (
              <div className="text-center mt-8">
                <Button asChild variant="outline">
                  <Link href={`/${lang}/services`}>View All Services</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">{dict.landing.howItWorks.title}</h2>
            <p className="text-muted-foreground">
              Book your photography session in 3 simple steps
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {processSteps.map((step, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Why Choose Us</h2>
            <p className="text-muted-foreground">
              Quality service you can trust
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {trustPoints.map((point, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <point.icon className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{point.title}</h3>
                  {point.description && (
                    <p className="text-sm text-muted-foreground">
                      {point.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to Book?</h2>
          <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">
            Don&apos;t wait — secure your preferred date and time now.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href={`/${lang}/booking`}>
              Book Your Session
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

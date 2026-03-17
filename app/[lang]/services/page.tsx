import { ServiceCard } from "@/components/services/service-card"
import { EmptyState } from "@/components/shared/states"
import { getActiveServices } from "@/lib/services/service"
import { getDictionary } from "@/lib/dictionaries"
import type { ServiceItem } from "@/types"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "id" }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return {
    title: `${dict.services.title} — Ashraf`,
    description: dict.services.subtitle,
  }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: "en" | "id" }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  const rawServices = await getActiveServices()

  const services: ServiceItem[] = rawServices.map((s: any) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    price: Number(s.price),
    durationMinutes: s.durationMinutes,
    isActive: s.isActive,
  }))

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">{dict.services.title}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {dict.services.subtitle}
        </p>
      </div>

      {services.length === 0 ? (
        <EmptyState
          title={dict.services.empty}
          description="Please check back later for our photography packages."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} lang={lang} />
          ))}
        </div>
      )}
    </div>
  )
}

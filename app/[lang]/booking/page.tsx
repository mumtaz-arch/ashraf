import { Suspense } from "react"
import { BookingForm } from "@/components/booking/booking-form"
import { LoadingState } from "@/components/shared/states"
import { getDictionary } from "@/lib/dictionaries"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: "en" | "id" }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return {
    title: `${dict.booking.title} — Ashraf`,
    description: dict.booking.subtitle,
  }
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ lang: "en" | "id" }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{dict.booking.title}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {dict.booking.subtitle}
        </p>
      </div>

      <Suspense fallback={<LoadingState title="Loading booking form..." />}>
        <BookingForm dict={dict.booking.form} lang={lang} />
      </Suspense>
    </div>
  )
}

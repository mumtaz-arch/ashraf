import Link from "next/link"
import { Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ServiceItem } from "@/types"

interface ServiceCardProps {
  service: ServiceItem
  lang: "en" | "id"
}

export function ServiceCard({ service, lang }: ServiceCardProps) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(service.price)

  return (
    <Card className="flex flex-col h-full transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {service.description && (
          <p className="text-sm text-muted-foreground">{service.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5 font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            {formattedPrice}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {service.durationMinutes} min
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/${lang}/booking?service=${service.slug}`}>Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

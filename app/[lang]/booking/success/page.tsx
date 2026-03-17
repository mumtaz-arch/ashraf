import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Booking Submitted — Ashraf",
  description: "Your booking request has been submitted successfully.",
}

interface PageProps {
  searchParams: Promise<{ ref?: string }>
}

export default async function BookingSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const referenceCode = params.ref

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-bold">Booking Request Submitted!</h1>

          <p className="text-muted-foreground max-w-md mx-auto">
            Thank you! Your booking request has been received. We&apos;ll review it
            and get back to you shortly.
          </p>

          {referenceCode && (
            <div className="bg-muted rounded-lg p-4 inline-block">
              <p className="text-sm text-muted-foreground mb-1">
                Your Reference Code
              </p>
              <p className="text-2xl font-mono font-bold tracking-wider">
                {referenceCode}
              </p>
            </div>
          )}

          <div className="pt-2 space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>What happens next?</strong>
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 text-left max-w-xs mx-auto">
              <li>✓ We review your booking request</li>
              <li>✓ We confirm availability for your chosen slot</li>
              <li>✓ You&apos;ll be contacted with a confirmation</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services">View More Services</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

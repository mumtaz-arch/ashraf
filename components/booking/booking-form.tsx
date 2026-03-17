"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { id as localeId, enUS } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TimeSlotSelector } from "@/components/booking/time-slot-selector"
import { cn } from "@/lib/utils"
import type { ServiceItem, AvailableSlot, ApiResponse } from "@/types"

interface BookingFormProps {
  dict: {
    service: string
    date: string
    time: string
    name: string
    phone: string
    email: string
    note: string
    submit: string
  }
  lang: "en" | "id"
}

export function BookingForm({ dict, lang }: BookingFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get("service")
  
  const dateLocale = lang === "id" ? localeId : enUS

  // ─── State ─────────────────────────────────────────
  const [services, setServices] = useState<ServiceItem[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerNote, setCustomerNote] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [slots, setSlots] = useState<AvailableSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ─── Fetch services ────────────────────────────────
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services")
        const json: ApiResponse<ServiceItem[]> = await res.json()
        if (json.success && json.data) {
          setServices(json.data)
          if (preselectedService) {
            const match = json.data.find((s) => s.slug === preselectedService)
            if (match) setSelectedServiceId(match.id)
          }
        }
      } catch {
        console.error("Failed to fetch services")
      } finally {
        setLoadingServices(false)
      }
    }
    fetchServices()
  }, [preselectedService])

  // ─── Fetch available slots when date changes ──────
  const fetchSlots = useCallback(async (date: Date) => {
    setLoadingSlots(true)
    setSlots([])
    setSelectedSlot(null)
    try {
      const dateStr = format(date, "yyyy-MM-dd")
      const res = await fetch(`/api/availability?date=${dateStr}`)
      const json: ApiResponse<AvailableSlot[]> = await res.json()
      if (json.success && json.data) {
        setSlots(json.data)
      }
    } catch {
      console.error("Failed to fetch slots")
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate)
    }
  }, [selectedDate, fetchSlots])

  // ─── Form validation ──────────────────────────────
  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!customerName.trim()) newErrors.customerName = "Name is required"
    if (!customerPhone.trim()) newErrors.customerPhone = "Phone is required"
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      newErrors.customerEmail = "Invalid email"
    }
    if (!selectedServiceId) newErrors.serviceId = "Please select a service"
    if (!selectedDate) newErrors.date = "Please select a date"
    if (!selectedSlot) newErrors.slot = "Please select a time slot"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ─── Submit ────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setErrors({})

    try {
      const body = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        serviceId: selectedServiceId,
        slotId: selectedSlot!.id,
        bookingDate: format(selectedDate!, "yyyy-MM-dd"),
        startTime: selectedSlot!.startTime,
        customerNote: customerNote.trim() || undefined,
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const json: ApiResponse = await res.json()

      if (json.success && json.data) {
        const result = json.data as { referenceCode: string }
        router.push(`/${lang}/booking/success?ref=${result.referenceCode}`)
      } else {
        if (json.errors) {
          const flatErrors: Record<string, string> = {}
          for (const [key, msgs] of Object.entries(json.errors)) {
            flatErrors[key] = (msgs as string[]).join(", ")
          }
          setErrors(flatErrors)
        } else {
          setErrors({ form: json.message || "Booking failed" })
        }
      }
    } catch {
      setErrors({ form: "Something went wrong. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{dict.submit}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {errors.form}
            </div>
          )}

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-muted-foreground mb-2">
              Your Details
            </legend>

            <div className="space-y-2">
              <Label htmlFor="customerName">{dict.name} *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
              />
              {errors.customerName && (
                <p className="text-sm text-destructive">{errors.customerName}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerPhone">{dict.phone} *</Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+62 812 3456 7890"
                />
                {errors.customerPhone && (
                  <p className="text-sm text-destructive">{errors.customerPhone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">{dict.email}</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                {errors.customerEmail && (
                  <p className="text-sm text-destructive">{errors.customerEmail}</p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label>{dict.service} *</Label>
            {loadingServices ? (
              <div className="h-10 rounded-md bg-muted animate-pulse" />
            ) : (
              <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} — {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(s.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.serviceId && (
              <p className="text-sm text-destructive">{errors.serviceId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{dict.date} *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP", { locale: dateLocale }) : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < tomorrow}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>

          {selectedDate && (
            <div className="space-y-2">
              <Label>{dict.time} *</Label>
              <TimeSlotSelector
                slots={slots}
                selectedSlotId={selectedSlot?.id ?? null}
                onSelect={setSelectedSlot}
                isLoading={loadingSlots}
              />
              {errors.slot && (
                <p className="text-sm text-destructive">{errors.slot}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="customerNote">{dict.note}</Label>
            <Textarea
              id="customerNote"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              dict.submit
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

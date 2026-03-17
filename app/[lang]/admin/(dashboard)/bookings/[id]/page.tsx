"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { LoadingState, ErrorState } from "@/components/shared/states"
import type { ApiResponse } from "@/types"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
  COMPLETED: "bg-purple-100 text-purple-800",
  RESCHEDULED: "bg-blue-100 text-blue-800",
}

const ACTIONS: Record<string, { label: string; status: string; variant: "default" | "destructive" | "outline" }[]> = {
  PENDING: [
    { label: "Confirm", status: "CONFIRMED", variant: "default" },
    { label: "Reject", status: "REJECTED", variant: "destructive" },
    { label: "Cancel", status: "CANCELLED", variant: "outline" },
  ],
  CONFIRMED: [
    { label: "Complete", status: "COMPLETED", variant: "default" },
    { label: "Cancel", status: "CANCELLED", variant: "destructive" },
    { label: "Reschedule", status: "RESCHEDULED", variant: "outline" },
  ],
  RESCHEDULED: [
    { label: "Confirm", status: "CONFIRMED", variant: "default" },
    { label: "Cancel", status: "CANCELLED", variant: "destructive" },
  ],
}

interface BookingDetail {
  id: string
  referenceCode: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  bookingDate: string
  startTime: string
  status: string
  customerNote: string | null
  adminNote: string | null
  createdAt: string
  updatedAt: string
  service: { name: string; price: number; durationMinutes: number }
  slot: { date: string; startTime: string; endTime: string }
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [adminNote, setAdminNote] = useState("")
  const [error, setError] = useState("")

  const fetchBooking = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`)
      const json: ApiResponse<BookingDetail> = await res.json()
      if (json.success && json.data) {
        setBooking(json.data)
        setAdminNote(json.data.adminNote || "")
      }
    } catch {
      console.error("Failed to fetch booking")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBooking()
  }, [fetchBooking])

  async function handleStatusUpdate(newStatus: string) {
    setUpdating(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, adminNote: adminNote.trim() || undefined }),
      })
      const json = await res.json()
      if (json.success) {
        await fetchBooking()
      } else {
        setError(json.message || "Update failed")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setUpdating(false)
    }
  }

  async function handleSaveNote() {
    setUpdating(true)
    setError("")
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: adminNote.trim() }),
      })
      const json = await res.json()
      if (!json.success) setError(json.message || "Failed to save note")
      else await fetchBooking()
    } catch {
      setError("Something went wrong")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <LoadingState title="Loading booking..." />
  if (!booking) return <ErrorState title="Booking not found" />

  const actions = ACTIONS[booking.status] || []

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{booking.referenceCode}</h1>
        <Badge className={statusColors[booking.status] || ""} variant="secondary">
          {booking.status}
        </Badge>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Customer Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Customer</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Name:</span> {booking.customerName}</div>
            <div><span className="text-muted-foreground">Phone:</span> {booking.customerPhone}</div>
            {booking.customerEmail && (
              <div><span className="text-muted-foreground">Email:</span> {booking.customerEmail}</div>
            )}
            {booking.customerNote && (
              <div><span className="text-muted-foreground">Note:</span> {booking.customerNote}</div>
            )}
          </CardContent>
        </Card>

        {/* Service & Schedule */}
        <Card>
          <CardHeader><CardTitle className="text-base">Service & Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><span className="text-muted-foreground">Service:</span> {booking.service.name}</div>
            <div>
              <span className="text-muted-foreground">Price:</span>{" "}
              {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(booking.service.price)}
            </div>
            <div><span className="text-muted-foreground">Date:</span> {booking.bookingDate}</div>
            <div><span className="text-muted-foreground">Time:</span> {booking.slot.startTime} – {booking.slot.endTime}</div>
            <div><span className="text-muted-foreground">Duration:</span> {booking.service.durationMinutes} min</div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Note */}
      <Card>
        <CardHeader><CardTitle className="text-base">Admin Note</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Internal notes about this booking..."
            rows={3}
          />
          <Button variant="outline" size="sm" onClick={handleSaveNote} disabled={updating}>
            Save Note
          </Button>
        </CardContent>
      </Card>

      {/* Status Actions */}
      {actions.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => (
                <Button
                  key={action.status}
                  variant={action.variant}
                  onClick={() => handleStatusUpdate(action.status)}
                  disabled={updating}
                >
                  {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2, Lock, Unlock, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LoadingState, EmptyState } from "@/components/shared/states"
import { cn } from "@/lib/utils"
import type { ApiResponse } from "@/types"

interface SlotRow {
  id: string
  date: string
  startTime: string
  endTime: string
  isBlocked: boolean
  note: string | null
  bookings: { id: string; status: string; referenceCode: string; customerName: string }[]
}

export default function AdminAvailabilityPage() {
  const [slots, setSlots] = useState<SlotRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [addOpen, setAddOpen] = useState(false)
  const [newStart, setNewStart] = useState("09:00")
  const [newEnd, setNewEnd] = useState("10:30")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const fetchSlots = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedDate) params.set("date", format(selectedDate, "yyyy-MM-dd"))

    try {
      const res = await fetch(`/api/admin/availability?${params}`)
      const json: ApiResponse<SlotRow[]> = await res.json()
      if (json.success && json.data) setSlots(json.data)
    } catch {
      console.error("Failed to fetch slots")
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  async function handleAddSlot() {
    if (!selectedDate) return
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/admin/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: format(selectedDate, "yyyy-MM-dd"),
          startTime: newStart,
          endTime: newEnd,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setAddOpen(false)
        setNewStart("09:00")
        setNewEnd("10:30")
        await fetchSlots()
      } else {
        setError(json.message || "Failed to add slot")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggleBlock(slot: SlotRow) {
    try {
      await fetch(`/api/admin/availability/${slot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !slot.isBlocked }),
      })
      await fetchSlots()
    } catch {
      console.error("Failed to toggle block")
    }
  }

  async function handleDelete(slotId: string) {
    if (!confirm("Delete this slot?")) return
    try {
      const res = await fetch(`/api/admin/availability/${slotId}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        await fetchSlots()
      } else {
        alert(json.message || "Failed to delete")
      }
    } catch {
      alert("Something went wrong")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Availability Management</h1>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Date Picker */}
        <Card className="w-full sm:w-auto">
          <CardContent className="pt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full sm:w-64 justify-start", !selectedDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "All dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSelectedDate(undefined)}>
                Clear filter
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Add Slot */}
        {selectedDate && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Add Slot</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Time Slot for {format(selectedDate, "PPP")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="time" value={newStart} onChange={(e) => setNewStart(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="time" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleAddSlot} disabled={submitting} className="w-full">
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : "Add Slot"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Slot List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate ? `Slots for ${format(selectedDate, "PPP")}` : "All Slots"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState title="Loading slots..." />
          ) : slots.length === 0 ? (
            <EmptyState
              title="No slots found"
              description={selectedDate ? "Add a slot for this date using the button above." : "Select a date to manage slots."}
            />
          ) : (
            <div className="space-y-2">
              {slots.map((slot) => (
                <div key={slot.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{slot.startTime} – {slot.endTime}</span>
                      {!selectedDate && <span className="text-sm text-muted-foreground">({slot.date})</span>}
                      {slot.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                    </div>
                    {slot.bookings.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {slot.bookings.map((b) => `${b.referenceCode} (${b.status})`).join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={slot.isBlocked ? "Unblock" : "Block"}
                      onClick={() => handleToggleBlock(slot)}
                    >
                      {slot.isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => handleDelete(slot.id)}
                      disabled={slot.bookings.length > 0}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

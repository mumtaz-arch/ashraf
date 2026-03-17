"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { AvailableSlot } from "@/types"

interface TimeSlotSelectorProps {
  slots: AvailableSlot[]
  selectedSlotId: string | null
  onSelect: (slot: AvailableSlot) => void
  isLoading?: boolean
}

export function TimeSlotSelector({
  slots,
  selectedSlotId,
  onSelect,
  isLoading,
}: TimeSlotSelectorProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-md bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No available slots for this date. Please pick another date.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {slots.map((slot) => (
        <Button
          key={slot.id}
          type="button"
          variant={selectedSlotId === slot.id ? "default" : "outline"}
          className={cn(
            "h-10 text-sm",
            selectedSlotId === slot.id && "ring-2 ring-primary ring-offset-2"
          )}
          onClick={() => onSelect(slot)}
        >
          {slot.startTime} – {slot.endTime}
        </Button>
      ))}
    </div>
  )
}

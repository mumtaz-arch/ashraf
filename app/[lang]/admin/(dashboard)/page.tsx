import prisma from "@/lib/prisma"
import { BookingStatus } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, CalendarDays, Clock, CheckCircle2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [totalBookings, pendingCount, confirmedCount, completedCount, recentBookings] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      prisma.booking.findMany({
        where: { status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] } },
        include: { service: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ])

  const stats = [
    { label: "Total Bookings", value: totalBookings, icon: BookOpen, color: "text-blue-600" },
    { label: "Pending", value: pendingCount, icon: Clock, color: "text-yellow-600" },
    { label: "Confirmed", value: confirmedCount, icon: CalendarDays, color: "text-green-600" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-purple-600" },
  ]

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    COMPLETED: "bg-purple-100 text-purple-800",
    RESCHEDULED: "bg-blue-100 text-blue-800",
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={cn2(stat.color)}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Link
            href="/admin/bookings"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No pending or confirmed bookings
            </p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <Link
                  key={b.id}
                  href={`/admin/bookings/${b.id}`}
                  className="flex items-center justify-between rounded-md border p-3 hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.referenceCode} · {b.service.name} ·{" "}
                      {b.bookingDate.toISOString().split("T")[0]}
                    </p>
                  </div>
                  <Badge className={statusColors[b.status] || ""} variant="secondary">
                    {b.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Simple className helper (no cn needed for single class)
function cn2(className: string) {
  return className
}

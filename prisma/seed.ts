import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // ─── Admin User ────────────────────────────────────
  const passwordHash = await bcrypt.hash("admin123", 10)
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@photo.local" },
    update: {},
    create: {
      email: "admin@photo.local",
      passwordHash,
      name: "Admin",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  })
  console.log(`✅ Admin user seeded: ${admin.email}`)

  // ─── Services ──────────────────────────────────────
  const services = await Promise.all([
    prisma.service.upsert({
      where: { slug: "wedding-photography" },
      update: {},
      create: {
        name: "Wedding Photography",
        slug: "wedding-photography",
        description:
          "Full-day wedding coverage capturing every beautiful moment. Includes pre-ceremony, ceremony, and reception photos.",
        price: 8500000,
        durationMinutes: 480,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { slug: "portrait-session" },
      update: {},
      create: {
        name: "Portrait Session",
        slug: "portrait-session",
        description:
          "Professional portrait photography for individuals, couples, or families. Studio or outdoor setting available.",
        price: 1500000,
        durationMinutes: 90,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { slug: "product-photography" },
      update: {},
      create: {
        name: "Product Photography",
        slug: "product-photography",
        description:
          "High-quality product shots for e-commerce, catalogs, and marketing materials. Up to 20 products per session.",
        price: 2500000,
        durationMinutes: 120,
        isActive: true,
      },
    }),
    prisma.service.upsert({
      where: { slug: "event-coverage" },
      update: {},
      create: {
        name: "Event Coverage",
        slug: "event-coverage",
        description:
          "Professional photography for corporate events, parties, and special occasions. Half-day coverage included.",
        price: 5000000,
        durationMinutes: 240,
        isActive: true,
      },
    }),
  ])

  console.log(`✅ ${services.length} services seeded`)

  // ─── Availability Slots (next 14 days) ────────────
  const slotTimes = [
    { start: "08:00", end: "09:30" },
    { start: "09:30", end: "11:00" },
    { start: "11:00", end: "12:30" },
    { start: "13:00", end: "14:30" },
    { start: "14:30", end: "16:00" },
    { start: "16:00", end: "17:30" },
  ]

  let slotCount = 0
  const today = new Date()

  for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
    const date = new Date(today)
    date.setDate(date.getDate() + dayOffset)
    const dateOnly = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )

    if (dayOffset % 7 === 0) continue

    for (const time of slotTimes) {
      const isBlocked = dayOffset === 3 && time.start === "13:00"

      await prisma.availabilitySlot.upsert({
        where: {
          date_startTime_endTime: {
            date: dateOnly,
            startTime: time.start,
            endTime: time.end,
          },
        },
        update: {},
        create: {
          date: dateOnly,
          startTime: time.start,
          endTime: time.end,
          isBlocked,
          note: isBlocked ? "Blocked for personal appointment" : null,
        },
      })
      slotCount++
    }
  }

  console.log(`✅ ${slotCount} availability slots seeded`)
  console.log("🎉 Seeding complete!")
  console.log("\n📋 Admin login credentials:")
  console.log("   Email: admin@photo.local")
  console.log("   Password: admin123")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

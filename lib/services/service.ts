import prisma from "@/lib/prisma"

export async function getActiveServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({
    where: { slug },
  })
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({
    where: { id },
  })
}

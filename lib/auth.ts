import { cookies } from "next/headers"
import { createHmac, randomBytes } from "crypto"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

const SESSION_COOKIE = "admin_session"
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production"
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours in seconds

/**
 * Sign a payload into a token string
 */
function signToken(payload: string): string {
  const signature = createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex")
  return `${Buffer.from(payload).toString("base64")}.${signature}`
}

/**
 * Verify and decode a signed token
 */
function verifyToken(token: string): string | null {
  const [encodedPayload, signature] = token.split(".")
  if (!encodedPayload || !signature) return null

  const payload = Buffer.from(encodedPayload, "base64").toString()
  const expectedSignature = createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex")

  if (signature !== expectedSignature) return null
  return payload
}

/**
 * Verify admin credentials and create a session
 */
export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } })
  if (!admin || !admin.isActive) return null

  const valid = await bcrypt.compare(password, admin.passwordHash)
  if (!valid) return null

  // Create session token
  const sessionData = JSON.stringify({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
    nonce: randomBytes(8).toString("hex"),
  })

  const token = signToken(sessionData)

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })

  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
}

/**
 * Get current admin session from cookies
 */
export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  try {
    const data = JSON.parse(payload)
    if (data.exp < Date.now()) return null
    return { id: data.id, email: data.email, name: data.name, role: data.role }
  } catch {
    return null
  }
}

/**
 * Verify admin session — throws if not authenticated.
 * Use in API route handlers.
 */
export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

/**
 * Clear admin session
 */
export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

/**
 * Hash a password for storage
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

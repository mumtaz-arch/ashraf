import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login — Ashraf",
}

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

"use client"

import { useState, useEffect } from "react"
import { Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingState } from "@/components/shared/states"

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState({
    name: "",
    title: "",
    titleEn: "",
    bio: "",
    bioEn: "",
    imageUrl: "",
    logoUrl: "",
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile")
        const json = await res.json()
        if (json.success && json.data) {
          setForm({
            name: json.data.name || "",
            title: json.data.title || "",
            titleEn: json.data.titleEn || "",
            bio: json.data.bio || "",
            bioEn: json.data.bioEn || "",
            imageUrl: json.data.imageUrl || "",
            logoUrl: json.data.logoUrl || "",
          })
        }
      } catch (err) {
        console.error("Failed to fetch profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")
    setSuccess("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/admin/profile/upload", {
        method: "POST",
        body: formData,
      })
      const json = await res.json()

      if (json.success) {
        setForm((prev) => ({ ...prev, imageUrl: json.url }))
        setSuccess("Image uploaded successfully")
      } else {
        setError(json.message || "Upload failed")
      }
    } catch {
      setError("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (json.success) {
        setSuccess("Profile updated successfully")
      } else {
        setError(json.message || "Failed to update profile")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingState title="Loading profile settings..." />

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your public biography and title.</p>
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 font-medium">{success}</div>}

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>This information will be displayed on the public Profile page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ashraf"
            />
          </div>

          <div className="space-y-4">
            <Label>Avatar Image</Label>
            <div className="flex items-center gap-4">
              {form.imageUrl && (
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm shrink-0">
                  <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  {uploading ? "Uploading..." : "Pilih file gambar untuk mengganti avatar (Upload otomatis)"}
                </p>
              </div>
            </div>
            {form.imageUrl && (
              <div className="space-y-1">
                <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">Atau gunakan URL Link</Label>
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Navbar Icon / Logo</Label>
            <div className="flex items-center gap-4">
              {form.logoUrl ? (
                <div className="h-16 w-16 rounded-xl overflow-hidden border bg-background p-2 flex items-center justify-center shrink-0">
                  <img src={form.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-xl border-2 border-dashed flex items-center justify-center text-muted-foreground text-xs shrink-0">
                  No Icon
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploading(true)
                    const formData = new FormData()
                    formData.append("file", file)
                    try {
                      const res = await fetch("/api/admin/profile/upload", { method: "POST", body: formData })
                      const json = await res.json()
                      if (json.success) setForm((p) => ({ ...p, logoUrl: json.url }))
                    } catch {} finally { setUploading(false) }
                  }}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Pilih file ikon/logo (PNG disarankan dengan transparansi)</p>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Indonesian Context */}
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm">Indonesia (ID)</h3>
            <div className="space-y-2">
              <Label htmlFor="title">Title (ID) *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Fotografer Pernikahan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (ID) *</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={5}
                placeholder="Ceritakan tentang diri Anda..."
              />
            </div>
          </div>

          {/* English Context */}
          <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
            <h3 className="font-semibold text-sm">English (EN)</h3>
            <div className="space-y-2">
              <Label htmlFor="titleEn">Title (EN)</Label>
              <Input
                id="titleEn"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Wedding Photographer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bioEn">Bio (EN)</Label>
              <Textarea
                id="bioEn"
                value={form.bioEn}
                onChange={(e) => setForm({ ...form, bioEn: e.target.value })}
                rows={5}
                placeholder="Tell something about yourself..."
              />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={submitting} className="w-full sm:w-auto">
            {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

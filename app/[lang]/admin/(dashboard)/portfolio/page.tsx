"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingState, EmptyState } from "@/components/shared/states"
import type { ApiResponse } from "@/types"

interface PortfolioItem {
  id: string
  title: string
  titleEn: string | null
  description: string | null
  descriptionEn: string | null
  imageUrl: string
  category: string | null
  orientation: string
  isActive: boolean
}

const emptyForm = {
  title: "",
  titleEn: "",
  description: "",
  descriptionEn: "",
  imageUrl: "",
  category: "",
  orientation: "square",
  isActive: true,
}

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/portfolio")
      const json: ApiResponse<PortfolioItem[]> = await res.json()
      if (json.success && json.data) setItems(json.data)
    } catch {
      console.error("Failed to fetch portfolio items")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setError("")
    setDialogOpen(true)
  }

  function openEdit(item: PortfolioItem) {
    setEditingId(item.id)
    setForm({
      title: item.title,
      titleEn: item.titleEn || "",
      description: item.description || "",
      descriptionEn: item.descriptionEn || "",
      imageUrl: item.imageUrl,
      category: item.category || "",
      orientation: item.orientation || "square",
      isActive: item.isActive,
    })
    setError("")
    setDialogOpen(true)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError("")
    try {
      const url = editingId ? `/api/admin/portfolio/${editingId}` : "/api/admin/portfolio"
      const method = editingId ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const json = await res.json()

      if (json.success) {
        setDialogOpen(false)
        await fetchItems()
      } else {
        setError(json.message || "Operation failed")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this portfolio item?")) return
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) await fetchItems()
      else alert(json.message || "Failed to delete")
    } catch {
      alert("Something went wrong")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Manage gallery images showcased on the profile.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingState title="Loading items..." />
          ) : items.length === 0 ? (
            <EmptyState title="No items found" description="Add your first portfolio work to showcase." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Orientation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="h-10 w-10 relative rounded overflow-hidden border">
                          <img src={item.imageUrl} alt={item.title} className="object-cover h-full w-full" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <p>{item.title}</p>
                          {item.titleEn && <p className="text-xs text-muted-foreground">{item.titleEn}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{item.category || "-"}</TableCell>
                      <TableCell className="capitalize">{item.orientation}</TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Create/Edit */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Item" : "Create Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (ID) *</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleEn">Title (EN)</Label>
                <Input id="titleEn" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description (ID)</Label>
                <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">Description (EN)</Label>
                <Textarea id="descriptionEn" value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows={2} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Wedding" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orientation">Orientation</Label>
                <Select value={form.orientation} onValueChange={(val) => setForm({ ...form, orientation: val })}>
                  <SelectTrigger id="orientation">
                    <SelectValue placeholder="Select Layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                    <SelectItem value="portrait">Portrait</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Image *</Label>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
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
                        const res = await fetch("/api/admin/portfolio/upload", {
                          method: "POST",
                          body: formData,
                        })
                        const json = await res.json()
                        if (json.success) {
                          setForm((prev) => ({ ...prev, imageUrl: json.url }))
                        } else {
                          setError(json.message || "Failed to upload image")
                        }
                      } catch {
                        setError("Something went wrong during upload")
                      } finally {
                        setUploading(false)
                      }
                    }}
                    disabled={uploading}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    {uploading ? "Uploading..." : "Pilih file gambar untuk portfolio (Upload otomatis)"}
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">Or use URL Link</Label>
                  <Input
                    id="imageUrl"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            </div>

            {form.imageUrl && (
              <div className="relative aspect-video rounded border overflow-hidden mt-2">
                <img src={form.imageUrl} alt="Preview" className="object-cover w-full h-full" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <Button onClick={handleSubmit} disabled={submitting} className="w-full">
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

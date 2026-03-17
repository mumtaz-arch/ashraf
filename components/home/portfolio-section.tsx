"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PortfolioItem {
  id: string
  title: string
  titleEn: string | null
  description: string | null
  descriptionEn: string | null
  imageUrl: string
  category: string | null
  orientation: string
}

interface PortfolioSectionProps {
  portfolioItems: PortfolioItem[]
  categories: string[]
  lang: "en" | "id"
}

export function PortfolioSection({ portfolioItems, categories, lang }: PortfolioSectionProps) {
  const INITIAL_COUNT = 6
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)

  if (portfolioItems.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Portfolio</h2>
            <p className="text-muted-foreground">Karya-karya terbaik pilihan kami</p>
          </div>
          <p className="text-center text-muted-foreground py-10">Belum ada item portofolio.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Portfolio</h2>
          <p className="text-muted-foreground">Karya-karya terbaik pilihan kami</p>
        </div>

        <Tabs defaultValue="All" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-flow-col auto-cols-max">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} onClick={() => setVisibleCount(INITIAL_COUNT)}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((cat) => {
            const filteredItems = portfolioItems.filter((item) => cat === "All" || item.category === cat)
            const visibleItems = filteredItems.slice(0, visibleCount)
            const hasMore = filteredItems.length > visibleCount

            return (
              <TabsContent key={cat} value={cat} className="mt-0">
                {/* 
                  Dense grid layout utilizing the item.orientation.
                  A basic mapping: 
                  - landscape: spans 2 columns
                  - portrait: spans 2 rows
                  - square: spans 1 col/1 row
                */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px] gap-4">
                  {visibleItems.map((item) => {
                    const itemTitle = lang === "id" ? item.title : (item.titleEn || item.title)
                    
                    let layoutClasses = "col-span-1 row-span-1" // Default strictly square behavior
                    switch (item.orientation) {
                      case "landscape":
                        layoutClasses = "md:col-span-2 col-span-1 row-span-1"
                        break
                      case "portrait":
                        layoutClasses = "col-span-1 md:row-span-2 row-span-1"
                        break
                      case "square":
                        // square behaves as default
                        break
                    }

                    return (
                      <Card 
                        key={item.id} 
                        className={`group cursor-pointer hover:shadow-xl transition-all duration-300 ${layoutClasses} border-0 rounded-xl relative overflow-hidden`}
                      >
                        <CardContent className="p-0 h-full w-full">
                          <Image
                            src={item.imageUrl}
                            alt={itemTitle}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                            <h3 className="font-semibold text-lg">{itemTitle}</h3>
                            {item.category && <span className="text-[10px] bg-primary px-2 py-0.5 rounded mt-1 self-start">{item.category}</span>}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <Button 
                      variant="outline" 
                      onClick={() => setVisibleCount((prev) => prev + INITIAL_COUNT)}
                      className="px-8"
                    >
                      {lang === "id" ? "Selengkapnya" : "Load More"}
                    </Button>
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}

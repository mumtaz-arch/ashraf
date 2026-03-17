import Link from "next/link"
import { Camera, Mail, Phone, MapPin } from "lucide-react"

interface FooterProps {
  dict: {
    description: string
    quickLinks: string
    contact: string
    rights: string
  }
  navDict: {
    home: string
    services: string
    bookNow: string
  }
  lang: "en" | "id"
}

export function Footer({ dict, navDict, lang }: FooterProps) {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href={`/${lang}`} className="flex items-center gap-2 font-semibold text-lg mb-3">
              <Camera className="h-5 w-5" />
              <span>Ashraf</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {dict.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">{dict.quickLinks}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href={`/${lang}`} className="hover:text-foreground transition-colors">
                  {navDict.home}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/services`} className="hover:text-foreground transition-colors">
                  {navDict.services}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/booking`} className="hover:text-foreground transition-colors">
                  {navDict.bookNow}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">{dict.contact}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>hello@photoappointment.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ashraf. {dict.rights}
        </div>
      </div>
    </footer>
  )
}
